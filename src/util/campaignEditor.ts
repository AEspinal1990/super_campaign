import { getManager, getRepository } from "typeorm";
import { Campaign } from "../backend/entity/Campaign";
import { TalkPoint } from "../backend/entity/TalkPoint";
import { Questionaire } from "../backend/entity/Questionaire";
import { Locations } from "../backend/entity/Locations";
import { CampaignManager } from "../backend/entity/CampaignManager";
import { User } from "../backend/entity/User";
import { Canvasser } from "../backend/entity/Canvasser";
import * as campaignParser      from './campaignParser';

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAkzTbqwM75PSyw0vwMqiVb9eP6NjnClFk'
});

export const getTalkingPoints = async  (campaign, talkingPoints) => {
    return campaignParser.getTalkingPoints(campaign, talkingPoints);
}

//This part is for the posting the form for editing campaign with the new camaignData
export const editCampaign = async (campaignData, campaignID) => {
    const Manager = getManager();

    //ASSIGN campaignData to variables
    let campaignName = campaignData.campaignName;
    let campaignManager = campaignData.managers;
    let startDate = campaignData.startDate;
    let endDate = campaignData.endDate;
    let talkingPoints = campaignData.talkingPoints;
    let questionaire = campaignData.questionaire;
    let averageExpectedDuration = campaignData.averageExpectedDuration;
    let locations = campaignData.locations;
    let canvasser = campaignData.canvassers;

    //retrieve the campaign object being updated
    const campaignRepo = Manager.getRepository(Campaign);
    var thisCampaign = await campaignRepo
        .find({ where: { "_ID": campaignID } })
        .catch(e => console.log(e));

    ///////////////////////////////////
    //PARSE THE DATA
    ///////////////////////////////////

    //Update Camapaign Object
    //Parse date from format YYYY-MM-DD
    startDate = startDate.split("-");
    startDate = new Date(startDate[0], startDate[1]-1, startDate[2]);
    endDate = endDate.split("-");
    endDate = new Date(endDate[0], endDate[1]-1, endDate[2]);
    //Update date to Campaign object
    thisCampaign[0].name = campaignName;
    thisCampaign[0].startDate = startDate;
    thisCampaign[0].endDate = endDate;
    thisCampaign[0].avgDuration = averageExpectedDuration;

    await Manager.save(thisCampaign).catch(e => console.log(e));
    //Update Talking Points
    const talkPointRepo = getRepository(TalkPoint);
    //delete talking Points
    await talkPointRepo
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaignID })
        .execute();
    //Create
    talkingPoints = talkingPoints.trim().split("\n");
    for (let i in talkingPoints) {
        let newTalkingPoint: TalkPoint = new TalkPoint();
        newTalkingPoint.campaign = thisCampaign[0];
        newTalkingPoint.talk = talkingPoints[i].replace('\r','');
        await Manager.save(newTalkingPoint).catch(e => console.log(e));
    }
    //Update Questionaire 
    const questionaireRepo = getRepository(Questionaire);
    //delete campaign questionaires
    await questionaireRepo
        .createQueryBuilder()
        .delete()
        .where("_campaign = :ID", { ID: campaignID })
        .execute();
    //For Questionaire Objects
    //Parse Questionaire for Questionaire table
    questionaire = questionaire.trim().split("\n");
    for (let i in questionaire) {
        let newQuestionaire: Questionaire = new Questionaire();
        newQuestionaire.campaign = thisCampaign[0];
        newQuestionaire.question = questionaire[i].replace('\r','');
        await Manager.save(newQuestionaire).catch(e => console.log(e));
    }

    //Update Canvassers
    canvasser.trim();
    canvasser = canvasser.split("\n");
    for (var i = 0; i < canvasser.length; i++) {
        canvasser[i] = canvasser[i].replace(/\r/, "");
    }
    if (canvasser[canvasser.length-1] == ""){
        canvasser.pop();
    }
    const foundCanvassers = [];
    const usr = await getManager()
        .createQueryBuilder(Canvasser, "canv")
        .leftJoinAndSelect("canv._campaigns", "campaign")
        .leftJoinAndSelect("canv._ID", "user")
        .where("campaign.ID = :ID", { ID: thisCampaign[0].ID })
        .getMany();

    for (var i = 0; i < usr.length; i++) {
        const cvr = await getManager()
            .createQueryBuilder(Canvasser, "canv")
            .leftJoinAndSelect("canv._campaigns", "campaign")
            .leftJoinAndSelect("canv._ID", "user")
            .where("user.employeeID = :ID", { ID: usr[i].ID.employeeID })
            .getOne();
        foundCanvassers.push(cvr);
    };

    var flag = 0;
    for (var i = 0; i < foundCanvassers.length; i++) {
        for (var j = 0; j < foundCanvassers[i].campaigns.length; j++) {
            if (foundCanvassers[i].campaigns[j].ID == thisCampaign[0].ID) {
                // check if the foundCanvasser ID is in canvasser
                if (flag == 1) {
                    foundCanvassers[i].campaigns.splice(j, 1);
                    await getManager().save(foundCanvassers[i]);
                } else {
                    for (var k = 0; k < canvasser.length; k++) {
                        if (foundCanvassers[i].ID.employeeID == canvasser[k]) {
                            // found canvasser, move on
                            canvasser.splice(k, 1);
                            if (canvasser.length == 0) {
                                flag = 1;
                            }
                            break;
                        } else if (k == canvasser.length - 1) {
                            // canvasser was deleted from campaign
                            foundCanvassers[i].campaigns.splice(j, 1);
                            await getManager().save(foundCanvassers[i]);
                        }
                    }
                }
            }
        }
        if (i == foundCanvassers.length - 1) {
            // add campaign to newly added canvassers
            for (var g = 0; g < canvasser.length; g++) {
                const user = await getManager().findOne(User, { where: { "_employeeID": canvasser[g] } });
                const newcanv = await getManager().findOne(Canvasser, { where: { "_ID": user } });
                newcanv.campaigns.push(thisCampaign[0].ID);
                await getManager().save(newcanv);
            }
        }
    }
    //deep copy
    var locationCopy = [];
    while(thisCampaign[0].locations.length > 0){
        locationCopy.push(thisCampaign[0].locations.splice(0,1)[0]);
    }
    //Update Locations
    thisCampaign[0].locations = [];
    //Parse Locations for All Locations of Campaign Table
    locations = locations.split("\n");
    //Initialize array of campaign locations
    for (let i in locations) {
        if (locations[i] != "") {
            //create location object
            let locationParse = locations[i];
            locationParse = locationParse.split(", ");
            let newLocation: Locations = new Locations();
            newLocation.streetNumber = parseInt(locationParse[0]);
            newLocation.street = locationParse[1];
            newLocation.unit = locationParse[2];
            newLocation.city = locationParse[3];
            newLocation.state = locationParse[4];
            newLocation.zipcode = parseInt(locationParse[5]);
            //associate this new location to array
            thisCampaign[0].locations.push(newLocation);
        }
    }
    for (let i in locationCopy) {
        //check to see if the location already exists on database
        for (let j in thisCampaign[0].locations){
            if (locationCopy[i].streetNumber == thisCampaign[0].locations[j].streetNumber &&
                locationCopy[i].street == thisCampaign[0].locations[j].street &&
                locationCopy[i].unit == thisCampaign[0].locations[j].unit &&
                locationCopy[i].city == thisCampaign[0].locations[j].city &&
                locationCopy[i].state == thisCampaign[0].locations[j].state &&
                locationCopy[i].zipcode == thisCampaign[0].locations[j].zipcode){
                    thisCampaign[0].locations[j].ID = locationCopy[i].ID;
                    thisCampaign[0].locations[j].lat = locationCopy[i].lat;
                    thisCampaign[0].locations[j].long = locationCopy[i].long;
                    break;
            }
            if (Number(j) === thisCampaign[0].locations.length-1){
                await getRepository(Locations)
                    .createQueryBuilder()
                    .delete()
                    .where("_ID = :ID", {ID: locationCopy[i].ID})
                    .execute();
            }
        }
    }
    // get new coordinates for new locations
    for (let i in thisCampaign[0].locations){
        if (thisCampaign[0].locations[i].lat === undefined || thisCampaign[0].locations[i].long === undefined){
            thisCampaign[0].locations[i].lat = -1;
            thisCampaign[0].locations[i].long = -1;
            var address =
                thisCampaign[0].locations[i].streetNumber + " " +
                thisCampaign[0].locations[i].street + ", " +
                thisCampaign[0].locations[i].city + ", " +
                thisCampaign[0].locations[i].state + " " +
                thisCampaign[0].locations[i].zipcode;
            await googleMapsClient.geocode({ address: address }, function (err, response) {
                if (!err) {
                    var coord = response.json.results[0].geometry.location;
                } else {
                    console.log("Geocode not found");
                }
                saveLocations(coord);
            });
            function saveLocations(coord) {
                thisCampaign[0].locations[i].lat = Number(coord.lat);
                thisCampaign[0].locations[i].long = Number(coord.lng);
                Manager.save(thisCampaign[0]).catch(e => console.log(e));
            }
        } 
    }
    await Manager.save(thisCampaign[0]).catch(e => console.log(e));

    //Update Managers
    thisCampaign[0].managers = [];
    //Parse manager string
    campaignManager = campaignManager.split("\n");
    //initialize manager
    thisCampaign[0].managers = [];

    for (var i = 0; i < campaignManager.length; i++) {
        if (campaignManager[i] != "") {
            const use = await getManager()
                .findOne(User, { where: { "_employeeID": campaignManager[i] } });
            const cm = await getManager()
                .findOne(CampaignManager, { where: { "_ID": use } });
            thisCampaign[0].managers.push(cm);
        }
    }
    await Manager.save(thisCampaign[0]);
}