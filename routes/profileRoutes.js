const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const axios = require('axios');

router.get('/', async (req, res) => {
  const userEmail = req.query.email || 'ojhas6667@gmail.com'; // fallback for dev

  try {
    const configuredAlerts = await Alert.find({ email: userEmail });

    const { data: activeAlerts } = await axios.get(`http://localhost:5000/api/alerts/active/${userEmail}`);

    res.render('profile', {
      userEmail,
      alertFormData: {}, // You can customize this if you want to pre-fill the form
      configuredAlerts,
      activeAlerts
    });
  } catch (err) {
    console.error('⚠️ Error rendering profile:', err.message);
    res.render('profile', {
      userEmail,
      alertFormData: {},
      configuredAlerts: [],
      activeAlerts: []
    });
  }
});


module.exports = router;
