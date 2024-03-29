import express from 'express';
import bodyParser from 'body-parser';
import User from '../models/users';
import passport from 'passport';
import * as authenticate from '../authenticate';
import * as cors from './cors';


const userRouter = express.Router();

userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, err => next(err))
  .catch(err => next(err));
});

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {

  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({error: err});
    }else{
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      
      user.save((err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({error: err});
        }else{
          passport.authenticate('local')(req, res, () => {
          const token = authenticate.getToken({_id: req.user._id});
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({token: token,status: 'Registration Successful!', user: user});
        })
        }
      })    
    }
  });

})

userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({token: token, status: 'You are successfully loggedin!'});
})

userRouter.get('/logout' , (req, res, next) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('SID');
    res.redirect('/');
  }else{
    let err = new Error('You are not logged in.');
    err.status = 403;
    next(err);
  }
})

userRouter.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

export default userRouter;
