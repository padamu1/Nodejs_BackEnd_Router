/*
this file used for manage data of mongoDB,
and connect from Front_End to DB
*/

var express = require('express')
const cors = require('cors');
var app = express()
const xlsx = require("xlsx");
var mongoose = require('mongoose');
const e = require('express');
var db;
var db_user;


db = mongoose.createConnection('mongodb://admin:pwd@ DB URL '); 
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("MongoDB connection OK.");
}); // check connection


let corsOption = {
    credentials: true
}

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(8585, function () {
    console.log("start! express server on port 8585")
}) // start express router

/*
load data
*/
app.post('/dataLoad', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    db.collection('collection').find({},{projection : {_id:1,itemName:1,type:1}}).toArray(function (err, docs) { // 포함 1
        if (err != null) {
            console.log(err);
        } else {
            var database = docs;
            database.splice(0, 1);
            console.log("DB!");
            res.json(database);
        }
    });
})


/*
updata DB
*/
app.post('/dataUpdate', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    console.log(req.body._id);
    console.log(req.body.foodName);
    console.log(req.body.kcal);
    db.collection('collection').update({ '_id': req.body._id }, { $set: { "itemName": req.body.itemName, "type": req.body.type}}, function (err, item) {
        if (err != null) {
            console.log(err);
            res.json({ 400: "error" });
        } else {
            console.log("Update!");
            res.json({ 200: "success" });
        }
    });
});


/*
find data and upload data
*/
app.post('/dataInput', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.body);
    var jsonData = req.body;

    db.collection('collection').findOne({ '_id': "productid" }, function (err, item) {
        if (err != null) {
            console.log(err);
        }
        else {
            sequence = item.sequence_value;
            console.log(sequence);
            sequence = sequence + 1;
            db.collection('collection').update({ "_id": "productid" }, { $set: { sequence_value: sequence } });
            var data = { "_id": sequence, "itemName": req.body.itemName, "type": req.body.type};
            db.collection('collection').insertOne(data, function (err, item) {
                if (err != null) {
                    console.log(err);
                    res.json({ 400: "error" });
                } else {
                    console.log("Insert!");
                    res.json({ 200: "success" });
                }
            });
        }
    })
})