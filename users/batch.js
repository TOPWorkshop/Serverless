import AWS from 'aws-sdk';
import axios from 'axios';

const TABLE_USERS = process.env.TABLE_USERS;
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  params: {
    TableName: TABLE_USERS,
  },
});

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

    await Promise.all(users.map(user => dynamoDb.putItem({
      Item: {
        userId: {
          S: user.id,
        },
        name: {
          S: user.name,
        },
      },
    }).promise()));

    callback();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      const message = error.response.data.error.message;

      callback(message);

      return;
    }

    console.error(error);

    callback(error);
  }
}
