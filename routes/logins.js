"use strict";
var express = require('express');
var router = express.Router();
var loginsController = require('../controllers/Logins');

var service = 'login';

// get logins or search logins
router.get('/'+service, loginsController.find);

// get login
router.get('/'+service+'/:id', loginsController.findOne);

// To add validation, add a middlewave like the below. Works for just POST calls only
// function(req,res,next){
//     req._required = [ // _required should contain all the fails that are required
//     'name',
//     'name2'
//     ];

//     next();
// }

// create login(s) a single login object will create one login while an array of logins will create multiple logins
router.post('/'+service, loginsController.create);

// update all records that matches the query
router.put('/'+service, loginsController.update);

// update a single record
router.patch('/'+service+'/:id', loginsController.updateOne);

// delete all records that matches the query
router.delete('/'+service, loginsController.delete);

// Delete a single record
router.delete('/'+service+'/:id', loginsController.deleteOne);

// restore a previously deleted record
router.post('/'+service+'/:id/restore', loginsController.restore);

module.exports = router;
