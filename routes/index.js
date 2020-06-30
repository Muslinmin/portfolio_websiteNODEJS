var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var flash = require('flash');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RockyMus570',
  database: 'portfolio'
});

connection.connect();

router.get('/', function(req, res, next){
  connection.query("SELECT * FROM projects", function(error, rows, fields){
    if(error){
      console.error(error);
      throw error;
    }
    res.render('index', {
      "projects": rows
    });
  });
});



router.get('/details/:id', function(req, res, next){
  connection.query("SELECT * FROM projects WHERE id = ?", req.params.id, function(error, rows, fields){
    if(error){
      console.error(error);
      throw error;
    }
    res.render('details', {
      "project": rows[0]
    });
  });
});


module.exports = router;
