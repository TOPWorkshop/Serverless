import { DynamoDB } from 'aws-sdk';

const TABLE_USERS = process.env.TABLE_USERS;
const dynamoDb = new DynamoDB({
  params: {
    TableName: TABLE_USERS,
  },
});

function createSuccessMessage(body) {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
}

function createErrorMessage(error) {
  return {
    statusCode: error.statusCode || 500,
    body: JSON.stringify(error),
  };
}

export function list(event, context, callback) {
  dynamoDb.scan().promise()
    .then(result => callback(null, createSuccessMessage(result.Items)))
    .catch(error => callback(null, createErrorMessage(error)));
}

export function vote(event, context, callback) {
  const { userId } = event.pathParameters;

  dynamoDb.updateItem({
    Key: {
      userId: {
        S: userId,
      },
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'SET #V = if_not_exists(#V, :no_votes) + :increment',
    ExpressionAttributeNames: {
      '#V': 'votes',
    },
    ExpressionAttributeValues: {
      ':increment': {
        N: '1',
      },
      ':no_votes': {
        N: '0',
      },
    },
  }).promise()
    .then(result => callback(null, createSuccessMessage(result)))
    .catch(error => callback(null, createErrorMessage(error)));
}
