import passport from 'passport'
import passportJWT from 'passport-jwt'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// 設定登入策略：使用 LocalStrategy 的驗證策略(這個策略是帳號、密碼驗證)，建立一個叫做 login 的驗證方法
passport.use('login', new LocalStrategy({
  // 制定：使用者名稱欄位的是 account
  // (usernameField 是預設的欄位，將它重新命名為 account，以符合我們設定的資料欄位)
  usernameField: 'account',
  // 制定：密碼欄位的是 passport
  // (passwordField 是預設的欄位，將它重新命名為 password，以符合我們設定的資料欄位)
  passwordField: 'password'
  // 接著寫一個驗證通過後會執行的 function (寫一個 async 的 function)
  // account 代表解出來的帳號，password 代表解出來的密碼，done 回傳驗證結果
  /*
    done(err,user和info錯誤, 回傳內容, 驗證結果的訊息)
    error => 代表「錯誤訊息」：在伺服器端回傳錯誤訊息時，帶入錯誤訊息 err；無錯誤訊息時，則可以帶入 null 取代
    user => 代表「使用者資料」：驗證成功時，帶入使用者資料 user；驗證失敗時，則可以帶入 false 取代
    info => 代表「驗證失敗訊息」：當驗證失敗時，可以額外補充驗證失敗的原因和資訊
  */
}, async (account, password, done) => {
  try {
    // 尋找是否已有該帳號的使用者
    const user = await users.findOne({ account })
    // 如果沒有該帳號，回傳 '帳號不存在'
    if (!user) {
      return done(null, false, { message: '此帳號不存在' })
    }
    // 如果有找到，但密碼不一致，回傳 '密碼錯誤'
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

// 設定登入策略：使用 JWT 的驗證策略(這個策略是解譯 JWT 的密鑰)，建立一個叫做 jwt 的驗證方法
passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  // 從環境變數把 secret 拉出來
  secretOrKey: process.env.SECRET,
  // 把 Req 的資料傳進 Callback 裡面 (為了要忽略特定的路由，不要讓他去做過期的驗證 => 特定的路由是指 JWT 舊換新時的路由)
  passReqToCallback: true,
  // 忽略過期 (因為要拿舊的 JWT 交換新的 JWT，而會有舊的 JWT 代表著它已經過期了，所以才要忽略過期，再自己寫過期的驗證)
  ignoreExpiration: true
}, async (req, payload, done) => {
  const expired = payload.exp * 1000 < Date.now()
  if (expired && req.originalUrl !== '/users/extend' && req.originalUrl !== '/users/logout') {
    return done(null, false, { message: '登入逾期' })
  }
  const token = req.headers.authorization.split(' ')[1]
  try {
    const user = await users.findById(payload._id)
    if (!user) {
      return done(null, false, { message: '使用者不存在' })
    }
    if (user.tokens.indexOf(token) === -1) {
      return done(null, false, { message: '驗證錯誤' })
    }
    return done(null, { user, token })
  } catch (error) {
    return done(error, false)
  }
}))
