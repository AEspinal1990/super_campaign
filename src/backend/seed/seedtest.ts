import "reflect-metadata";
import {createConnection} from "typeorm";
import { User } from "../entity/User";
import { Canvasser } from "../entity/Canvasser";
import { Campaign } from "../entity/Campaign";
import { CampaignManager } from "../entity/CampaignManager";
import { Assignment } from "../entity/Assignment";
import { Task } from "../entity/Task";
import { RemainingLocation } from "../entity/RemainingLocation";
import { Locations } from "../entity/Locations";
import { CompletedLocation } from "../entity/CompletedLocation";
import { Results } from "../entity/Results";
import { Questionaire } from "../entity/Questionaire";
import { TalkPoint } from "../entity/TalkPoint";
import { Availability } from "../entity/Availability";
import { AssignedDate } from "../entity/AssignedDate";

createConnection().then(async connection => {

    console.log("Inserting a new instance into all tables of DB.");
    // USER 1
    const user1 = new User();
    user1.username = "user1";
    user1.permission = 1;
    user1.name = "John Smith";
    await connection.manager.save(user1);
    // USER 2
    const user2 = new User();
    user2.username = "user2";
    user2.permission = 2;
    user2.name = "Jane Smith";
    await connection.manager.save(user2);
    // CM 1
    const cm1:CampaignManager = new CampaignManager();
    cm1.ID = user1;
    await connection.manager.save(cm1);
    console.log("==========Before canvasser==========");
    // CANVASSER 1
    const canvasser1 = new Canvasser();
    canvasser1.ID = user1;
    canvasser1.datesAssigned = [new Date()];
    canvasser1.datesAvailable = [new Date()];
    // AVAILABILITY 1
    const av1 = new Availability();
    av1.availableDate = new Date();
    av1.canvasserID = canvasser1;
    await connection.manager.save(av1);
    // ASSIGNEDDATE 1
    const ad1 = new AssignedDate();
    ad1.assignedDate = new Date();
    ad1.canvasserID = canvasser1;
    await connection.manager.save(ad1);
    await connection.manager.save(canvasser1);
    // LOCATIONS !
    const location1 = new Locations();
    location1.streetNumber = 1;
    location1.street = "Street";
    location1.city = "City";
    location1.state = "NY";
    location1.zipcode = 11357;
    await connection.manager.save(location1);
    // LOCATIONS 2
    const location2 = new Locations();
    location2.streetNumber = 2;
    location2.street = "Street";
    location2.city = "City";
    location2.state = "NY";
    location2.zipcode = 11357;
    await connection.manager.save(location2);
    console.log("Before Result Save============");
    // RESULT 1
    const result1 = new Results();
    result1.location = location2;
    // result1.canvasserID = canvasser1;
    result1.answer = true;
    result1.answerNumber = 1;
    result1.rating = 5;
    console.log("Before Campaign save========");
    // CAMPAIGN 1
    const campaign1:Campaign = new Campaign();
    campaign1.name = "campaign1";
    campaign1.manager = [cm1];
    campaign1.canvasser = [canvasser1];
    campaign1.startDate = new Date();
    campaign1.endDate = new Date();
    campaign1.avgDuration = 1;
    campaign1.locations = [location1, location2];
    await connection.manager.save(campaign1);
    console.log("After campaign save\n");
    // TASK 1
    const task1 = new Task();
    task1.canvasserID = canvasser1;
    task1.currentLocation = location1.ID;
    task1.scheduledOn = new Date();
    task1.status = false;
    task1.remainingLocations = null;
    console.log("Before Task Save========");
    task1.campaignID = campaign1.ID;
    // task1.assignment = assignment1;
    await connection.manager.save(task1);
    console.log("After Task Save=================");
    console.log("Before RemainingLocation ======");
    // REMAININGLOCATION 1
    const RL1 = new RemainingLocation();
    RL1.locationID = [location1];
    RL1.task = task1;
    await connection.manager.save(RL1);
    console.log("Before CompletedLocation =======");
    // COMPLETEDLOCATION 1
    const CL1 = new CompletedLocation();
    CL1.locationID = [location2];
    CL1.task = task1;
    await connection.manager.save(CL1);
    result1.completedLocation = CL1;
    await connection.manager.save(result1);
    // task1.remainingLocations = RL1;
    // task1.completedLocations = CL1;
    // ASSIGNMENT 1
    // const assignment1 = new Assignment();
    // assignment1.taskID = [task1];
    // assignment1.campaignID = campaign1;
    // console.log("Before Assignment Save======");
    // await connection.manager.save(assignment1);
    // console.log ("After Assignment Save ======");
    // // QUESTIONAIRE 1
    // const qt1 = new Questionaire();
    // qt1.question = "Question1";
    // // QUESITONAIRE 2
    // const qt2 = new Questionaire();
    // qt2.question = "Question2";
    // qt1.campaignID = campaign1;
    // await connection.manager.save(qt1);
    // qt2.campaignID = campaign1;
    // await connection.manager.save(qt2);
    // cm1.campaignID = [campaign1];
    // await connection.manager.save(cm1);
    // // TALKINGPOINT 1
    // const tp1 = new TalkPoint();
    // tp1.campaignID = campaign1;
    // tp1.talk = "Talk1";
    // await connection.manager.save(tp1);
    // // TALKPINGOINT 2
    // const tp2 = new TalkPoint();
    // tp2.campaignID = campaign1;
    // tp2.talk = "Talk2";
    // await connection.manager.save(tp2);

    console.log("End of Seed");
}).catch(error => console.log(error));

