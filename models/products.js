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
  inventory: {
    // true = 有現貨
    // false = 需預訂
    type: Boolean,
    default: false
  },
  sell: {
    // true = 上架
    // false = 下架
    type: Boolean,
    default: false
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
