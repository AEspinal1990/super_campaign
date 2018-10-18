const bcrypt    = require('bcrypt');
const passport  = require('passport');

passport.serializeUser(function(user_id, permission, done) {
    done(null, user_id, permission);
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

export const authenticationMiddleware = () => {
    return (req, res, next) => {
        console.log('Starting auth check');
        console.log(`req.session.user: 
            ${JSON.stringify(req.session.passport)}`);

        if(req.isAuthenticated()) 
            return next();
        console.log('Finshing auth check')
        res.redirect('/auth/', {errorMessage: 'You need to log in first.'});
    }
}