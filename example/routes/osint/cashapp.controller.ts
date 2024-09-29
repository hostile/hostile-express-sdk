import { Method, Route, Parameter } from '../../../lib';

import { resolveCashAppName } from './cashapp.module';

const sandboxData = {
    status: 200,
    data: {
        status: 'success',
        data: {
            name: 'John Smith',
        },
    },
};

export const cashAppGet = new Route(Method.GET, '/cashapp')
    .setParameters([new Parameter<string>().setName('username')])
    .setSandboxData(sandboxData)
    .setHandler(resolveCashAppName)
    .setPermissions(['hostile:cashapp']);

export const cashAppPost = new Route(Method.POST, '/cashapp')
    .setPostBodyFields([new Parameter<string>().setName('username')])
    .setSandboxData(sandboxData)
    .setHandler(resolveCashAppName);
