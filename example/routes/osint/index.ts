import { RouteGroup } from '../../../lib';
import { cashAppGet, cashAppPost } from './cashapp.controller';

export const OsintRouteGroup = new RouteGroup('/osint');

OsintRouteGroup.addRoute(cashAppGet);
OsintRouteGroup.addRoute(cashAppPost);
