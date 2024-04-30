import { Request, Response } from 'express';

export const googleAuthHandler = (req: Request, res: Response) => {
    // redirect to the dashboard
    res.redirect('/dashboard');
};