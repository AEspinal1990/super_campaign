const assert = require('chai').assert;

//const getQuestionaireFunct = require('../../dist/util/campaignParser.js').getQuestionaire;
const getTalkingPointsFunct = require('../../dist/util/campaignParser.js').getTalkingPoints;
const createCampaignInfoFunct = require('../../dist/util/campaignParser.js').createCampaignInfo;
// const createTalkingPointsFunct = require('../../dist/util/campaignParser.js').createTalkingPoints;
// const createQuestionnairesFunct = require('../../dist/util/campaignParser.js').createQuestionnaires;

//Create CampaignInfo uses initCampaign and parses information, this checks if the information is parsed properly.
describe('CreateCampaignInfo Test', function(){
    campaignData = {
        campaignName: 'Campaign Name',
        startDate: '1990-02-26',
        endDate: '2018-10-16',
        averageExpectedDuration: '60'
     };
     let campaign = createCampaignInfoFunct(campaignData);

     it('campaign is campaign Object', function(){ 
        assert.typeOf(campaign, 'object');
        assert.property(campaign,'name');
        assert.property(campaign,'startDate');
        assert.property(campaign,'endDate');
        assert.property(campaign,'avgDuration');
     });
     it('campaign has correct campaign Name', function(){ 
        assert.property(campaign,'name');
        assert.propertyVal(campaign,'name',campaignData['campaignName']);
        
     });
     it('campaign has correct start date', function(){ 
        assert.property(campaign,'startDate');
        assert.isNotNull(campaign.startDate);
        startDateString = campaignData['startDate'].split("-");
        startDate = new Date(startDateString[0], startDateString[1], startDateString[2]);
        //console.log("start date", startDate, "campaign ", campaign.startDate);
        assert.equal(startDate.getFullYear(),campaign.startDate.getFullYear());
        assert.equal(startDate.getDate(), campaign.startDate.getDate());
        assert.equal(startDate.getMonth(),campaign.startDate.getMonth());
        
     });
     it('campaign has correct end date', function(){ 
        assert.property(campaign,'endDate');
        assert.isNotNull(campaign.endDate);
        endDateString = campaignData['endDate'].split("-");
        endDate = new Date(endDateString[0], endDateString[1], endDateString[2]);
        //console.log(endDate, campaign.endDate);
        //console.log("end date", endDate, "campaign ", campaign.endDate);
        assert.equal(endDate.getFullYear(), campaign.endDate.getFullYear());
        assert.equal(endDate.getDate(), campaign.endDate.getDate());
        assert.equal(endDate.getMonth(),campaign.endDate.getMonth());
        
     });
     it('campaign has correct average duration', function(){
        assert.property(campaign,'avgDuration');
        assert.isNotNull(campaign.endDate);
        assert.equal(campaign.avgDuration, campaignData['averageExpectedDuration']);
     });
});

