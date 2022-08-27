import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  icon: {
    type: String,
    required: [true, 'Icon 為必填']
  },
  title: {
    type: String,
    required: [true, '聯絡項目為必填']
  },
  content: {
    type: String,
    required: [true, '聯絡資訊為必填']
  }
}, { versionKey: false })

export default mongoose.model('connections', schema)
