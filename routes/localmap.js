import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import {
  createLocalmap,
  getLocalmaps,
  getAllLocalmaps,
  getLocalmap,
  editLocalmap,
  deleteLocalmap
} from '../controllers/localmap.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, admin, createLocalmap)
router.get('/', getLocalmaps)
router.get('/all', auth.jwt, admin, getAllLocalmaps)
router.get('/:id', getLocalmap)
router.delete('/:id', auth.jwt, admin, deleteLocalmap)
router.patch('/:id', content('application/json'), auth.jwt, admin, editLocalmap)

export default router
