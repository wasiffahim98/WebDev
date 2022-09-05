const express = require("express");
const app = express();

app.get("/", function(request, response) {
    response.send("<h1>Hello World!</h1>");
});

app.get("/contact", function(request, response){
    response.send("Contact me at wasif.fahim@gmail.com");
});

app.get("/about", function(request, response){
    response.send("Recent UCSD CS grad");
});

app.get("/hobbies", function(request, response){
    response.send("<ul><li>Code</li><li>Travel</li><li>Hike</li></ul>")
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
});