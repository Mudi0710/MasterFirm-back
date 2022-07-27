import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '文章標題為必填']
  },
  content: {
    type: String,
    required: [true, '文章內容為必填']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  show: {
    // true = 上架
    // false = 下架
    type: Boolean,
    default: false
  },
  image: {
    type: [String]
  }
}, { versionKey: false })

export default mongoose.model('newses', schema)
