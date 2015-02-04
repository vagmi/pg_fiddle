var Promise = require('bluebird'), 
    crypto  = require('crypto');
var PadModel = function(models){
  var bookshelf = models.bookshelf
  models.Pad = bookshelf.Model.extend({
    tableName: 'pads',
    initialize: function(){
      this.on('created',this.createSchema);
    },
    getUserName: function(){
      var sha256 = crypto.createHash('sha256');
      sha256.update(this.get('schema_sql'));
      return sha256.digest('hex').toString();
    },
    getSaltedHash: function(seed){
      var salt = process.env.hashSalt || "SuperSecretShit";
      var sha256 = crypto.createHash('sha256');
      sha256.update(salt + ' -- ' + seed);
      return sha256.digest('hex').toString();
    },
    execute: function(statements,callback){
      var self=this;
      var uname = "r" + this.getUserName();
      bookshelf.knex.transaction(function(trx){
        statements = "set role " + uname + "; " +
          "set search_path to " + uname + "; " +
          statements;
        console.log(statements);
        trx.raw(statements).then(function(){
          callback.apply(arguments)
          trx.rollback();
        });
      });
    },
    createSchema: function(){
      var uname="r"+this.getUserName();
      var noop = function(){return 0; }
      return Promise.reduce([
        "drop schema if exists " + uname + " cascade",
        "drop role if exists " + uname,
        "create role " + uname,
        "create schema if not exists authorization " + uname,
        "set role " + uname + "; " +
        "set search_path to " + uname + ";" + 
        this.get('schema_sql') +        
        ";reset role;"
      ],function(acc,stmt){
        return bookshelf.knex.raw(stmt).then(noop);
      }, 0);
    }
  });
  return models.Pad;
}
module.exports = PadModel;
