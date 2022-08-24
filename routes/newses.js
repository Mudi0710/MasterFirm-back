import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import {
  createNews,
  getNewses,
  getAllNewses,
  getNews,
  editNews,
  deleteNews
} from '../controllers/newses.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, admin, createNews)
router.get('/', getNewses)
router.get('/all', auth.jwt, admin, getAllNewses)
router.get('/:id', getNews)
router.delete('/:id', auth.jwt, admin, deleteNews)
router.patch('/:id', content('application/json'), auth.jwt, admin, editNews)

export default router
