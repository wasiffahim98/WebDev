const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true;
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
//Fetches all the articles
.get(function(request, response){
    Article.find(function(err, foundArticles){
        if (!err){
            response.send(foundArticles);
        }
        else{
            response.send(err);
        }
    });
})
//Creates a new article
.post(function(request, response){
    console.log(request.body.title);
    console.log(request.body.content);

    const newArticle = new Article({
        title: request.body.title,
        content: request.body.content
    });

    newArticle.save(function(err){
        if(!err){
            response.send("successfully added a new article");
        }
        else{
            response.send(err);
        }
    })
})
//Delete all articles
.delete(function(request, response){
    Article.deleteMany(function(err){
        if(!err){
            response.send("Successfully deleted all the articles");
        }
        else{
            response.send(err);
        }
    })
});



app.route("/articles/:articleTitle")
//Find a specific article
.get(function(request, response){
    Article.findOne({title: request.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            response.send(foundArticle);
        }
        else{
            response.send("No articles were found!");
        }
    })
})
//Updates the specific article by overwriting
.put(function(request, response){
    Article.updateOne(
        {title: request.params.articleTitle},
        {title: request.body.title, content: request.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                response.send("Article successfully updated!");
            }
            else{
                response.send(err);
            }
        }
    );
})
//Updates the specific article by replacing parameters
.patch(function(request, response){
    Article.updateOne(
        {title: request.params.articleTitle},
        {$set: request.body},
        function(err){
            if(!err){
               response.send("Article successfully updated"); 
            }
            else{
                response.send(err);
            }
        }
    );
})
//Deletes the specific article
.delete(function(request, response){
    Article.deleteOne(
        {title: request.params.articleTitle},
        function(err){
            if(!err){
                response.send("Article successfully deleted!");
            }
            else{
                response.send(err);
            }
        }
    );
});

app.listen(3000, function(){
    console.log("server is on port 3000");
});