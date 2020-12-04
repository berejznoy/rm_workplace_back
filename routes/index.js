const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    route: 'home',
    title: 'Халоу'
  });
});

module.exports = router;
