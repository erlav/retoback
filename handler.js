'use strict';

const AWS = require('aws-sdk')
const swapi = require('swapi-node');
const uuid = require("uuid")
const utils = require('./utils')

const dynamo = new AWS.DynamoDB.DocumentClient()
//const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })


module.exports.obtenerPersona = async(event, context, callback)=> {
  const id = event.pathParameters.id

  try {
    const person = await swapi.getPerson(parseInt(id))
    if (person){
      const persona = utils.mapearPersona(person)
      callback(null, {
        statusCode:200, 
        body:JSON.stringify((persona)?persona:{msg:`No existe persona con ID ${id}`})
      });
    }
    
  }catch(err){
    callback(err);
  }
}

module.exports.crearPersona = async(event, context, callback)=> {
  let data = JSON.parse(event.body)
  if (!data){
    callback("No existe data")
  }
  
  try {
    let persona = utils.mapearPersona(data)
    if (persona){
      persona.id = uuid.v4()
      await dynamo.put({
        Item: persona,
        TableName: process.env.DB_TABLE_PERSON
      }).promise()
    }
    callback(
      null,
      {statusCode: 201, 
        body: JSON.stringify({msg: (persona)?`se a creado el registro con ID ${persona.id}`:`los datos son incorrectos`})
      }
    )
  }catch(err){
    callback(err);
  }
}

module.exports.listarPersonas = async(event, context, callback) =>{
  try {
    const res = await dynamo.scan({
      TableName: process.env.DB_TABLE_PERSON
    }).promise()

    //callback(null, {statusCode:200, body: JSON.stringify(res.Items.map((e)=>{return utils.mapearPersona(e)}))})
    callback(null, {statusCode:200, body: JSON.stringify(res.Items)})
  }catch (err){
    callback(err);
  }
}