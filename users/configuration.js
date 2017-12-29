import { DynamoDB } from 'aws-sdk';

import { createSuccessMessage, createErrorMessage } from './utils';

const TABLE_CONFIGURATION = process.env.TABLE_CONFIGURATION;
const dynamoDb = new DynamoDB({
  params: {
    TableName: TABLE_CONFIGURATION,
  },
});

export function get(event, context, callback) {
  const { configKey } = event.pathParameters;

  dynamoDb
    .getItem({
      Key: {
        key: {
          S: configKey,
        },
      },
    })
    .promise()
    .then((configValue) => {
      if (configValue.Item) {
        const {
          Item: {
            value: {
              S: value,
            },
          },
        } = configValue;

        callback(null, createSuccessMessage(value));

        return;
      }

      callback(null, createSuccessMessage(null))
    })
    .catch(error => callback(null, createErrorMessage(error)));
}

export function set(event, context, callback) {
  const { body } = event;

  let bodyObj = {};

  try {
    bodyObj = JSON.parse(body);
  } catch (error) {
    body
      .split('&')
      .map(keyValue => keyValue.split('='))
      .forEach(([key, value]) => {
        bodyObj[key] = value;
      });
  }

  Promise.all(Object.keys(bodyObj)
    .map((key) => {
      const value = bodyObj[key];

      return dynamoDb
        .putItem({
          Item: {
            key: {
              S: key,
            },
            value: {
              S: value,
            },
          },
        })
        .promise();
    }))
    .then(() => callback(null, createSuccessMessage()))
    .catch(error => callback(null, createErrorMessage(error)));
}
