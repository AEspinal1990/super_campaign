import { Request, Response, Router }    from 'express';
import { getManager, getRepository }     from "typeorm";

import { Canvasser }      from '../backend/entity/Canvasser'; 

const router: Router = Router();

/**
 * GET and POST for Edit Availability
 */
router.get('/:id/availability', async(req: Request, res: Response) => {
    const canva = await getManager()
    .createQueryBuilder(Canvasser, "canvasser")
    .leftJoinAndSelect("canvasser._campaignID", "campaign")
    .leftJoinAndSelect("canvasser._ID", "user")
    .where("campaign._ID = :ID", { ID: req.params.id})
    .getMany();
});

export {router as canvasserRouter}