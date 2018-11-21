import { getManager }                   from 'typeorm';
import { Campaign }                     from '../backend/entity/Campaign';
import { Results }                      from '../backend/entity/Results';
import { Questionaire }                 from '../backend/entity/Questionaire';


export async function getRatingStatistics(req) {
    const math = require('mathjs');

    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id }});
    var question = await getManager().find(Questionaire,
        { where: { "_campaign": campaign } });        
    var resul = await getManager().find(Results,
        {
            where: { "_campaign": campaign },
            relations: ["_completedLocation", "_completedLocation._locations"]
        });
    campaign.results = resul;

    var completedResults = campaign.getLocationsResults();

    var allRatings = [];

    for (let i in completedResults) {
        allRatings.push(completedResults[i].rating);
    }

    return {average: math.mean(allRatings), std: math.std(allRatings)};
}

export async function getQuestionStatistics(req) {
    const math = require('mathjs');

    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id }});
    var question = await getManager().find(Questionaire,
        { where: { "_campaign": campaign } });        
    var resul = await getManager().find(Results,
        {
            where: { "_campaign": campaign },
            relations: ["_completedLocation", "_completedLocation._locations"]
        });
    campaign.results = resul;

    var completedResults = campaign.getLocationsResults();


    var questionaireResults = [];
    for (let questionNum in question) {
        var questionStats = {question: question[questionNum].question, true: 0, false: 0, percentYes: 0, percentNo: 0};
        for (let resultNum in completedResults) {
            if(completedResults[resultNum].results[questionNum].result == true) {
                questionStats.true = questionStats.true + 1;
            } 
            else if(completedResults[resultNum].results[questionNum].result == false) {
                questionStats.false = questionStats.false + 1;
            }
        }
        questionStats.percentYes = questionStats.true / (questionStats.true + questionStats.false) * 100;
        questionStats.percentNo = questionStats.false / (questionStats.true + questionStats.false) * 100;
        questionaireResults.push(questionStats);
    }
    return questionaireResults;
}
