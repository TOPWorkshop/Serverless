import Configuration from './models/configuration';
import { generatePolicy } from './utils/aws';
import { debugToken } from './utils/facebook';
import log from './utils/log';

const userIdKey = 'fbUserId';

export async function facebook(event, context, callback) {
  const token = event.authorizationToken;
  const method = event.methodArn;

  const bearerMatch = token.match(/Bearer (.*)/);

  try {
    if (bearerMatch) {
      const myUserId = await Configuration.getValue(userIdKey);

      const accessToken = bearerMatch[1];
      const { user_id, is_valid } = await debugToken(accessToken);

      const canAccess = is_valid && user_id === myUserId;

      if (!canAccess) {
        log.error('authorizer', 'Someone is trying to access private endpoints without a valid token', {
          method,
          token,
          facebookUserId: user_id,
        });
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
