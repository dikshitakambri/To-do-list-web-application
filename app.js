const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb+srv://dikshita:dikshita123@cluster0.dtyft.mongodb.net/todolistDB" ,{ useNewUrlParser: true , useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

var today = new Date();
    var currentday = today.getDay();
    var options = {
        month:"long",
        year : "numeric",
        weekday :"long"
    };

var day = today.toLocaleDateString("en-US", options);


const itemsSchema = {
    name : String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name : "Work 1"
});

const item2 = new Item ({
    name : "Work 2"
});

const defaultItems = [item1 , item2];

const listSchema = {
    name : String,
    items : [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully aaded");
                }
            });
            res.redirect("/");
        }else{
            res.render("list", {
                ListTitle : day,
                newListItems : foundItems
            });
        }
        
    });
    
});

app.post("/", function(req, res){
    var itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item ({
        name : itemName
    });

    if(listName === day){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name : listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
 });


app.get("/:customListName", function(req, res){

    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name : customListName,
                    items : defaultItems
                });
                list.save();
                res.redirect("/" + customListName);

            }else {
                res.render("list",{
                    ListTitle : foundList.name,
                    newListItems : foundList.items
                });
            }
        }
    });

});

 
 app.post("/delete", function(req, res) {

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === day){
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if(!err){
                console.log("Successfully deleted");
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name : listName}, {$pull: {items: {_id : checkedItemId}}}, function(err, foundList) {
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }
    
 });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("Server running on 3000 port");
});

// "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\data\db"

// "C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe"