import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '商品名稱為必填']
  },
  description: {
    type: String,
    required: [true, '商品描述為必填']
  },
  sell: {
    // true = 上架
    // false = 下架
    type: Boolean,
    default: false
  },
  inventory: {
    type: Number,
    required: [true, '庫存狀態為必填'],
    enum: {
      values: ['有現貨', '需預訂'],
      message: '庫存狀態錯誤'
    }
  },
  price: {
    type: Number,
    required: [true, '商品價格為必填']
  },
  image: {
    type: [String],
    required: [true, '至少需上傳一張圖片']
  }
}, { versionKey: false })

export default mongoose.model('products', schema)
