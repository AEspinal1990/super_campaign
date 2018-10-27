
 const assert = require('chai').assert;
 const adminFile = require('../../dist/admin/routes.js')
 const app = require('../../dist/server.js')

//  describe('View Global Parameters Test',function(){
//     const globalParams = {
//         "taskTimeLimit": "360",
//         "averageSpeed": "55"
//       };
//     it('POST /global', function(){
//         //may need to post to app instead of server
//         request(app).post('/global').send(globalParams).expect(400).end((err,res))
//     });
//     });
