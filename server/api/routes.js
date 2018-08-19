const express = require('express')
const incidentRoutes = require('./incidents').routes

const router = express.Router({mergeParams: true})
router.use('/incidents', incidentRoutes)

module.exports = router