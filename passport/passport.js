import passport from 'passport'
import passportJWT from 'passport-jwt'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use('login', new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  try {
    const user = await users.findOne({ account })
    if (!user) {
      return done(null, false, { message: '此帳號不存在' })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  passReqToCallback: true,
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

passport.use('jwtCart', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  passReqToCallback: true,
  ignoreExpiration: true
}, async (req, payload, done) => {
  const expired = payload.exp * 1000 < Date.now()
  if (expired && req.originalUrl !== '/users/extend' && req.originalUrl !== '/users/logout') {
    return done(null, false, { message: '登入逾期' })
  }
  const token = req.headers.authorization.split(' ')[1]
  try {
    const user = await users.findById(payload._id).populate({ path: 'cart', populate: { path: 'product' } })
    // console.log(user.cart)
    // 長下面這樣
    // [
    //   {
    //     product: {
    //       _id: new ObjectId("62fa3913a1492e5f6bf39fb3"),
    //       name: '商品一',
    //       description: '商品一',
    //       inventory: false,
    //       sell: true,
    //       price: 1000,
    //       image: [Array]
    //     },
    //     quantity: 1,
    //     _id: new ObjectId("6302d8c77ef9d3da409fc136")
    //   },
    //   {
    //     product: {
    //       _id: new ObjectId("62fa55312c45f19b0c76db4e"),
    //       name: '商品二',
    //       description: '商品二',
    //       inventory: false,
    //       sell: true,
    //       price: 2000,
    //       image: [Array]
    //     },
    //     quantity: 1,
    //     _id: new ObjectId("6302eb8d8e80f37f2cf23a0e")
    //   },
    //   {
    //     product: {
    //       _id: new ObjectId("62fa55312c45f19b0c76db4e"),
    //       name: '商品二',
    //       description: '商品二',
    //       inventory: false,
    //       sell: true,
    //       price: 2000,
    //       image: [Array]
    //     },
    //     quantity: 1,
    //     _id: new ObjectId("6302ec6feb7200292f4ab04b")
    //   }
    // ]
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
