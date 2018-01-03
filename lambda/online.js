import User from './models/users';
import { createSuccessMessage, createErrorMessage } from './utils/aws';

export function list(event, context, callback) {
  User.scan().exec()
    .then(users => callback(null, createSuccessMessage(users)))
    .catch(error => callback(null, createErrorMessage(error)));
}

export function vote(event, context, callback) {
  const { userId } = event.pathParameters;

  User.vote(userId)
    .then(user => callback(null, createSuccessMessage(user)))
    .catch(error => callback(null, createErrorMessage(error)));
}
