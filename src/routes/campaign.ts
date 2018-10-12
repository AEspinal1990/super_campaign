import { Request, Response } from 'express';
import { request } from 'http';
import { Resolver } from 'dns';
import { Any } from 'typeorm';

export const createCampaignPage = (req: Request, res: Response) => {
    res.render('create-campaign');
}

export const createCampaign = (req: Request, res: Response) => {
    // console.log(req.body.campaign);
    let campaignName = req.body.campaign.name;
    console.log(campaignName);
    res.status(200).send('Done');
}