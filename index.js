var nodeEnv = process.env.NODE_ENV || 'development'
var config = require('./knexfile')
var knex = require('knex')(config[nodeEnv]);
var bookshelf = require('bookshelf')(knex);

var app = require('express')();
app.models = {};
app.models.bookshelf = bookshelf;
var Pad = require('./app/models/pad')(app.models);
Pad.forge({schema_sql: 'create table customers(id serial, name varchar, address varchar);create table orders(id serial, customer_id integer, value numeric(10,2));'}).save().then(function(p){
  console.log("Pad saved", p);
  p.execute("insert into customers(name,address) values('Vagmi','Rome'); "
            + "select * from customers;",function(){
              console.log("Executed statement against pad");
  console.log(arguments);
  });
});
app.listen(5000);
