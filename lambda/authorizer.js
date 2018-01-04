import { SNS } from 'aws-sdk';

import { generatePolicy } from './utils/aws';
import { debugToken } from './utils/facebook';

export async function facebook(event, context, callback) {
  const token = event.authorizationToken;
  const method = event.methodArn;

  const bearerMatch = token.match(/Bearer (.*)/);

  try {
    if (bearerMatch) {
      const accessToken = bearerMatch[1];
      const { user_id, is_valid } = await debugToken(accessToken);

      const canAccess = is_valid && user_id === '10155151351877452';

      if (!canAccess) {
        const sns = new SNS();
        const snsErrorTopicArn = process.env.SNS_ERRORS;

        await sns.publish({
          Message: 'Someone is trying to access private endpoints without a valid token',
          TopicArn: snsErrorTopicArn,
        }).promise();
      }

      callback(null, generatePolicy('user', canAccess ? 'Allow' : 'Deny', method));

      return;
    }

    callback(null, generatePolicy('user', 'Deny', method));
  } catch (error) {
    console.error(error);

    callback(null, generatePolicy('user', 'Deny', method));
  }

}
