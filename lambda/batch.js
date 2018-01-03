import axios from 'axios';

import User, { fields as userFields } from './models/users';
import Configuration, { fields as configurationFields } from './models/configuration';

export async function scrape(event, context, callback) {
  const baseUrl = 'https://graph.facebook.com/v2.11';
  const eventId = '1804514646517478';

  try {
    const [configItemAppId, configItemAppSecret] = await Promise.all([
      Configuration.get({ [configurationFields.key]: 'fbAppId'}),
      Configuration.get({ [configurationFields.key]: 'fbAppSecret'}),
    ]);

    if (!configItemAppId || !configItemAppSecret) {
      throw new Error('No AppId or AppSecret set');
    }

    const configAppId = configItemAppId[configurationFields.value];
    const configAppSecret = configItemAppSecret[configurationFields.value];

    const { data: { access_token, token_type } } = await axios.get(`${baseUrl}/oauth/access_token`, {
      params: {
        client_id: configAppId,
        client_secret: configAppSecret,
        grant_type: 'client_credentials',
      },
    });

    const { data: { data: users } } = await axios.get(`${baseUrl}/${eventId}/attending`, {
      params: {
        limit: 5000,
      },
      headers: {
        Authorization: `${token_type.charAt(0).toUpperCase()}${token_type.slice(1)} ${access_token}`,
      },
    });

    await Promise.all(users.map(user => User.update({
      [userFields.userId]: user.id,
      [userFields.name]: user.name,
    })));

    callback();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      let message = error.response.data.error.message;

      if (message.match(/Error validating access token/)) {
        message = 'Facebook token expired! Please login again';
      }

      callback(message);

      return;
    }

    console.error(error);

    callback(error);
  }
}
