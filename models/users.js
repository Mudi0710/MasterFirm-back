import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  account: {
    type: String,
    required: [true, '會員帳號為必填'],
    minlength: [4, '帳號至少 4 個字元'],
    maxlength: [20, '帳號最多 20 個字元'],
    unique: true,
    match: [/^[a-z0-9]+$/, '格式錯誤，只能由小寫英文及數字組成']
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, '會員姓名為必填'],
    minlength: [2, '會員姓名至少 2 個字以上'],
    match: [/^[\u4e00-\u9fa5]{2,}$/, '會員姓名格式錯誤，應為中文姓名']
  },
  gender: {
    // 0 = 未選擇
    // 1 = 先生
    // 2 = 小姐
    type: Number,
    required: true,
    default: 0
  },
  birthday: {
    type: Date
  },
  email: {
    type: String,
    required: [true, '連絡信箱為必填'],
    unique: true,
    validate: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    }
  },
  tel: {
    type: String,
    required: [true, '手機號碼為必填'],
    minlength: [12, '手機號碼為 10 個數字'],
    maxlength: [12, '手機號碼為 10 個數字'],
    unique: true,
    match: [/^09[0-9]{2}.[0-9]{3}.[0-9]{3}$/, '手機號碼格式錯誤，應為 09 開頭']
  },
  address: {
    type: String
  },
  role: {
    // 0 = 一般會員
    // 1 = 後台管理者
    type: Number,
    default: 0
  },
  avatar: {
    type: String
  },
  // 儲存使用者登入的 JWT
  tokens: {
    type: [String]
  },
  cart: {
    type: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: 'products',
          required: [true, '缺少商品資訊']
        },
        quantity: {
          type: Number,
          required: [true, '缺少商品數量']
        }
      }
    ]
  }
}, { versionKey: false })

export default mongoose.model('users', schema)
