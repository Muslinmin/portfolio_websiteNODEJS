var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest: './public/images/portfolio'
});
var mysql = require('mysql');
const {
  check,
  validationResult
} = require('express-validator');
var flash = require('flash');


//bundle errors in array for display
function errorRepackage(errorObject) {
  let arrayErrors = errorObject['errors'];
  var errorPackage = [];
  arrayErrors.forEach((errors) => {
    errorPackage.push(errors.msg);
  });
  return errorPackage;
}

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RockyMus570',
  database: 'portfolio'
});

connection.connect();

router.get('/', function(req, res, next) {
  connection.query("SELECT * FROM projects", function(error, rows, fields) {
    if (error) {
      console.error(error);
      throw error;
    }
    res.render('admin/index', {
      "projects": rows
    });
  });

});



router.get('/add', function(req, res, next) {
  res.render('admin/add');
});








router.post('/add', upload.single('projectimage'),
  [check('title').isLength({
      min: 1
    }).withMessage('Title Required'),
    check('description').isLength({
      min: 1
    }).withMessage('Description Required'),
    check('service').isLength({
      min: 1
    }).withMessage('URL Required'),
    check('client').isLength({
      min: 1
    }).withMessage('Client Required'),
    check('projectdate').isLength({
      min: 1
    }).withMessage('Project Date Required'),

  ],
  function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var service = req.body.service;
    var url = req.body.url;
    var client = req.body.client;
    var projectdate = req.body.projectdate;

    if (req.file) {
      var projectImageName = req.file.filename;
    } else {
      var projectImageName = 'noimage.jpg';
    }

    console.log(title);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errorRepackage(errors));
      res.location('/admin/add');
      res.redirect('/admin/add');
    } else {
      var project = {
        title: title,
        description: description,
        service: service,
        client: client,
        date: projectdate,
        url: url,
        image: projectImageName
      };
      connection.query('INSERT INTO projects SET ?', project, function(error, results, fields) {
        if (error) {
          console.log('Error ' + error);
        }
        console.log('The solution is: ', results);
      });
      res.redirect('/admin');
    }
  });


router.get('/edit/:id', function(req, res, next) {
  connection.query("SELECT * FROM projects WHERE id = ?", req.params.id, function(error, rows, fields){
    if(error){
      console.error(error);
      throw error;
    }
    res.render('admin/edit', {
      "project": rows[0]
    });
  });
});


router.post('/edit/:id', upload.single('projectimage'),
  [check('title').isLength({
      min: 1
    }).withMessage('Title Required'),
    check('description').isLength({
      min: 1
    }).withMessage('Description Required'),
    check('service').isLength({
      min: 1
    }).withMessage('URL Required'),
    check('client').isLength({
      min: 1
    }).withMessage('Client Required'),
    check('projectdate').isLength({
      min: 1
    }).withMessage('Project Date Required'),

  ],
  function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var service = req.body.service;
    var url = req.body.url;
    var client = req.body.client;
    var projectdate = req.body.projectdate;

    if (req.file) {
      var projectImageName = req.file.filename;
    } else {
      var projectImageName = 'noimage.jpg';
    }

    console.log(title);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', errorRepackage(errors));
      res.location('/admin/add');
      res.redirect('/admin/add');
    } else {
      var project = {
        title: title,
        description: description,
        service: service,
        client: client,
        date: projectdate,
        url: url,
        image: projectImageName
      };
      connection.query('UPDATE projects SET ? WHERE id = ' + req.params.id, project, function(error, results, fields) {
        if (error) {
          console.log('Error ' + error);
        }
        req.flash('success_msg' + 'Project updated');
      });
      res.redirect('/admin');
    }
  });











module.exports = router;
