import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { algorithms } from '../data/algorithms'

function ChatWidget() {
  const { algorithmId } = useParams()
  const currentAlgorithm = algorithms.find((a) => a.id === algorithmId)

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your AlgoVision AI tutor. Ask me anything about the algorithm you're viewing, or CS concepts in general." },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          context: currentAlgorithm ? { algorithmName: currentAlgorithm.name } : null,
        }),
      })

      const data = await response.json()
      const replyText = data.reply || "Sorry, something went wrong. Please try again."
      setMessages((prev) => [...prev, { role: 'assistant', content: replyText }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "I couldn't reach the server. Make sure the backend is running and try again." }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-300/50 flex items-center justify-center text-2xl transition-colors"
        aria-label="Toggle AI chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm h-[70vh] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            <div className="bg-blue-600 text-white px-4 py-3">
              <p className="font-bold text-sm">AlgoVision AI Tutor</p>
              {currentAlgorithm && (
                <p className="text-xs text-blue-100">Viewing: {currentAlgorithm.name}</p>
              )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-400 rounded-xl px-3 py-2 text-sm italic">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 p-3 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                rows={1}
                className="flex-1 resize-none border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget