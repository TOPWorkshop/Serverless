import axios from 'axios';

import Configuration from '../models/configuration';

const version = 'v2.11';
const baseUrl = `https://graph.facebook.com/${version}`;

async function getAccessToken() {
  const keyClientId = 'fbAppId';
  const keyClientSecret = 'fbAppSecret';

  const [clientId, clientSecret] = await Promise.all([
    Configuration.getValue(keyClientId),
    Configuration.getValue(keyClientSecret),
  ]);

  const {
    data: {
      access_token: accessToken,
      token_type: tokenType,
    },
  } = await axios.get(`${baseUrl}/oauth/access_token`, {
    params: {
      clientId,
      clientSecret,
      grant_type: 'client_credentials',
    },
  });

  return { accessToken, tokenType };
}

async function getAuthorization() {
  const { accessToken, tokenType } = await getAccessToken();

  return `${tokenType.charAt(0).toUpperCase()}${tokenType.slice(1)} ${accessToken}`;
}

export async function debugToken(inputToken) {
  const { accessToken } = await getAccessToken();

  const { data: { data } } = await axios.get(`${baseUrl}/debug_token`, {
    params: {
      input_token: inputToken,
      access_token: accessToken,
    },
  });

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
