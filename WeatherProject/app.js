const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(request, response){
    response.sendFile(__dirname + "/index.html");
});

app.post("/", function(request, response){
    const query = request.body.cityName;
    const apiKey = "de5a8a6c2735448173a7c61a1c680ea2";
    const unit = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function(res){
        res.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp; 
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            response.write("<h1>Weather Forecast for " + query + "</h1>");
            response.write("<p>The temperature in " + query + " is " + temp + " degrees F with " + des + ".</p>");
            response.write("<img src=" + imageURL + ">");
            response.send();
        });
    });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});

