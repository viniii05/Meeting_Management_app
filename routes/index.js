
const express = require('express');
const router = express.Router();

const slotRoutes = require('./slots');

router.use('/', slotRoutes);

module.exports = router;
