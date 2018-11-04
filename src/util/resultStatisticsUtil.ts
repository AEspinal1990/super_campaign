import { Request, Response, Router }    from 'express';
import { getManager }                   from 'typeorm';
import { Campaign }                     from '../backend/entity/Campaign';
import { Assignment }                   from '../backend/entity/Assignment';
import { Results }                      from '../backend/entity/Results';
import { CompletedLocation }            from '../backend/entity/CompletedLocation';
import { Questionaire }                 from '../backend/entity/Questionaire';
import { RemainingLocation }            from '../backend/entity/RemainingLocation';
import { Task }                         from '../backend/entity/Task';


export async function getStatistics(req) {
    const math = require('mathjs');

    var campaign = await getManager().findOne(Campaign,
        { where: { "_ID": req.params.id }});
    var resul = await getManager().find(Results,
        {
            where: { "_campaign": campaign },
            relations: ["_completedLocation", "_completedLocation._locations"]
        });
    campaign.results = resul;

    var completedResults = campaign.getLocationsResults();

    var allRatings = [];

    for (let i in completedResults) {
        console.log(completedResults[i].rating);
    }
}
