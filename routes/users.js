import express from 'express'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import content from '../middleware/content.js'
import {
  register,
  login,
  logout,
  extend,
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  addCart,
  editCart,
  getCart
} from '../controllers/users.js'

const router = express.Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.post('/extend', auth.jwt, extend)
router.get('/all', auth.jwt, admin, getAllUsers)
router.get('/', auth.jwt, getUser)
router.post('/cart', content('application/json'), auth.jwt, addCart)
router.patch('/cart', content('application/json'), auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)
router.delete('/:id', auth.jwt, admin, deleteUser)
router.patch('/:id', content('application/json'), auth.jwt, editUser)

export default router
