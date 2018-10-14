//import "../../dist/util/createUser.js"
//import { CampaignManager }      from '../backend/entity/CampaignManager';
//import { Canvasser }      from '../backend/entity/Canvasser'; 
//import { SystemAdmin }      from '../backend/entity/SystemAdmin'; 
//import { User } from '../backend/entity/User';

const assert = require('chai').assert;
const createBaseUserFunct = require('../../dist/util/createUser.js').createBaseUser;
const createRoledUserFunct = require('../../dist/util/createUser.js').createRoledUser;
// Tests CreateBaseUser Function
 describe('CreateBaseUser Test',function(){
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

//Tests CreateRoledUser Function
 describe('CreateRoledUser Test',function(){
     let campaignRole = 1;
     let canvasserRole = 2;
     let SystemAdminRole = 3; //anything other than 1 or 2
     let someUserData = {username: 'blah', name: 'asd', password: 'asdf', role: '1' };
     let tempUser = createBaseUserFunct(someUserData);
     let createdRoleUser1 = createRoledUserFunct(campaignRole,tempUser);
     let createdRoleUser2 = createRoledUserFunct(canvasserRole,tempUser);
     let createdRoleUser3 = createRoledUserFunct(SystemAdminRole,tempUser);
     
     it('CreateRoledUser should return Campaign Manager Object', function(){
         assert.equals(typeof(createdRoleUser1), typeof(new CampaignManager() ))
     });
     it('CreateRoledUser should return Canvasser Object', function(){
        assert.equals(typeof(createdRoleUser2), typeof(new Canvasser() ))
    });
     it('CreateRoledUser should return System Admin Object', function(){
        assert.equals(typeof(createdRoleUser3), typeof(new SystemAdmin() ))
    });
});
 