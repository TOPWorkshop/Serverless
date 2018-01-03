import Configuration, { fields } from './models/configuration';
import { createSuccessMessage, createErrorMessage } from './utils';

export async function get(event, context, callback) {
  const { configKey } = event.pathParameters;

  Configuration.get({ [fields.key]: configKey })
    .then(configItem => callback(null, createSuccessMessage(configItem ? configItem[fields.value] : {})))
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

  Promise.all(Object.keys(bodyObj).map(key => Configuration.update({ [fields.key]: key, [fields.value]: bodyObj[key] })))
    .then(() => callback(null, createSuccessMessage()))
    .catch(error => callback(null, createErrorMessage(error)));
}
