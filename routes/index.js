const express = require('express');
const router = express.Router();

const db = require('../config/db');
const sql = require('mssql/msnodesqlv8');

/* GET home page. */
router.get('/', function(req, res, next) {
  sql.connect(db, function (err) {
    if (err)
      console.log(err);
    const request = new sql.Request();
    request.query('select top 10 * from corp_client_activator', function (err, result) {
      if (err) {
        console.log(err)
        res.send(err);
      }
      sql.close();
      res.send(result.recordset);
    });
  });
});

module.exports = router;
