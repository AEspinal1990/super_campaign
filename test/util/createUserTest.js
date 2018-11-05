const User = require('../../dist/backend/entity/User');
const assert = require('chai').assert;
const createBaseUserFunct = require('../../dist/util/createUser.js').createBaseUser;
const createRoledUserFunct = require('../../dist/util/createUser.js').createRoledUser;

// Tests CreateBaseUser Function
 describe('CreateBaseUser Test',function(){
    let someUserData = { username: 'blah', name: 'asd', password: 'asdf', role: '1' };
    let createdUser = createBaseUserFunct(someUserData);
    it('CreateBaseUser should return User Object', function(){
        assert.typeOf(createdUser,'Object');
        assert.property(createdUser, 'username');
        assert.property(createdUser, 'name');
        assert.property(createdUser, 'password');
        assert.property(createdUser, 'permission');
        
    });
     it('CreateBaseUser should return blah for username', function(){
         assert.equal(createdUser.username,someUserData["username"]);
     }); 
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
     let SystemAdminRole = 3; 
     
     it('CreateRoledUser should return Campaign Manager Object', function(){
        let someUserData = {username: 'blah', name: 'asd', password: 'asdf', role: '1' };
        let tempUser = createBaseUserFunct(someUserData);
        let createdRoleUser = createRoledUserFunct(campaignRole,tempUser);
         assert.typeOf(createdRoleUser, 'object');
         assert.property(createdRoleUser,'ID');
         assert.propertyVal(createdRoleUser,'ID',tempUser);
         assert.equal(campaignRole, tempUser.permission);
     });
     it('CreateRoledUser should return Canvasser Object', function(){
        let someUserData = {username: 'blah', name: 'asd', password: 'asdf', role: '2' };
        let tempUser = createBaseUserFunct(someUserData);
        let createdRoleUser = createRoledUserFunct(canvasserRole,tempUser);
        assert.typeOf(createdRoleUser, 'object');
        assert.property(createdRoleUser,'ID');
        assert.propertyVal(createdRoleUser,'ID',tempUser);
        assert.equal(canvasserRole, tempUser.permission);
    });
     it('CreateRoledUser should return System Admin Object', function(){
        let someUserData = {username: 'blah', name: 'asd', password: 'asdf', role: '3' };
        let tempUser = createBaseUserFunct(someUserData);
        let createdRoleUser = createRoledUserFunct(SystemAdminRole,tempUser);
        assert.typeOf(createdRoleUser, 'object');
        assert.property(createdRoleUser,'ID');
        assert.propertyVal(createdRoleUser,'ID',tempUser);
        assert.equal(SystemAdminRole, tempUser.permission);
    });
});

//Tests CreateRoledUser Function
describe("something", function(){
    something = {something1:"a",something2:"b"};
    it("someTest", function(){
        assert.typeOf(something, "Object");
    });
});