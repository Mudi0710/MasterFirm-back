import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  smallCategory: {
    type: String,
    required: [true, '小分類為必填']
  }
}, { versionKey: false })

export default mongoose.model('smallCategorys', schema)
