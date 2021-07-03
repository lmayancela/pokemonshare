'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var walkSchema = Schema( {
  date: String,
  steps: String,
  minutes: String,
  userId: ObjectId,
} );

module.exports = mongoose.model( 'Walk', walkSchema );
