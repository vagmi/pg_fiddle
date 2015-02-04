'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('pads',function(t){
    t.increments(),
    t.string('schema_sql');
    t.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('pads');
};
