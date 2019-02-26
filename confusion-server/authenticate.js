import passport from 'passport';
import User from './models/users';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import jwt from 'jsonwebtoken';
import Config from './config';

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
    User.findOne({id: payload.sub}, (err, user)=> {
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