import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '消息標題為必填']
  },
  content: {
    type: String,
    required: [true, '消息內容為必填']
  },
  date: {
    type: Date,
    default: Date.now()
  },
  show: {
    // true = 已發布
    // false = 未發布
    type: Boolean,
    default: false
  }
}, { versionKey: false })

export default mongoose.model('newses', schema)
