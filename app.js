
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var upload = multer({dest: './public/images/portfolio'});
var flash = require('flash');
var exphbs = require('express-handlebars');
const { check, validationResult } = require('express-validator');

//route files
var route = require('./routes/index');
var admin = require('./routes/admin');


var app = express();



app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req,res);
  next();
});

//Public folder
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use('/', route);
app.use('/admin', admin);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log("Server started on port " + app.get('port'));
});
