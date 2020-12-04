const express = require('express');

const router = express.Router();
const multer = require('multer');

const upload = multer();

const sql = require('mssql');
const db = require('../config/db');

// router.get('/activities/:id', (req, res, next) => {
//   sql.connect(db, (err) => {
//     if (err) console.log(err);
//     const request = new sql.Request();
//     request
//       .input('id', sql.VarChar, req.params.id)
//       .query('select ca.*,cc.name,pu.[ФИО] as fio from crm_activity ca left join crm_clients cc on ca.client_id = cc.client_id left join pro_users pu on pu.counter = ca.creator_uid where ca.client_id = @id and act_result is not null order by act_start_time desc', (error, result) => {
//         if (error) {
//           console.log(error);
//           res.send(error);
//         }
//         // var rowsCount = result.rowsAffected;
//         sql.close();
//         res.send(result.recordset[0]);
//       }); // request.query
//   }); // sql.conn
// });
router.get('/activators', (req, res, next) => {
  sql.connect(db, (err) => {
    if (err) console.log(err);
    const request = new sql.Request();
    request
      .query('select\n'
          + '\t\ttop 10\n'
          + '\t\tcnbc.*\n'
          + '\t\t,cnbc.i_acc_opn as fdateopen\n'
          + '\t\t,cca.portal_counter\n'
          + '\t\t,cca.id as clientId\n'
          + '\t\t,ccas.status\n'
          + '\t\t,ccas.ts_created\n'
          + '\t\t,ccas.comment\n'
          + '\t\t,pu.[ФИО] as fio\n'
          + '\t\t,iif(ccas.status > 0, \'Да\', \'Нет\') as worked\n'
          + '\t\t,iif(ccas.status = 2, \'Да\', \'Нет\') as presentation\n'
          + '\t\tfrom\n'
          + '\t\tcorp_new_base_clients cnbc\n'
          + '\t\tleft join corp_client_activator cca on cca.inn = cnbc.uniquetin\n'
          + '\t\tleft join corp_client_activator_status ccas on ccas.client_id = cca.id and ccas.id = (select max(id) from corp_client_activator_status where client_id = cca.id)\n'
          + '\t\tleft join pro_users pu on pu.counter = cca.portal_counter\n'
          + '\t\twhere cnbc.subsegment not in (\'Tier1.1\',\'Tier1.2\') and cnbc.region not in (\'HeadOffice\')', (error, result) => {
        if (error) {
          console.log(error);
          res.send(error);
        }
        // var rowsCount = result.rowsAffected;
        sql.close();
        res.send(result.recordset);
      }); // request.query
  }); // sql.conn
});
router.get('/status-history/:id', (req, res, next) => {
  sql.connect(db, (err) => {
    if (err) console.log(err);
    const request = new sql.Request();
    request
      .input('id', sql.VarChar, req.params.id)
      .query('select ccas.*,pu.[ФИО] as fio from corp_client_activator_status ccas left join pro_users pu on pu.counter = ccas.portal_counter where client_id = @id order by id desc', (error, result) => {
        if (error) {
          console.log(error);
          res.send(error);
        }
        sql.close();
        res.send(result.recordset);
      });
  });
});
router.post('/save_client_status', upload.none(), (req, res, next) => {
  sql.connect(db, (err) => {
    if (err) console.log(err);
    const request = new sql.Request();
    request
      .input('id', sql.Int, req.query.id)
      .input('portalCounter', sql.Int, req.query.portalCounter)
      .input('status', sql.Int, req.body.status)
      .input('comment', sql.NVarChar, req.body.comment)
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
