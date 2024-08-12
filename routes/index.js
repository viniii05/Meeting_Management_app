// routes/index.js

const express = require('express');
const router = express.Router();

const slotRoutes = require('./slots');

// Use routes
router.use('/', slotRoutes);

module.exports = router;
