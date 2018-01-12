import zlib from 'zlib';
import axios from 'axios';
import { SNS } from 'aws-sdk';

import Configuration from './models/configuration';

const logdnaTokenKey = 'logdnaToken';

function mapEvent(logEvent, logGroup) {
  const { timestamp, message } = logEvent;

  const resultLogEvent = { timestamp };

  let match;

  match = logGroup.match(/^\/aws\/lambda\/(.+)$/);
  if (match) {
    resultLogEvent.lambdaFunction = match[1];
  } else {
    resultLogEvent.logGroup = logGroup;
  }

  match = message.match(/^START RequestId: (.+) Version: (.+)\n$/);
  if (match) {
    return {
      ...resultLogEvent,
      type: 'start',
      requestId: match[1],
      version: match[2],
      level: 'verbose',
      message: `START`,
    };
  }

  match = message.match(/^END RequestId: (.+)\n$/);
  if (match) {
    return {
      ...resultLogEvent,
      type: 'end',
      requestId: match[1],
      level: 'verbose',
      message: `END`,
    };
  }

  match = message.match(/^REPORT RequestId: (.+)\tDuration: (.+) ms\tBilled Duration: (.+) ms \tMemory Size: (.+) MB\tMax Memory Used: (.+) MB\t\n$/);
  if (match) {
    return {
      ...resultLogEvent,
      type: 'report',
      requestId: match[1],
      duration: match[2],
      billedDuration: match[3],
      memorySize: match[4],
      maxMemoryUsed: match[5],
      level: 'verbose',
      message: `REPORT`,
    };
  }

  match = message.match(/^(.+)\t(.+)\t(.+)\n$/);
  if (match) {
    let messageObj;

    try {
      messageObj = JSON.parse(match[3]);
    } catch (error) {
      messageObj = {
        level: 'info',
        levelIndex: 3,
        logger: 'default',
        message: match[3],
      };
    }

    return {
      ...resultLogEvent,
      type: 'message',
      requestId: match[2],
      ...messageObj,
    };
  }

  return resultLogEvent;
}

async function archiveLogEvents(logEvents) {
  const lines = logEvents.map(logEvent => ({
    timestamp: logEvent.timestamp,
    line: logEvent.message,
    app: logEvent.requestId,
    level: logEvent.level && logEvent.level.toUpperCase(),
    meta: Object.assign({}, logEvent, {
      timestamp: undefined,
      lambdaFunction: undefined,
      logGroup: undefined,
      level: undefined,
      requestId: undefined,
    }),
  }));

  if (!lines) {
    return;
  }

  const logdnaToken = await Configuration.getValue(logdnaTokenKey);

  await axios.post('https://logs.logdna.com/logs/ingest', { lines }, {
    params: {
      hostname: logEvents[0].lambdaFunction || logEvents[0].logGroup,
      now: Date.now(),
    },

    auth: {
      username: logdnaToken,
    },
  });
}

async function handleLogEvent(logEvent) {
  let telegramMessage;

  if (
    (logEvent.type === 'message' && logEvent.level === 'error')
    ||
    (logEvent.logger === 'scrape' && logEvent.levelIndex < 3)
  ) {
    telegramMessage = `${logEvent.level.toUpperCase()} [${logEvent.logger}] - ${logEvent.message}`
  }

  if (logEvent.type === 'report' && parseInt(logEvent.duration, 10) > 2000) {
    telegramMessage = `ERROR [lambda-duration] function ${logEvent.lambdaFunction} took too long: ${logEvent.duration} ms`;
  }

  if (telegramMessage) {
    console.log('TELEGRAM', telegramMessage);

    const sns = new SNS();
    const snsErrorTopicArn = process.env.SNS_ERRORS;

    await sns.publish({
      Message: telegramMessage,
      TopicArn: snsErrorTopicArn,
    }).promise();
  }
}

export async function handle(event, context, callback) {
  const payload = Buffer.from(event.awslogs.data, 'base64');

  try {
    const result = zlib.gunzipSync(payload);

    const data = JSON.parse(result.toString('utf8'));

    const { logGroup, logEvents } = data;

    const events = logEvents
      .map(logEvent => mapEvent(logEvent, logGroup))
      .filter(logEvent => !!logEvent.type);

    await archiveLogEvents(events);

    await Promise.all(events.map(logEvent => handleLogEvent(logEvent)));

    callback();
  } catch (error) {
    callback(error);
  }
}
