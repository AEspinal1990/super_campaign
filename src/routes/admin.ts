import { Request, Response } from 'express';
import { Repository } from 'typeorm';

// This is just a test. Home should be what page? Under
export const home = (req: Request, res: Response) => {
    res.send('Hello!');
};