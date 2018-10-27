const bcrypt    = require('bcryptjs');
const passport  = require('passport');
const LocalStrategy = require('passport-local').Strategy
import { User } from "../backend/entity/User";
import { getRepository }    from "typeorm";

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});
  
passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

export const hashPassword = async password => {
    try{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);

    } catch(error) {
        throw new Error('Hashing failed: ' + error);
    }   
}

export const comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        throw new Error('Comparing failed: ' + error);
    }
};

export function authenticationMiddleware() {
    console.log('Before auth')
    return (req, res, next) => {
        console.log('Starting auth check');
        console.log(`req.session.user: 
            ${JSON.stringify(req.session.passport)}`);

        if(req.isAuthenticated()) 
            return next();
        console.log('Finshing auth check')
        res.send('BAd')//('/auth/', {errorMessage: 'You need to log in first.'});
    }
}

passport.use('local', new LocalStrategy(async (username, password, done) => {
    try {
        console.log(username);
        const userRepository = getRepository(User);    
        const user = await userRepository.find({
          where: {"_username": username}
        }).catch(e => console.log(e));
  
        console.log(user);
      // Check if password is correct for this account
      const isValid = await comparePasswords(password, user[0]._password)
      console.log('THe user',user);
      
      if (isValid) {
          
        return done(null, user)
      } else {
        console.log('Invalid pass')
        return done(null, false, {message: 'Incorrect Password'})
      }
    } catch (error) {
      console.log('Error in strategy')
      return done(error, false)
    }
  } // End async
))