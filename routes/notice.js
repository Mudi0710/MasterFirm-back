import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createNotice,
  getNotice,
  getAllNotice,
  editNotice,
  deleteNotice
} from '../controllers/notice.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createNotice)
router.get('/', getNotice)
router.get('/all', auth.jwt, admin, getAllNotice)
router.delete('/:id', auth.jwt, admin, deleteNotice)
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editNotice)

export default router
