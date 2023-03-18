const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } = require('./toy.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/',log,  getToys)
router.get('/:id', getToyById)
router.post('/',addToy)
router.put('/',requireAdmin,updateToy)
// router.delete('/:id', requireAuth, removeToy)
router.delete('/:id',requireAuth,requireAdmin, removeToy)

router.post('/:id/msg', requireAuth, addToyMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeToyMsg)

module.exports = router


