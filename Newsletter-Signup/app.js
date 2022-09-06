const express = require("express");
const bodyParser = require("body-parser");
const req = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/signup.html");
});

app.post("/", function(request, response){
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var emailAdd = request.body.emailAdd;
    console.log(firstName, lastName, emailAdd);
})

app.listen(3000, function(){
    console.log("Server is up and running on Port 3000");
});