import users from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  const password = req.body.password
  if (!password) {
    return res.status(400).send({ success: false, message: '會員密碼為必填' })
  }
  if (password.length < 4) {
    return res.status(400).send({ success: false, message: '密碼至少 4 個字元' })
  }
  if (password.length > 20) {
    return res.status(400).send({ success: false, message: '密碼最多 20 個字元' })
  }
  if (!password.match(/^(?=.*[a-z])(?=.*\d)[a-z\d]{4,20}$/)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤，須至少包含一個英文小寫及一個數字' })
  }
  req.body.password = bcrypt.hashSync(password, 10)
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '註冊成功' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.error[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '5s' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: '登入成功',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.length,
        role: req.user.role
      }
    })
  } catch (error) {
    res.statue(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '登出成功' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '5s' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUser = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.length,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}