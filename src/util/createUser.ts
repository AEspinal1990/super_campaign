import { CampaignManager }      from '../backend/entity/CampaignManager';
import { Canvasser }      from '../backend/entity/Canvasser'; 
import { SystemAdmin }      from '../backend/entity/SystemAdmin'; 
import { User } from '../backend/entity/User';

export const createBaseUser = userData => {
    //console.log(userData);
    const newUser: User = new User();
    newUser.name = userData.name;
    newUser.username = userData.username;
    newUser.password = userData.password;
    newUser.permission = parseInt(userData.role);
    return newUser;
};

export const createRoledUser = (roleNumber,user): CampaignManager | Canvasser | SystemAdmin => {
    let roledUser: CampaignManager | Canvasser | SystemAdmin;
    
    if(roleNumber === 1){
        roledUser = new CampaignManager();
    } 
    else if (roleNumber === 2) {
        roledUser = new Canvasser();
    } 
    else {
        roledUser = new SystemAdmin();
    }

    roledUser.ID = user;

    return roledUser
};

