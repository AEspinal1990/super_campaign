import { User }             from "../backend/entity/User";
import { getRepository }    from "typeorm";
const bcrypt            = require('bcryptjs');
const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy


const logger = require('../util/logger');
const authLogger = logger.getLogger('authLogger');

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
        authLogger.error(`An error occurred while hashing the password!`);
        throw new Error('Hashing failed: ' + error);
    }   
}

export const comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (error) {
        authLogger.error(`An error occurred while comparing the passwords!`);
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

// TODO: Remove unnecessary logs
passport.use('local', new LocalStrategy(async (username, password, done) => {
    try {
        const userRepository = getRepository(User);    
        const user = await userRepository.find({
          where: {"_username": username}
        })
        .catch(e =>{
            authLogger.error(`An error occured while searching for ${username}, ${e}`);
            
        });
        
        // Does the user exist?
        if(user[0] === undefined ){
            authLogger.warn(`${username} was not found.`)
            return done(null, false, {message: 'User does not exist.'})
        }

        // Check if password is correct for this account
        const isValid = await comparePasswords(password, user[0]._password);      
        if (!isValid) {          
            authLogger.warn(`Login error incorrect password for ${username}.`)
            return done(null, false, {message: 'Incorrect Password'})
        }

        // Valid user and password
        return done(null, user)
    } catch (error) {
        
        return done(error, false)
    }
  } 
));