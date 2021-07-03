'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var teamSchema = Schema( {
  name: String,
  pokemon: String,
  userId: ObjectId
} );

module.exports = mongoose.model( 'Team', teamSchema );
