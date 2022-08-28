import users from '../models/users.js'
import products from '../models/products.js'
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
    return res.status(400).send({ success: false, message: '格式錯誤，至少包含一個小寫英文及數字' })
  }
  req.body.password = bcrypt.hashSync(password, 10)
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '註冊成功' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在，或已有相同電子信箱、手機號碼註冊' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: '登入成功',
      result: {
        token,
        account: req.user.account,
        name: req.user.name,
        role: req.user.role,
        cart: req.user.cart.length
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
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '50000s' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).send({ success: true, message: '', result })
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
        _id: req.user._id,
        account: req.user.account,
        name: req.user.name,
        gender: req.user.gender,
        birthday: req.user.birthday,
        tel: req.user.tel,
        email: req.user.email,
        address: req.user.address,
        avatar: req.user.avatar,
        cart: req.user.cart.length,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯會員，管理者或使用者本人都可以編輯
export const editUser = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      gender: req.body.gender,
      birthday: req.body.birthday,
      tel: req.body.tel,
      email: req.body.email,
      address: req.body.address
    }
    const result = await users.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 刪除會員，只有管理者能刪除
export const deleteUser = async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 新增商品到購物車
export const addCart = async (req, res) => {
  try {
    // 要先驗證商品是否存在 => 尋找商品的 id 是否存在
    const result = await products.findById(req.body.product)
    // 如果沒找到商品 id 或 商品已下架
    if (!result || !result.sell) {
      // 回傳 '商品不存在，或商品已下架'
      return res.status(404).send({ success: false, message: '該商品不存在或已下架' })
    }
    // 如果商品存在，那再找購物車內有沒有這個商品
    /*
      【注意】
      因為 req.body.product 傳進來的資料型態是 string，但是 cart 裡面的 product 的資料格式是 mongoose.ObjectId
      兩者資料格式不同，所以要將 item.product 的資料格式也轉成 string，才能夠做比較

      當然，也可以把 req.body.product 轉成 mongoose.ObjectId
      => const idx = req.user.cart.findIndex(item => item.product === mongoose.ObjectId(req.body.product))
    */
    const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
    // 如果購物車裡面已經有這個商品
    if (idx > -1) {
      // 商品數量直接加 1 (+= 傳入的數量)
      req.user.cart[idx].quantity += req.body.quantity
      // 如果購物車裡面沒有這個商品
    } else {
      // 就將商品 push 進去 cart
      req.user.cart.push({
        product: req.body.product,
        quantity: req.body.quantity
      })
    }
    // 儲存
    await req.user.save()
    // 回傳購物車的長度 => 前台只記購物放幾個東西，不記購物車裡面有什麼
    res.status(200).send({ success: true, message: '', result: req.user.cart.length })
  } catch (error) {
    // 處理驗證錯誤(跟 register 差不多)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 編輯購物車內的商品
export const editCart = async (req, res) => {
  // 編輯不需要去驗證商品的 id，因為他已經在購物車裡面了
  try {
    // 如果購物車內的商品數量 小於等於 0，把商品從購物車內拿掉
    if (req.body.quantity <= 0) {
      // 正常來說使用 req.user 的語法，老師此處示範的是另一種語法(MongoDB 的語法)
      await users.findOneAndUpdate(
        /*
          findOneAndUpdate({查詢條件}, {執行動作})
          1. 查詢條件：找到使用者 id，且購物車的商品內也有這個商品的 id
          2. 用 pull 將 購物車陣列 的 這個商品 從購物車裡面 拿下來(刪掉)
        */
        { _id: req.user._id, 'cart.product': req.body.product },
        {
          $pull: {
            cart: { product: req.body.product }
          }
        }
      )
      /*
        【req.user 的語法(就是 JS 的語法)】
        const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
        req.user.cart.splice(idx, 1)
        await req.user.save()
      */
      // 如果購物車內的商品數量 大於等於 0，去改數量
    } else {
      await users.findOneAndUpdate(
        { _id: req.user._id, 'cart.product': req.body.product },
        {
          /*
            $set 是修改陣列內的值/內容
            => 1. 修改 cart 陣列裡面的 quantity
            => 2. 要修改的值是 傳進來的值
          */
          $set: {
            // $ 代表符合陣列搜尋條件的索引
            'cart.$.quantity': req.body.quantity
          }
        }
      )
      /*
        【req.user 的語法(就是 JS 的語法)】
        const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
        req.user.cart[idx].quantity = req.body.quantity
        await req.user.save()
      */
    }
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    // 處理驗證錯誤(跟 register 差不多)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    // await users.findById(req.user._id, 'cart') => 只要 req.user._id 裡面的 cart 欄位資料
    // populate() 可以幫你把相連的 ref 資料表搬過來 2022/07/12 2:54:39
    const result = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
