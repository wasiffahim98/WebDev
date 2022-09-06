const express = require("express");
const bodyParser = require("body-parser");
const req = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/signup.html");
});

app.post("/", function(request, response){
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const emailAdd = request.body.emailAdd;
    
    const data = {
        members: [
            {
                email_address: emailAdd,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/b2b0f7153d";
    const options = {
        method: "POST",
        auth: "wfahim1:fa9f28e8329f13e1f41a5287e135bcd4-us14"
    };

    const r1 = https.request(url, options, function(res){

        if (res.statusCode === 200){
            response.send("Sucessfully subscribed!");
        } else {
            response.send("There was an error with signing up, please try again!");
        }

        res.on("data", function(data){
            console.log(JSON.parse(data))
        })
    });

    r1.write(jsonData);
    r1.end();
    
});

app.listen(3000, function(){
    console.log("Server is up and running on Port 3000");
});


// API Key: fa9f28e8329f13e1f41a5287e135bcd4-us14

// Audience ID: b2b0f7153d