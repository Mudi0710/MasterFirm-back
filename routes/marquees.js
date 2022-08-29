import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createMarquee,
  getMarquees,
  getAllMarquees,
  getMarquee,
  editMarquee,
  deleteMarquee
} from '../controllers/Marquees.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, admin, upload, createMarquee)
router.get('/', getMarquees)
router.get('/all', auth.jwt, admin, getAllMarquees)
router.get('/:id', getMarquee)
router.delete('/:id', auth.jwt, admin, deleteMarquee)
router.patch('/:id', content('application/json'), auth.jwt, admin, upload, editMarquee)

export default router
