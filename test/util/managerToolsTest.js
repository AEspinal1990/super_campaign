const estimateTaskFunct = require('../../dist/util/managerTools.js').estimateTask;
//const getCampaignLocationsFunct =  require('../../dist/util/managerTools.js').getCampaignLocations;
const assert = require('chai').assert;
const getAvgSpeedFunct = require('../../dist/util/managerTools.js').getAvgSpeed;
const getWorkdayLimitFunct = require('../../dist/util/managerTools.js').getWorkdayLimit;
const createCampaignLocationsFunct = require('../../dist/util/campaignCreator.js').createCampaignLocations;
const fs = require('fs');

//tests CampaignLocation
describe("Campaign Locations Test", function(){
    let campaignData = {
        campaignName: 'Campaign Name',
        startDate: '1990-02-26',
        endDate: '2018-10-16',
        talkingPoints: 'MY talking points are here \n eishuifhd',
        questionaire: ' Do you like cheese?\r\n Questions are separated by new lines, so even if this isn\'t a good question it\'s okay.\r\n '+
        'Is this a good question?\r\n',
        averageExpectedDuration: '60',
        locations:
                '84, hAMPSHIRE DRIVE, 1, FARMINGDALE, NY, 11735\r\n12, hAMPSHIRE DRIVE, 2,                               FARMINGDALE, NY, 11735\r\n55, hAMPSHIRE DRIVE, 3, FARMINGDALE , NY, 11735',
     canvassers: '1 2 3 1 31 31'
     };
    let campaign =  createCampaignLocationsFunct(campaignData);
    let locationRes = campaign.locations;
    it("Expected Number of locations is 3", function(){
        assert.equal(locationRes.length,3);
    });
    let expectedArr = campaignData['locations'].split("\n");
    console.log(locationRes);
    let idx = 0;
    locationRes.forEach(function(test){
        //console.log(test);
        let expectedField = expectedArr[idx].split(",")
        it('Locations is a proper Locations object', function(){
            assert.typeOf(test,'object');
            assert.property(test,'_streetNumber');
            assert.property(test,'_street')
            assert.property(test,'_unit');
            assert.property(test,'_city');
            assert.property(test,'_state');
            assert.property(test,'_zipcode');
        
        });
         it('Locations has correct streetnum', function(){
             assert.equal(expectedField[0].trim(),test._streetNumber);
        });
        it('Locations has correct street', function(){
            assert.equal(expectedField[1].trim(),test._street);
       });
        it('Locations has correct unit', function(){
            assert.equal( expectedField[2].trim(),test._unit);
       });
       it('Locations has correct city', function(){
        assert.equal(expectedField[3].trim(),test._city);
        });
       it('Locations has correct state', function(){
            assert.equal(expectedField[4].trim(),test._state);
        });
        it('Locations has correct zipcode', function(){
            assert.equal(expectedField[5].trim(),test._zipcode);
        });
        idx++;
    });

})
//tests Global Parameters
describe("Global Parameter [Static] Test", function(){
    let avgSpeed = getAvgSpeedFunct();
    let workday = getWorkdayLimitFunct();
    it("Expected Average Speed to be 25", function(){
        assert.equal(avgSpeed,25);
    });
    it("Expected time limit for workday to be 100", function(){
        assert.equal(workday,100);
    });
});
//Tests EstimateTask Function
// describe("Estimate Task Test", function(){
//     let avgDuration = 60;
//     let travelSpeed = 20;
//     let workdayDuration = 5;
    //let timeTaken = estimateTaskFunct(avgDuration, travelSpeed, workdayDuration);
    //estimateTask = (locations, avgDuration, travelSpeed, workdayDuration) 
    // it("Expected Time for Task is", function(){

    //     assert.equal()
    // })
//})