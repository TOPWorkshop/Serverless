import axios from 'axios';

import Configuration from '../models/configuration';

const version = 'v2.11';
const baseUrl = `https://graph.facebook.com/${version}`;

async function getAccessToken() {
  const keyClientId = 'fbAppId';
  const keyClientSecret = 'fbAppSecret';

  const [client_id, client_secret] = await Promise.all([
    Configuration.getValue(keyClientId),
    Configuration.getValue(keyClientSecret),
  ]);

  const { data: { access_token, token_type } } = await axios.get(`${baseUrl}/oauth/access_token`, {
    params: {
      client_id,
      client_secret,
      grant_type: 'client_credentials',
    },
  });

  return { access_token, token_type };
}

async function getAuthorization() {
  const { access_token, token_type } = await getAccessToken();

  return `${token_type.charAt(0).toUpperCase()}${token_type.slice(1)} ${access_token}`;
}

export async function debugToken(input_token) {
  const { access_token } = await getAccessToken();

  const { data: { data } } = await axios.get(`${baseUrl}/debug_token`, {
    params: {
      input_token,
      access_token,
    },
  });

  console.log(data);

  return data;
}

export async function getEventAttending(eventId, limit = 5000) {
  const authorization = await getAuthorization();

  const { data: { data: users } } = await axios.get(`${baseUrl}/${eventId}/attending`, {
    params: { limit },
    headers: { Authorization: authorization },
  });

  return users;
}
