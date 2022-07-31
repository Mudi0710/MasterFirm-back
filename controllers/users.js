import users from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  // 在註冊前，先驗證輸入資料類型是否正確
  // 如果這個請求 沒有內容類型 或 內容類型不是 json，回傳 狀態 400、'資料格式錯誤'
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    return res.status(400).send({ success: false, message: '資料格式錯誤' })
  }
  // 資料類型正確後，再驗證密碼
  const password = req.body.password
  // 如果沒有密碼，則 回傳 狀態 400、'會員密碼為必填'
  if (!password) {
    return res.status(400).send({ success: false, message: '會員密碼為必填' })
  }
  // 如果密碼長度小於 4，則 回傳 狀態 400、'密碼至少 4 個字元'
  if (password.length < 4) {
    return res.status(400).send({ success: false, message: '密碼至少 4 個字元' })
  }
  // 如果密碼長度大於 20，則 回傳 狀態 400、'密碼最多 20 個字元'
  if (password.length > 20) {
    return res.status(400).send({ success: false, message: '密碼最多 20 個字元' })
  }
  // 如果密碼格式不符合，則 回傳 狀態 400、'密碼格式錯誤，須至少包含一個英文小寫及一個數字'
  if (!password.match(/^(?=.*[a-z])(?=.*\d)[a-z\d]{4,20}$/)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤，須至少包含一個英文小寫及一個數字' })
  }
  // 將密碼用 bcrypt 技術加密
  /*
    語法： bcrypt.hash(myPassword, saltRounds)
      => saltRounds：是在密碼學中的加鹽(salt)，加鹽的意思是在要加密的字串中加特定的字符，打亂原始的字符串，使其生成的散列結果產生變化，其參數越高加鹽次數多越安全相對的加密時間就越長。
  */
  req.body.password = bcrypt.hashSync(password, 10)
  try {
    // 把 req.body 丟進 users.create()
    // users 是從 models/users.js 來的
    await users.create(req.body)
    res.status(200).send({ success: true, message: '註冊成功' })
  } catch (error) {
    // 老師建議在 debug 的時候加入 console.log(error)，比較容易找到錯誤的內容
    // console.log(error)

    // 處理驗證錯誤 https://youtu.be/GbMLlYSBhPU?t=27181
    // 如果 錯誤名稱 是 'ValidationError'，回傳 狀態 400、'帳號已存在'
    if (error.name === 'ValidationError') {
      // 如果驗證錯誤，要將 key 取出來 (取出第一個驗證失敗的欄位名稱)
      const key = Object.keys(error.errors)[0]
      // 用 取出的欄位名稱 來 取出錯誤訊息
      const message = error.error[key].message
      return res.status(400).send({ success: false, message: '帳號已存在' })

      // 處理帳號重複
      // 如果 錯誤名稱 是 'MongoServerError' 且 錯誤代碼 是 11000，回傳 狀態 400、'帳號已存在'
      // 11000 代表有重複資料
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })

    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// jwt.sign(資料, secret, 設定) https://youtu.be/wfYAWTlkwBw?t=9638
export const login = async (req, res) => {

}

export const logout = async (req, res) => {

}

export const extend = async (req, res) => {

}

export const getUser = async (req, res) => {

}
