const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var items = ["Buy Food", "Eat Food", "Cook Food"];

app.get("/", function(request, response){
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    day = today.toLocaleDateString("en-US", options);
    response.render("list",{kindOfDay: day, newListItems: items});
});

app.post("/", function(request, response){
    var item = request.body.newItem;
    items.push(item);
    response.redirect("/");
})

app.listen(3000, function(){
    console.log("Server is up and running on Port 3000");
});