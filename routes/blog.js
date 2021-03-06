var express=require('express')
var mongoose=require('mongoose')
var fs=require('fs')


var Blogs=require('../models/blog')
var bodyParser=require('body-parser')


var blogRouter= express.Router()
blogRouter.use(bodyParser.json())

blogRouter.get('/blog',function(req,res){
    Blogs.find().sort({dateCreated:-1}).exec(function(err,docs){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.render('index',{files:docs})
        }
    })
})

blogRouter.get('/blog/:username', (req, res) => {
    Blogs.find().sort({dateCreated:-1}).exec(function(err,docs){
        if(err){
            res.status(500).send("Error Occured");
        }
        else{
            res.render('dashboard',{files:docs})
        }
    })
});

blogRouter.post('/blog',function(req,res){
    let blogId;
    req.body.author=req.user.username
    console.log(req.user.username)
    Blogs.create(req.body,function(err,doc){
        if(err){
            console.log(err);
            res.status(500).send("Db error")
        }
        else{
            console.log("Blog Inserted")
            }
        })


    
    
    var username=req.user.username
  res.redirect('/blog/blog/'+username);
})


blogRouter.post('/blog/:blogId/like',function(req,res){
    Blogs.findById({_id:req.params.blogId},function(err,doc){
        var username=req.user.username;
        if(doc.likes.length==0){
            Blogs.findOne({_id:req.params.blogId},function(err,doc){
                req.body.noOfLikes=++req.body.noOfLikes;
                req.body.person=req.user.username   
                doc.likes.push(req.body);
                doc.save();
                console.log("Entered2")
            })
        }
        
        else{
            var check=0;
        doc.likes.forEach(function(like){
            //console.log(like.person)
            if(like.person==username){
                console.log("Entered");
                check=1;
            }
        })
        if(check==0){
            Blogs.findOne({_id:req.params.blogId},function(err,doc){
                req.body.noOfLikes=++req.body.noOfLikes;
                req.body.person=req.user.username   
                doc.likes.push(req.body);
                doc.save();
                console.log("Entered2")
            })
        }
    }
        res.redirect('/blog/blog/'+req.user.username);
        })
})

module.exports=blogRouter;