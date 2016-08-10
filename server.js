var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var morgan = require('morgan');

var app = express();

var todos = [];
var id = 0;

var updateId = function(req, res, next) {
  id++;
  req.body.id = id.toString();
  next();
}

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.param('id', function(req, res, next, id) {
  var todo = _.find(todos, { id: id });
  var todoIndex = _.indexOf(todos, { id: id });

  req.todo = todo ? todo : {};
  req.todoIndex = todoIndex ? todoIndex : '';
  next();
});

app.get('/todos', function(req, res) {
  res.json(todos);
});

app.get('/todos/:id', function(req, res) {
  res.json(req.todo);
});

app.post('/todos', updateId, function(req, res) {
  var todo = req.body;
  todos.push(todo);
  res.json(todo);
});

app.put('/todos/:id', function(req, res) {
  var update = req.body;

  if ( update.id ) {
    delete update.id;
  }

  var todo = req.todo;

  if ( _.isEmpty(todo) ) {
    res.send();
  } else {
    var updatedTodd = _.assign(todo, update);
  }
});

app.delete('/todos/:id', function(req, res) {
  var todo = req.todo;
  var todoIndex = req.todoIndex;

  if ( todoIndex ) {
    todos.splice(todoIndex, 1);
    res.json(todo);
  } else {
    res.send();
  }
});
