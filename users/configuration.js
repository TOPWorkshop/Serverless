import Configuration from './models/configuration';
import { createSuccessMessage, createErrorMessage } from './utils';

export async function get(event, context, callback) {
  const { configKey } = event.pathParameters;

  Configuration.get({ key: configKey }, (error, configItem) => {
    if (error) {
      callback(null, createErrorMessage(error));

      return;
    }

    callback(null, createSuccessMessage(configItem ? configItem.get('value') : {}));
  });
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

  Configuration.create(Object.keys(bodyObj).map(key => ({ key, value: bodyObj[key] })), (error) => {
    if (error) {
      callback(null, createErrorMessage(error));

      return;
    }

    callback(null, createSuccessMessage());
  });
}
