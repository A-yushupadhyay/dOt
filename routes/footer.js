
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const underConstruction = require('../middleware/underConstruction');

// Example: if /pharmacy is not ready yet
router.get('/faq', underConstruction);

router.get('/policy', underConstruction);
router.get('/terms', underConstruction);

module.exports = router; // ✅ Must export router!
