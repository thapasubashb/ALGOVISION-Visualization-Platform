import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react'
import { algorithms } from '../data/algorithms'

function TypingDots() {
  return (
    <div className="flex gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-blue-400"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function ChatWidget() {
  const { algorithmId } = useParams()
  const currentAlgorithm = algorithms.find((a) => a.id === algorithmId)

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AlgoVision AI tutor 👋 Ask me anything about the algorithm you're viewing, or any CS concept you're curious about.",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen, isLoading])

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  // Auto-resize textarea based on input height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setIsLoading(true)

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

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
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I couldn't reach the server. Make sure the backend is running and try again." },
      ])
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
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400 blur-xl"
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <motion.button
          onClick={() => setIsOpen((o) => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-xl shadow-blue-400/40 flex items-center justify-center"
          aria-label="Toggle AI chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle size={22} />
              </motion.span>
            )}
          </AnimatePresence>

          {!isOpen && (
            <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-teal-400 border-2 border-white" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-[400px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-200/50 border border-white/70 flex flex-col overflow-hidden"
            style={{ transformOrigin: 'bottom right', height: 'min(80vh, 640px)' }}
          >
            <div className="relative bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 text-white px-5 py-4 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base leading-tight">AlgoVision AI</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-teal-300 animate-pulse" />
                  <p className="text-xs text-blue-100 truncate">
                    {currentAlgorithm ? `Viewing: ${currentAlgorithm.name}` : 'Online · Ask me anything'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-sky-50/60 to-white/80 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shrink-0 mt-1 shadow-md">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white border border-blue-50 text-slate-700 rounded-2xl rounded-tl-sm shadow-blue-50'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-white border border-blue-50 rounded-2xl rounded-tl-sm shadow-sm">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Redesigned Input Bar */}
            <div className="p-3 border-t border-slate-100 bg-white/95 backdrop-blur shrink-0">
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl pl-3.5 pr-2 py-1.5 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-200">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  rows={1}
                  className="flex-1 max-h-28 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none leading-relaxed py-1"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-8 h-8 shrink-0 ml-2 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none transition-all duration-150"
                  aria-label="Send message"
                >
                  <Send size={14} className={input.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                </motion.button>
              </div>
              <p className="text-[11px] text-center text-slate-400 mt-1.5 font-medium">
                Press <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-500">Enter</kbd> to send, <kbd className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-500">Shift+Enter</kbd> for line break
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget