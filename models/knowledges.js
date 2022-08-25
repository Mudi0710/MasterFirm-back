import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '專欄標題為必填']
  },
  content: {
    type: String,
    required: [true, '專欄內容為必填']
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
  },
  image: {
    type: [String]
  }
}, { versionKey: false })

export default mongoose.model('knowledges', schema)
