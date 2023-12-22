import { v4 } from 'uuid';

import { Request, Response } from 'express';

export function generateXsrfToken(): string {
    return v4();
}

export async function validateRequest(
    req: Request,
    res: Response,
    expectedHeader?: string,
    expectedCookie?: string
): Promise<boolean> {
    if (expectedCookie && !req.cookies[expectedCookie]) {
        return false;
    }

    if (expectedHeader && !req.headers[expectedHeader]) {
        return false;
    }

    return !(
        expectedHeader &&
        expectedCookie &&
        req.headers[expectedHeader] != req.cookies[expectedCookie]
    );
}
