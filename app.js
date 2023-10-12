var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://wedding:agsuH1psqKQDL8O1@cluster0.oqe3l5v.mongodb.net/?retryWrites=true&w=majority";

var app = express();
const PORT = 3001;

mongoose.connect('mongodb+srv://wedding:agsuH1psqKQDL8O1@cluster0.oqe3l5v.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const Expression = mongoose.model('Expression', {
  name: String,
  message: String,
});

app.get('/expression', async function(req, res) {

  const page = req.query.page || 1;
  const limit = req.query.limit || 20;

  console.log(limit);

  const messages = await Expression.find().skip((page - 1) * limit)
  .limit(limit);
  const total = await Expression.count();
  res.json({
    message : 'succes',
    data : messages,
    total
  });
});

app.post('/expression', async function(req, res) {
  try {
    const expression = new Expression(req.body);
    await expression.save();
    res.status(201).json(expression);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/', function(req,res) {
  res.send('endpoint untuk pernikahan');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT,  function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});

module.exports = app;
