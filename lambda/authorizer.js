import Configuration from './models/configuration';
import { generatePolicy } from './utils/aws';
import { debugToken } from './utils/facebook';
import log from './utils/log';

const userIdKey = 'fbUserId';

// eslint-disable-next-line import/prefer-default-export
export async function facebook(event, context, callback) {
  const token = event.authorizationToken;
  const method = event.methodArn;

  const bearerMatch = token.match(/Bearer (.*)/);

  try {
    if (bearerMatch) {
      const myUserId = await Configuration.getValue(userIdKey);

      const accessToken = bearerMatch[1];
      const {
        user_id: userId,
        is_valid: isValid,
      } = await debugToken(accessToken);

      const canAccess = isValid && userId === myUserId;

      if (!canAccess) {
        log.error('authorizer', 'Someone is trying to access private endpoints without a valid token', {
          method,
          token,
          facebookUserId: userId,
        });
      }

      callback(null, generatePolicy('user', canAccess ? 'Allow' : 'Deny', method));

      return;
    }

    callback(null, generatePolicy('user', 'Deny', method));
  } catch (error) {
    log.error('authorizer', error);

    callback(null, generatePolicy('user', 'Deny', method));
  }
}
