import { generatePolicy } from './utils/aws';
import { debugToken } from './utils/facebook';

export async function facebook(event, context, callback) {
  const token = event.authorizationToken;
  const method = event.methodArn;

  const bearerMatch = token.match(/Bearer (.*)/);

  if (bearerMatch) {
    const accessToken = bearerMatch[1];
    const { user_id, is_valid } = await debugToken(accessToken);

    callback(null, generatePolicy('user', is_valid && user_id === '10155151351877452' ? 'Allow' : 'Deny', method));

    return;
  }

  callback(null, generatePolicy('user', 'Deny', method));
}
