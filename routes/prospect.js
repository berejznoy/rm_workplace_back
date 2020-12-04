var express = require('express');

var router = express.Router();

const sql = require('mssql');
const db = require('../config/db');

/* GET users listing. */
router.get('/activities/:id', (req, res, next) => {
  sql.connect(db, (err) => {
    if (err) console.log(err);
    const request = new sql.Request();
    request
      .input('id', sql.VarChar, req.params.id)
      .query('select ca.*,cc.name,pu.[ФИО] as fio from crm_activity ca left join crm_clients cc on ca.client_id = cc.client_id left join pro_users pu on pu.counter = ca.creator_uid where ca.client_id = @id and act_result is not null order by act_start_time desc', (error, result) => {
        if (error) {
          console.log(error);
          res.send(error);
        }
        // var rowsCount = result.rowsAffected;
        sql.close();
        res.send(result.recordset[0]);
      }); // request.query
  }); // sql.conn
});

router.post('/save_client_status', (req, res, next) => {
  sql.connect(db, (err) => {
    if (err) console.log(err);
    const request = new sql.Request();
    console.log(req.query, req.body);
    request
      .input('id', sql.Int, req.query.id)
      .input('portalCounter', sql.Int, req.query.portalCounter)
      .input('status', sql.Int, req.body.status)
      .input('comment', sql.VarChar, req.body.comment)
      .query('insert into corp_client_activator_status (client_id, status, comment, portal_counter) values (@id, @status, @comment, @portalCounter)', (error, result) => {
        if (error) {
          console.log(error);
          res.send(error);
        }
        sql.close();
        res.send(result.recordset);
      });
  });
});

module.exports = router;
