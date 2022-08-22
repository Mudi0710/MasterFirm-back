import users from '../models/users.js'
import orders from '../models/orders.js'

// 建立訂單
export const createOrder = async (req, res) => {
  try {
    // 如果購物車長度為 0，回傳 '目前沒有選購任何商品，購物車為空'
    if (req.user.cart.length === 0) {
      return res.status(400).send({ success: false, message: '目前沒有選購任何商品，購物車為空' })
    }
    // 尋找使用者的 id，取得 cart 欄位，並把 cart 裡面的 product populate 出來
    // .populate('參數') 就是把 參數 內所有關聯資料拉出來
    let result = await users.findById(req.user._id, 'cart').populate('cart.product')
    // 拉出來之後去檢查 購物車 裡的所有 product 是否都有上架 (是否不包含已下架商品)
    const canCheckout = result.cart.every(item => item.product.sell)
    // 如果 購物車 裡的所有 product 包含已下架商品，回傳 '訂單包含已下架商品'
    if (!canCheckout) {
      return res.status(400).send({ success: false, message: '訂單包含已下架商品' })
    }
    // 建立一個儲存購物車按下結帳後，購物清單的(空)陣列
    const checkOut = []
    // 將 /models/users.js 裡 user.cart 的東西推進 checkOut 陣列
    // 因為 passport.js 的 jwt 每次都會 populate({ path: 'cart', populate: { path: 'product' } })
    // 所以 cart 已經變成陣列 + 物件(指加入購物車的商品)，再也不是只有商品 id 了
    for (const it of req.user.cart) {
      checkOut.push({ product: it.product._id, quantity: it.quantity, price: it.product.price })
    }
    // console.log(req.user.cart)
    // 如果 購物車長度 > 0，且全部商品都上架，那就建立一個新的 訂單
    result = await orders.create({ user: req.user._id, products: checkOut })
    // result = await orders.create({ user: req.user._id, products: req.user.cart })
    // 清空購物車
    req.user.cart = []
    // 存檔
    await req.user.save()
    // 通過並回傳訂單的 id
    res.status(200).send({ success: true, message: '', result: result._id })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 使用者獲得自己的所有訂單
export const getMyOrders = async (req, res) => {
  try {
    // 把 orders models 裡面 products 的 product 拉出來
    const result = await orders.find({ user: req.user._id }).populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 管理者獲得所有後台的訂單
export const getAllOrders = async (req, res) => {
  try {
    // populate 可以複數個 => 同時抓 商品 跟 使用者，這樣管理者才能對到資料
    // .populate('user', 'account')
    // 自動抓 user 欄位對應的 ref 資料，只取 account 欄位，不取其他機密資料
    const result = await orders.find().populate('products.product').populate('user', 'account')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
