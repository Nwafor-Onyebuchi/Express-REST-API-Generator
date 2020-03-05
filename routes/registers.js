"use strict";
var express = require('express');
var router = express.Router();
var registersController = require('../controllers/Registers');

var service = 'registers';

// get registers or search registers
router.get('/'+service, registersController.find);

// get register
router.get('/'+service+'/:id', registersController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }

// create register(s) a single register object will create one register while an array of registers will create multiple registers
router.post('/'+service, registersController.create);

// update all records that matches the query
router.put('/'+service, registersController.update);

// update a single record
router.patch('/'+service+'/:id', registersController.updateOne);

// delete all records that matches the query
router.delete('/'+service, registersController.delete);

// Delete a single record
router.delete('/'+service+'/:id', registersController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', registersController.restore);

module.exports = router;
