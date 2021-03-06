var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('user');
var Portfolio = mongoose.model('portfolio');

router.get('/', function(req,res,next){
  var allportos
  Portfolio.find({}, function(err,portos){

    res.render('index.ejs', {"data":portos});




  });



});

router.get('/loginSuccess', function(req,res,next){
  res.render('loginSuccess');
});
router.get('/loggedIn', function(req,res,next){
  if(req.session.user){
  res.render('loggedIn');
  }
  else
    res.render('index')
});

router.get('/logout',function(req,res,next){
  req.session.user=null;
  res.render('index');

});

router.get('/signUp', function(req,res,next){

  res.render('signUp');

});

router.post('/signUp', function(req,res,next){
  if(req.body.username===''|| req.body.password===''){
    req.flash('error','Username and password cannot be empty!');
    res.redirect('/signUp');
    return ;
  }
  User.findOne({'username':req.body.username}, function(err,user){
    if(err) return err;
    if(user){
      req.flash('error','Username already taken!');
      res.redirect('/signUp');
      return;
    }


  });
  User.create(req.body, function(err,user){

    if(err) return err;
    console.log(user);
    req.flash('success','Sign Up successful. Login with username: '+req.body.username);
    res.redirect('/');

  });

});

router.get('/login', function(req,res,next){

  res.render('login');

});
router.get('/createPortfolio', function(req,res,next){
  console.log(req.session.user);
  var tempPort = {name:req.session.user.name, username:req.session.user.username};
   Portfolio.findOne({'username':req.session.user.username}, function(err,port){
    if(err) return err;
    if(!port){
      Portfolio.create(tempPort, function(err,user){
      if(err) return err;
        req.flash('success', 'Your portfolio was successfully created.')
        res.redirect('/createPortfolio');
      });
    }
    console.log(req.session.user.username);
    Portfolio.findOne({'username':req.session.user.username}, function(err,porto){
    console.log(porto);
    if(porto)
    {
      res.render('createPortfolio', {"data":porto});
    }  



    });
});
 })

router.post('/addLink',function(req,res,next){
  var portfolio_id = req.body.portfolio_id;
  Portfolio.findByIdAndUpdate(portfolio_id,{$push: {"links":req.body.link}}, {safe:true, upsert:true, new:true}, function(err, portfolio){
    console.log(portfolio.links);
    res.redirect('/createPortfolio');




  })




});


router.post('/login', function(req,res,next){
  if(req.body.username==='' || req.body.password===''){
      req.flash('error','Please enter username and password');
      res.redirect('/login');
      return;
  }
  User.findOne({'username':req.body.username}, function(err,user){
    if(err) return err;
    if(user && user.password===req.body.password){
      console.log(user);
      req.session.user=user;
      res.redirect('/loginSuccess');
    }
    else
    {
      req.flash('error','Incorrect username or password');
      res.redirect('/login');
    }



  });

});

module.exports = router;
