const express = require('express');
const router = express.Router();

// const db = require('../config/db');
// const sql = require('mssql/msnodesqlv8');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    route: 'home',
    title: 'Халоу'
  });
});

module.exports = router;
