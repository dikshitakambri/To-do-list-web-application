const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var items = [];

app.get("/", function(req, res){
    var today = new Date();
    var currentday = today.getDay();
    var options = {
        month:"long",
        year : "numeric",
        weekday :"long"
    };

    var day = today.toLocaleDateString("en-US", options);


    res.render("list",{
        kindofDay : day,
        newItems : items
    });
});

app.post("/", function(req, res){
    var item = req.body.item;
    item.push(items);
    res.redirect("/");
});

app.listen(3000, function(){
    console.log("Server running on 3000 port");
});