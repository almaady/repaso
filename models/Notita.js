const Schema = require('mongoose').Schema

const notitaSchema = new Schema({
  title: String,
  body: String,
  photo:String,
  autho:{
    type:Schema.Types.ObjectId,
    ref: 'User'
  }
  },{
    timestamps:{
      createdAt: 'created_at',
      upddatedAdt: 'updated_at'
    },
  versionKey: false
})

module.exports = require('mongoose').model('Notita', notitaSchema)
