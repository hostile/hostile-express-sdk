import { Request, Response, NextFunction } from 'express';
import Permissions from '../types/Permissions';

const jwt = require('jsonwebtoken');

class PermissionMiddleware {
    private permissions: Permissions;

    constructor(permissions: Permissions) {
        this.permissions = permissions;
    }

    private async hasRequiredClaims(
        userClaims: string[],
        requiredClaims: Permissions
    ): Promise<boolean> {
        return requiredClaims.some((requiredClaim) => {
            return (
                userClaims.includes(requiredClaim) ||
                userClaims.some(
                    (userClaim) => userClaim.startsWith(requiredClaim.split(':')[0] + ':*') // Check for wildcard claims
                )
            );
        });
    }

    private async decodeJWT(req: Request, res: Response): Promise<string[]> {
        const bearer: string = req.headers.authorization;

        if (!bearer) {
            res.status(403).send({ status: 'error', message: 'error.NotAuthenticated' });
            return;
        }

        const decoded = jwt.decode(bearer.split(' ')[1]);
        const claims = decoded.permissionNodes;
        return claims;
    }

    public async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        // Decodes JWT to access permissionNodes
        const claims = await this.decodeJWT(req, res);

        if (claims && !(await this.hasRequiredClaims(claims, this.permissions))) {
            res.status(403).send({ status: 'error', message: 'error.NotAuthenticated' });
            return;
        }

        next();
    }
}

export default PermissionMiddleware;
