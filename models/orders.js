import mongoose from 'mongoose'
// import validator from 'validator'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    // 將 ref 對到 users，如此一來就可以使用 populate 去取得 user 的資料
    ref: 'users',
    required: [true, '缺少使用者資訊']
  },
  products: [
    {
      product: {
        type: mongoose.ObjectId,
        ref: 'products',
        required: [true, '缺少商品資訊']
      },
      quantity: {
        type: Number,
        required: [true, '缺少商品數量']
      },
      price: {
        type: Number
      }
    }
  ],
  date: {
    type: Date,
    // required: true,
    default: Date.now()
  }
  // deliveryFee: {
  //   // 60 = 超商取貨
  //   // 80 = 宅配
  //   type: Number,
  //   required: true,
  //   default: 0
  // },
  // total: {
  //   type: Number,
  //   required: true,
  //   default: 0
  // },
  // payWay: {
  //   // 0 = 未選擇
  //   // 1 = ATM 轉帳
  //   // 2 = 貨到付款
  //   type: Number,
  //   required: [true, '付款方式為必填'],
  //   default: 0
  // },
  // receiver: {
  //   type: String,
  //   required: [true, '收貨人姓名為必填'],
  //   minlength: [2, '收貨人姓名至少 2 個字以上']
  // },
  // receiverPhone: {
  //   type: String,
  //   required: [true, '收貨人手機為必填'],
  //   minlength: [10, '手機號碼為 10 個數字'],
  //   maxlength: [10, '手機號碼為 10 個數字'],
  //   match: [/^09[0-9]{8}$/, '手機號碼格式錯誤']
  // },
  // receiverEmail: {
  //   type: String,
  //   required: [true, '收貨人信箱為必填'],
  //   validate: {
  //     validator (email) {
  //       return validator.isEmail(email)
  //     },
  //     message: '信箱格式錯誤'
  //   }
  // },
  // receiveWay: {
  //   // 0 = 未選擇
  //   // 1 = 宅配到府
  //   // 2 = 超商取貨
  //   type: Number,
  //   required: [true, '收貨方式為必填'],
  //   default: 0
  // },
  // receiverAddress: {
  //   type: String,
  //   required: [true, '收貨人地址為必填(超商取貨請填寫超商名稱、門市名稱、門市地址)']
  // },
  // payStatus: {
  //   // 0 = 未付款
  //   // 1 = 已付款
  //   type: Number,
  //   required: true,
  //   default: 0
  // },
  // deliveryStatus: {
  //   // 0 = 未出貨
  //   // 1 = 配送中
  //   // 2 = 已送達
  //   type: Number,
  //   required: true,
  //   default: 0
  // }
}, { versionKey: false })

export default mongoose.model('orders', schema)
