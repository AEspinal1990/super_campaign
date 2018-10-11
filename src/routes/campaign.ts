import { Request, Response } from 'express';
import { request } from 'http';
import { Resolver } from 'dns';

export const createCampaign = (req: Request, res: Response) => {
    res.render('test');
}