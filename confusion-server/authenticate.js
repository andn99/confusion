import passport from 'passport';
import User from './models/users';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import jwt from 'jsonwebtoken';
import Config from './config';
import FacebookTokenStrategy from 'passport-facebook-token';

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export const getToken = (user) => {
    return jwt.sign(user, Config.SECRET_KEY, {expiresIn: 3600});
}

export const jwtPassport = passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Config.SECRET_KEY
}, (payload, done) => {
    User.findOne({_id: payload._id}, (err, user)=> {
        if(err){
            return done(err, false);
        }

        if(user){
            return done(null, user);
        }else{
            return done(null, false);
        }
    })
}));

export const verifyUser = passport.authenticate('jwt', {session: false});
export const verifyAdmin = (req, res, next) => {
    User.findOne({_id: req.user._id})
    .then(user => {
        if(!user || !user.admin){
            let err = new Error('You are not the admin user!');
            return next(err);
        }
        return next();
    }, err => next(err))
    .catch(err => next(err));
};

export const facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: Config.FB.clientId,
    clientSecret: Config.FB.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));