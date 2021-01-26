const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB" ,{ useNewUrlParser: true , useUnifiedTopology: true});

const itemSchema = {
    name : String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
    name : "Work 1"
});

const item2 = new Item ({
    name : "Work 2"
});

const defaultList = [item1 , item2];

const listSchema = {
    name : String,
    items = [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){
    var today = new Date();
    var currentday = today.getDay();
    var options = {
        month:"long",
        year : "numeric",
        weekday :"long"
    };

    var day = today.toLocaleDateString("en-US", options);

    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultList, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully aaded");
                }
            });
            res.redirect("/");
        }else{
            res.render("list",{
                ListTitle : day,
                newItems : foundItems
            });
        }
    });
});

app.post("/", function(req, res){

    var itemName = req.body.item;

    const item = new Item ({
        name : itemName
    });
    
    item.save();

    res.redirect("/");
    
});

app.post("/delete", function(req, res){
    const checkedItems = req.body.checkbox;

    Item.findByIdAndRemove(checkedItems, function(err){
        if(!err){
            console.log("successfully deleted");
            res.redirect("/");
        }
    });
   
});

app.get("/:CustomListName", function(req, res){

    const CustomListName = req.params.CustomListName;

    List.findOne({name: CustomListName}, function(err, foundlist){
        if(!err){
            if(!foundlist){
                const list = new List({
                    name : CustomListName,
                    items : defaultList
                });
                res.redirect("/" + CustomListName);
                items.save();

            }else {
                res.render("list",{
                    ListTitle : day,
                    newItems : foundlist
                });
            }
        }
    });

});


app.listen(3000, function(){
    console.log("Server running on 3000 port");
});

// "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\data\db"

// "C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe"