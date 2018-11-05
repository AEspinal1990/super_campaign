const assert = require('chai').assert;

const getQuestionaireFunct = require('../../dist/util/campaignParser.js').getQuestionaire;
const getTalkingPointsFunct = require('../../dist/util/campaignParser.js').getTalkingPoints;
const createCampaignInfoFunct = require('../../dist/util/campaignParser.js').createCampaignInfo;
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

//Tests whether the TalkingPoints in the dataset is parsed properly and stored into the proper Object.
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
    let talkingPointsArr = getTalkingPointsFunct(campaign,campaignData['talkingPoints']);
    let expectedArr = campaignData['talkingPoints'].trim().split("\n");
    for(let i in expectedArr) {
        expectedArr[i] = expectedArr[i].trim().replace('\r','');
    }
    let idx = 0;

    talkingPointsArr.forEach(function(test){
        console.log("test:",test.talk);
        console.log("expected:",expectedArr[idx])
        console.log("idx:",idx);
        it('Talking point is a proper talkingPoints object', function(){
            assert.typeOf(test,'object');
            assert.property(test,'_talk');
            assert.property(test,'_campaign');
        });
        it('Talking point has correct talk field', function(){
            assert.equal(test.talk, expectedArr[idx]);
            idx++;
        });
    });


});
describe('GetQuestionnaire Test', function(){
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
    let campaign = createCampaignInfoFunct(campaignData);
    let questionnaireArr = getQuestionaireFunct(campaign,campaignData['questionaire']);
    //console.log(questionnaireArr);
    let expectedArr = campaignData['questionaire'].trim().split("\n");
    for(let i in expectedArr) {
        expectedArr[i] = expectedArr[i].replace('\r','');
    }  
    let idx = 0;
    it('Number of questions should be right', function(){
        assert.equal(questionnaireArr.length, expectedArr.length);
    });
    questionnaireArr.forEach(function(test){
        it('Questionaire is a proper Questionaire object', function(){
            assert.typeOf(test,'object');
            assert.property(test,'_question');
            assert.property(test,'_campaign');
        });
        it('Questionnaire  has correct question field', function(){
            assert.equal(test.question, expectedArr[idx]);
            idx++;
        });
    });
});
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