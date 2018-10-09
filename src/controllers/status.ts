import { Request, Response } from 'express';

export let hi = (req: Request, res: Response) => {
    res.send('Hello');
}
