const estimateTaskFunct = require('../../dist/util/managerTools.js').estimateTask;
const getCampaignLocationsFunct =  require('../../dist/util/managerTools.js').getCampaignLocations;
const assert = require('chai').assert;
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
    let locationRes =  
    someJsonData = 
    it("Expected Time for Task is")
})
//Tests EstimateTask Function
describe("Estimate Task Test", function(){
    let avgDuration = 60;
    let travelSpeed = 20;
    let workdayDuration = 5;
    let timeTaken = estimateTaskFunct(avgDuration, travelSpeed, workdayDuration);
    //estimateTask = (locations, avgDuration, travelSpeed, workdayDuration) 
    it("Expected Time for Task is", function(){

        assert.equal()
    })
})