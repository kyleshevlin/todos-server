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

app.route('/todos')
  .get(function(req, res) {
    res.json(todos);
  })
  .post(updateId, function(req, res) {
    var todo = req.body;
    todos.push(todo);
    res.json(todo);
  });

app.route('/todos/:id')
  .get(function(req, res) {
    res.json(req.todo);
  })
  .put(function(req, res) {
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
  })
  .delete(function(req, res) {
    var todo = req.todo;
    var todoIndex = req.todoIndex;

    if ( todoIndex ) {
      todos.splice(todoIndex, 1);
      res.json(todo);
    } else {
      res.send();
    }
  });

app.use(function(err, req, res, next) {
  if (err) {
    res.status(500).send(err);
  }
});

app.listen(3000, function() {
  console.log('Server running at http://localhost:3000');
});
