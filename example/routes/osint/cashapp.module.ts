import { Request, Response } from 'express';
import axios from 'axios';

export async function resolveCashAppName(req: Request, res: Response): Promise<Response> {
    const username = req.body?.username || req.query?.username;
    const response = await axios.get(`https://cash.app/$${username}`);

    if (response.status !== 200) {
        return res.status(400).json({
            status: 'failed',
            message: 'No user found!',
        });
    }

    return res.status(200).json({
        status: 'success',
        data: {
            name: response.data.split('display_name":"')[1].split('"')[0].replace('"', ''),
        },
    });
}
