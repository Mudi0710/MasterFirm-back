import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import './passport/passport.js'
import usersRouter from './routes/users.js'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import sloganRouter from './routes/slogan.js'
import introductionRouter from './routes/introduction.js'
import noticeRouter from './routes/notice.js'
import newsesRouter from './routes/newses.js'
import knowledgesRouter from './routes/knowledges.js'
import casesRouter from './routes/cases.js'
import servicesRouter from './routes/services.js'
import connectionsRouter from './routes/connections.js'
import localmapRouter from './routes/localmap.js'
import carouselsRouter from './routes/carousels.js'

mongoose.connect(process.env.DB_URL)

const app = express()

app.use(cors({
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求被拒絕' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求格式錯誤' })
})

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/slogan', sloganRouter)
app.use('/introduction', introductionRouter)
app.use('/notice', noticeRouter)
app.use('/newses', newsesRouter)
app.use('/knowledges', knowledgesRouter)
app.use('/cases', casesRouter)
app.use('/services', servicesRouter)
app.use('/connections', connectionsRouter)
app.use('/localmap', localmapRouter)
app.use('/carousels', carouselsRouter)

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到資料' })
})
app.listen(process.env.PORT || 4000, () => {
  console.log('Server is running')
})
