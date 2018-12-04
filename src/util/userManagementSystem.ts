import { getRepository } from "typeorm";
import { CampaignManager } from '../backend/entity/CampaignManager';
import { Canvasser } from '../backend/entity/Canvasser';
import { SystemAdmin } from '../backend/entity/SystemAdmin';
import { User } from '../backend/entity/User';

export const createBaseUser = userData => {
    const newUser: User = new User();
    newUser.name = userData.name;
    newUser.username = userData.username;
    newUser.password = userData.password;
    newUser.permission = parseInt(userData.role);
    return newUser;
};

export const createRoledUser = (roleNumber, user): CampaignManager | Canvasser | SystemAdmin => {
    let roledUser: CampaignManager | Canvasser | SystemAdmin;

    if (roleNumber == 1) {
        roledUser = new CampaignManager();
    }
    else if (roleNumber == 2) {
        roledUser = new Canvasser();
    }
    else {
        roledUser = new SystemAdmin();
    }

    roledUser.ID = user;
    return roledUser
};

export const getRepo = roleNumber => {
    let repo;
    if (roleNumber === 1) {
        repo = getRepository(CampaignManager);
    }
    else if (roleNumber === 2) {
        repo = getRepository(Canvasser);
    }
    else {
        repo = getRepository(SystemAdmin);
    }

    return repo;
}

export const deleteUserFromRole = async (roleNumber, id) => {

    if (roleNumber === 1) {
        await getRepository(CampaignManager)
            .query(`DELETE FROM Manager WHERE ID_employeeID = ${id}`);
    }
    else if (roleNumber === 2) {
        await getRepository(Canvasser)
            .query(`DELETE FROM canvasser WHERE ID_employeeID = ${id}`);
    }
    else {
        await getRepository(SystemAdmin)
            .query(`DELETE FROM system_admin WHERE ID_employeeID = ${id}`);
    }
}
