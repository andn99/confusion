import express from 'express';
import bodyParser from 'body-parser';
import User from '../models/users';
import passport from 'passport';
import * as authenticate from '../authenticate';

const userRouter = express.Router();

userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

userRouter.post('/signup', (req, res, next) => {

  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err){
      res.statusCode = 200;
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
  });

})

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
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

export default userRouter;
