//import "../../dist/util/createUser.js"
const assert = require('chai').assert;
const createBaseUserFunct = require('../../dist/util/createUser.js').createBaseUser;

 describe('CreateUser',function(){
    let someUserData = { username: 'blah', name: 'asd', password: 'asdf', role: '1' };
    let createdUser = createBaseUserFunct(someUserData);
    it('CreateBaseUser should return User Object', function(){
        assert.equals(typeof(createdUser),typeof(new User()) );
    });
     it('CreateBaseUser should return blah for username', function(){
         assert.equal(createdUser.username,someUserData["username"]);
     }); //it refers to goal
     it('CreateBaseUser should return asd for name', function(){
        assert.equal(createdUser.name,someUserData["name"]);
     });
     it('CreateBaseUser should return asdf for password', function(){
        assert.equal(createdUser.password,someUserData["password"]);
     });
     it('CreateBaseUser should return 1 for role', function(){
        assert.equal(createdUser.permission,someUserData["role"]);
     });
 });