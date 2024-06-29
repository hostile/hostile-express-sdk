import { RouteGroup } from '../../../lib';
import { cashAppGet, cashAppPost } from './cashapp.controller';

const routeGroup = new RouteGroup('/osint');

routeGroup.addRoute(cashAppGet);
routeGroup.addRoute(cashAppPost);

export { routeGroup };
