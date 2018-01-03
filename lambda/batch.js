import axios from 'axios';
import User, { fields } from './models/users';

export async function scrape(event, context, callback) {
  const baseUrl = 'https://graph.facebook.com/v2.11';
  const eventId = '1804514646517478';

  const configEndpoint = 'https://mhwx6ohouj.execute-api.eu-west-1.amazonaws.com/dev/config';
  const configKey = 'fbUserToken';

  try {
    const { data: access_token } = await axios.get(`${configEndpoint}/${configKey}`);

    const { data: { data: users } } = await axios.get(`${baseUrl}/${eventId}/attending`, {
      params: {
        limit: 5000,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    await Promise.all(users.map(user => User.update({
      [fields.userId]: user.id,
      [fields.name]: user.name,
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
