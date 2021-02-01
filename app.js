const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB" ,{ useNewUrlParser: true , useUnifiedTopology: true});

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

// const listSchema = {
//     name : String,
//     item : [itemSchema]
// };

// const List = mongoose.model("List", listSchema);

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
    var item = req.body.NewItem;
    items.push(item);
    res.redirect("/");
 });
// app.get("/:CustomListName", function(req, res){

//     const CustomListName = req.params.CustomListName;

//     List.findOne({name: CustomListName}, function(err, foundList){
//         if(!err){
//             if(!foundList){
//                 const list = new List({
//                     name : CustomListName,
//                     item : defaultList
//                 });
//                 res.redirect("/" + CustomListName);
//                 list.save();

//             }else {
//                 res.render("list",{
//                     ListTitle : foundList.name,
//                     newItems : foundList.item
//                 });
//             }
//         }
//     });

// });

// app.post("/", function(req, res){

//     var itemName = req.body.item;
//     var listName = req.body.list;

//     var today = new Date();
//     var currentday = today.getDay();
//     var options = {
//         month:"long",
//         year : "numeric",
//         weekday :"long"
//     };

//     var day = today.toLocaleDateString("en-US", options);

//     const Newitem = new Item ({
//         name : itemName
//     });
//     if(listName === day){
//         Newitem.save();
//         res.redirect("/");
//     }else{
//         List.findOne({name : listName}, function(err, foundList){
//             foundList.item.push(Newitem);
//             foundList.save();
//             res.redirect("/" + listName);
//         });
//     }
// });

// app.post("/delete", function(req, res){
//     const checkedItems = req.body.checkbox;
//     const listName = req.body.ListName;

//     var today = new Date();
//     var currentday = today.getDay();
//     var options = {
//         month:"long",
//         year : "numeric",
//         weekday :"long"
//     };

//     var day = today.toLocaleDateString("en-US", options);

//     if(listName === day){
//         Item.findByIdAndRemove(checkedItems, function(err){
//             if(!err){
//                 console.log("successfully deleted");
//                 res.redirect("/");
//             }
//         });
//     }else{

//     }   
// });


app.listen(3000, function(){
    console.log("Server running on 3000 port");
});

// "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\data\db"

// "C:\Program Files\MongoDB\Server\4.4\bin\mongo.exe"