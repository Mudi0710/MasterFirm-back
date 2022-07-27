import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '服務項目為必填']
  },
  description: {
    type: String
  },
  sell: {
    // true = 上架
    // false = 下架
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: [true, '服務價格為必填']
  },
  time: {
    type: Number,
    required: [true, '服務時間為必填']
  },
  icon: {
    type: String
  },
  image: {
    type: [String],
    required: [true, '至少需上傳一張圖片']
  }
}, { versionKey: false })

export default mongoose.model('services', schema)
