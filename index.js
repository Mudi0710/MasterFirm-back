import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'

import './passport/passport.js'

mongoose.connect(process.env.DB_URL)

const app = express()

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求格式錯誤' })
})

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('Server is running')
})
