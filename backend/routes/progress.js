import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

router.post('/visit', authMiddleware, async (req, res) => {
  try {
    const { algorithmId } = req.body
    if (!algorithmId) return res.status(400).json({ error: 'algorithmId is required' })

    await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { visitedAlgorithms: algorithmId } },
      { new: true }
    )

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Could not save progress' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch user data' })
  }
})

export default router