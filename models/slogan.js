import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '宣傳標題為必填']
  },
  subtitle: {
    type: String,
    required: [true, '宣傳副標為必填']
  },
  content: {
    type: String,
    required: [true, '宣傳內容為必填']
  },
  image: {
    type: [String]
  }
}, { versionKey: false })

export default mongoose.model('slogan', schema)