//precondition: createCampignInfo is right
describe('GetTalkingPoints Test', function(){
    let campaignData = {
        campaignName: 'Campaign Name',
        startDate: '1990-02-26',
        endDate: '2018-10-16',
        talkingPoints: 'MY talking points are here \n eishuifhd',
        averageExpectedDuration: '60'
     };
    let campaign = createCampaignInfoFunct(campaignData);
    let talkingPointsArr = getTalkingPointsFunct(campaign,campaignData);
    let expectedArr = campaignData['talkingPoints'].split("\n");
    for(let i in expectedArr) {
        expectedArr[i] = expectedArr[i].trim().replace('\r','');
    }
    let idx = 0;
    talkingPointsArr.forEach(function(test){
        console.log( test);
        it('Talking point is a proper talkingPoints object', function(){
            assert.typeOf(test,'object');
            assert.property(test,'_talk');
            assert.property(test,'_campaign');
        });
        it('Talking point has correct talk field', function(){
            assert.equal(expectedArr[idx],test.talk);
            idx++;
        });
    });


});
// describe('Create Locations Test', function(){
//     let campaignData = {
//         campaignName: 'Campaign Name',
//         startDate: '1990-02-26',
//         endDate: '2018-10-16',
//         talkingPoints: 'MY talking points are here \n eishuifhd',
//         questionaire: ' Do you like cheese?\r\n Questions are separated by new lines, so even if this isn\'t a good question it\'s okay.\r\n '+
//         'Is this a good question?\r\n',
//         averageExpectedDuration: '60',
//         locations:
//                 '84, hAMPSHIRE DRIVE, 1, FARMINGDALE, NY, 11735\r\n12, hAMPSHIRE DRIVE, 2,FARMINGDALE, NY, 11735\r\n55, hAMPSHIRE DRIVE, 3, FARMINGDALE , NY, 11735',
//      canvassers: '1 2 3 1 31 31'
//      };
// });
// describe('Create Questionnaire Test', function(){
//     let campaignData = {
//         campaignName: 'Campaign Name',
//         startDate: '1990-02-26',
//         endDate: '2018-10-16',
//         talkingPoints: 'MY talking points are here \n eishuifhd',
//         questionaire: ' Do you like cheese?\r\n Questions are separated by new lines, so even if this isn\'t a good question it\'s okay.\r\n '+
//         'Is this a good question?\r\n',
//         averageExpectedDuration: '60',
//         locations:
//                 '84, hAMPSHIRE DRIVE, 1, FARMINGDALE, NY, 11735\r\n12, hAMPSHIRE DRIVE, 2,                               FARMINGDALE, NY, 11735\r\n55, hAMPSHIRE DRIVE, 3, FARMINGDALE , NY, 11735',
//      canvassers: '1 2 3 1 31 31'
//      };
//     let questionnaireArr = createQuestionnairesFunct(campaignData);
//     //console.log(questionnaireArr);
//     let expectedArr = campaignData['questionaire'].trim().split("\n");
//     let idx = 0;
//     it('Number of questions should be right', function(){
//         assert.equal(questionnaireArr.length, expectedArr.length);
//     });
//     questionnaireArr.forEach(function(test){
//         it('Questionaire is a proper Questionaire object', function(){
//             assert.typeOf(test,'object');
//             assert.property(test,'question');
//             assert.property(test,'campaignID');
//         });
//         it('Questionnaire  has correct question field', function(){
//             assert.equal(test.question, expectedArr[idx]);
//             idx++;
//         });
//     });
// });
// describe('Create Questionnaire Whitespace Test', function(){
//     let campaignData = {
//         campaignName: 'Campaign Name',
//         startDate: '1990-02-26',
//         endDate: '2018-10-16',
//         talkingPoints: 'MY talking points are here \n eishuifhd',
//         questionaire: ' Do you like cheese?\r\n\n\n\n Questions are separated by new lines, so even if this isn\'t a good question it\'s okay.\r\n '+
//         'Is this a good question?\r\n',
//         averageExpectedDuration: '60',
//      };
//     let questionnaireArr = createQuestionnairesFunct(campaignData);
//     //console.log(questionnaireArr);
//     let idx = 0;
//     it('Number of questions should be right', function(){
//         assert.equal(questionnaireArr.length, 3);
//     });
//     questionnaireArr.forEach(function(test){
//         it('Questionaire is a proper Questionaire object', function(){
//             assert.typeOf(test,'object');
//             assert.property(test,'question');
//             assert.property(test,'campaignID');
//         });
//     });
// });
// describe('CreateCampaign Test', function(){     
//     campaignDataExample = { campaignName: 'SomeCampaign', startDate: '2012-03-31',
//     endDate: '2012-03-32', talkingPoints: 'Talking POINT 1\r\nTALKING POINT 2',
//     questionaire: 'Q1\r\nQ2\r\nQ3 Q3PART 2', averageExpectedDuration: '55',
//     locations: '123, UMIY=, STATE, ZIPCOPDE1\r\n443, UMIY=, STATE, ZIPCOPDE2\r\n2513, UMIY=, STATE, ZIPCOPDE2\r\n12963, UMIY=, STATE, ZIPCOPDE3\r\n',
//     canvassers: '12 21 42 41 21' }
//     it('CreateCampaign campaignName matches Input', function(done){
//         let createdCampaign = createCampaignFunct(campaignDataExample);
//         assert.equal(createdCampaign.campaignName, campaignDataExample["SomeCampaign"]);
//         done();
//     });
//     it('CreateCampaign Start Date matches', function(done){
//         let createdCampaign = createCampaignFunct(campaignDataExample);
//         assert.equal(createdCampaign.startDate, campaignDataExample["startDate"]);
//         done();
//     });
//     let createdCampaign = createCampaignFunct(campaignDataExample);
//     it('CreateCampaign End Date matches', function(){
//         assert.equal(createdCampaign.endDate, campaignDataExample["endDate"]);
//     });
//     it('CreateCampaign Average Duration matches', function(){
//         assert.equal(createdCampaign.avgDuration, campaignDataExample["averageExpectedDuration"]);
//     });

// });