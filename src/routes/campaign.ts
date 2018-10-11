import { Request, Response } from 'express';
import { request } from 'http';
import { Resolver } from 'dns';
import { Any } from 'typeorm';

export const createCampaignGET = (req: Request, res: Response) => {
    res.render('test');
}

export const createCampaignPOST = (req: Request, res: Response) => {
    // console.log(req.body.campaign);
    let campaignName = req.body.campaign.name;
    console.log(campaignName);
    res.status(200).send('Done');
}