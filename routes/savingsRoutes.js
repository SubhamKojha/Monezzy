const express = require('express');
const router = express.Router();
const {
  addSavings,
  getSavings,
  addToSavings,
  deleteSavings,
} = require('../controllers/savingsController');

router.get('/', getSavings);
router.post('/', addSavings);
router.post('/:id/add', addToSavings);
router.post('/:id/delete', deleteSavings); // SSR-friendly delete

module.exports = router;
