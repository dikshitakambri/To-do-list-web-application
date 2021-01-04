const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var items = [];
var workitems =[];

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
        ListTitle : day,
        newItems : items
    });
});

app.post("/", function(req, res){

    var item = req.body.item;
    if(req.body.list === "Worklist"){
        workitems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
    
});

app.get("/work", function(req, res){
    res.render("list",{
        ListTitle : "Worklist",
        newItems : workitems
    });
});

app.post("/work", function(req, res){
    var item = req.body.item;
    workitems.push(item);
    res.redirect("/work");
});

app.listen(3000, function(){
    console.log("Server running on 3000 port");
});