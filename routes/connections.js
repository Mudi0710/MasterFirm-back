import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import {
  createConnection,
  getConnections,
  getAllConnections,
  getConnection,
  editConnection,
  deleteConnection
} from '../controllers/connections.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, admin, createConnection)
router.get('/', getConnections)
router.get('/all', auth.jwt, admin, getAllConnections)
router.get('/:id', getConnection)
router.delete('/:id', auth.jwt, admin, deleteConnection)
router.patch('/:id', content('application/json'), auth.jwt, admin, editConnection)

export default router
