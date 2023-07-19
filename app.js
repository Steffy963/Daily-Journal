//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
//const _ = require("lodash");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
//const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/journalDB",{useNewUrlParser: true});

//a new postSchema that contains a title and content.

const postSchema = {
  title: String,
  content: String
};

//a new mongoose model using the schema to define your posts collection

const Post = mongoose.model("Post", postSchema);

//let posts = [];  //delete the existing posts array.

// app.get("/", function(req, res){
//   res.render("home", {
//     startingContent: homeStartingContent, 
//     newPost: posts
//   });
// });

app.get("/", function(req, res){

  Post.find().then(posts =>{
    res.render("home", {
      startingContent: homeStartingContent,
      newPost: posts
    });
  });
});

app.get("/about", function(req, res){
  res.render("about", {abContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});


app.post("/contact", (req, res) => {
    console.log(req.body);
    res.render("thanks");
  });

app.get("/thanks", function(req, res){
  res.render("thanks");
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({  //create a new post document using  mongoose model.
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //posts.push(post);
  // post.save();
  // res.redirect("/");
//to save the document to your database instead of pushing to the posts array
  
  post.save().then(()=> {   //callback to the save method to only redirect to the home page once save is complete with no errors.
      res.redirect("/");
    })
    .catch(error => {
      console.error(error);
      // Handle the error
    });
  });


  app.get("/posts/:title", (req, res)=> {
    const requestedTitle = req.params.title;
    

    Post.findOne({title: { $regex: new RegExp(`^${requestedTitle}$`, "i")}}).then(post => {
      if (post) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      } else {
        // Handle post not found
        res.send("Sorry Page Not Found !!");
      }
    }).catch(error => {
      // Handle error
      res.send("error");
    

    // Post.findOne({title: requestedTitle}) .then(post => {
    //   res.render("post", {
    //     title: post.title,
    //     content: post.content
    //   });
  
    
    });
    
  });
  app.listen(port, ()=> {
    console.log(`server started at http://localhost:${port}`);
 });

