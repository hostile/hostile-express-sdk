import * as AWS from 'aws-sdk';

const cloudLogs = new AWS.CloudWatchLogs();

export async function submitEvent(
    groupName: string,
    streamName: string,
    message: string
): Promise<void> {
    await cloudLogs
        .putLogEvents({
            logGroupName: groupName,
            logStreamName: streamName,
            logEvents: [
                {
                    message: message,
                    timestamp: Date.now(),
                },
            ],
        })
        .promise();
}

export async function createLogGroupIfNotExists(
    groupName: string,
    streamName: string
): Promise<void> {
    const logGroups = await cloudLogs
        .describeLogGroups({
            logGroupNamePrefix: groupName,
        })
        .promise();

    const groupExists = logGroups.logGroups.some(
        (group) => group.logGroupName === groupName
    );

    if (!groupExists) {
        await cloudLogs.createLogGroup({
            logGroupName: groupName,
        });
    }

    const logStreams = await cloudLogs
        .describeLogStreams({
            logGroupName: groupName,
            logStreamNamePrefix: streamName,
        })
        .promise();

    const logStreamExists = logStreams.logStreams.some(
        (stream) => stream.logStreamName === streamName
    );

    if (logStreamExists) {
        await cloudLogs.createLogStream({
            logGroupName: groupName,
            logStreamName: streamName,
        });
    }
}
