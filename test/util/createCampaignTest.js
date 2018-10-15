


const assert = require('chai').assert;

const createCampaignFunct = require('../../dist/util/createCampaign.js').createCampaign;
const createQuestionnairesFunct = require('../../dist/util/createCampaign.js').createQuestionaires;
const createLocationsFunct = require('../../dist/util/createCampaign.js').createLocations;


describe('CreateCampaign Test', function(){
    campaignDataExample = { campaignName: 'SomeCampaign', startDate: '2012-03-31',
    endDate: '2012-03-32', talkingPoints: 'Talking POINT 1\r\nTALKING POINT 2',
    questionaire: 'Q1\r\nQ2\r\nQ3 Q3PART 2', averageExpectedDuration: '55',
    locations: '123, UMIY=, STATE, ZIPCOPDE1\r\n443, UMIY=, STATE, ZIPCOPDE2\r\n2513, UMIY=, STATE, ZIPCOPDE2\r\n12963, UMIY=, STATE, ZIPCOPDE3\r\n',
    canvassers: '12 21 42 41 21' }
    it('CreateCampaign campaignName matches Input', function(done){
        let createdCampaign = createCampaignFunct(campaignDataExample);
        assert.equal(createdCampaign.campaignName, campaignDataExample["SomeCampaign"]);
        done();
    });
    it('CreateCampaign Start Date matches', function(done){
        let createdCampaign = createCampaignFunct(campaignDataExample);
        assert.equal(createdCampaign.startDate, campaignDataExample["startDate"]);
        done();
    });
    let createdCampaign = createCampaignFunct(campaignDataExample);
    it('CreateCampaign End Date matches', function(){
        assert.equal(createdCampaign.endDate, campaignDataExample["endDate"]);
    });
    it('CreateCampaign Average Duration matches', function(){
        assert.equal(createdCampaign.avgDuration, campaignDataExample["averageExpectedDuration"]);
    });

});