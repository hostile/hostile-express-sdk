declare module 'express-serve-static-core' {
    export interface Request {
        queryParams?: NodeJS.Dict<any>;
        postBody?: NodeJS.Dict<any>;
    }
}
