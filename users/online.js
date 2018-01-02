import User from './models/users';
import { createSuccessMessage, createErrorMessage } from './utils';

export function list(event, context, callback) {
  User.scan().exec((error, users) => {
    if (error) {
      callback(null, createErrorMessage(error));

      return;
    }

    callback(null, createSuccessMessage(users.Items));
  });
}

export function vote(event, context, callback) {
  const { userId } = event.pathParameters;

  User.update({
    userId,
    votes: { $add: 1 },
  }, {
    expected: { userId: { Exists: true } },
  }, (error, user) => {
    if (error) {
      callback(null, createErrorMessage(error));

      return;
    }

    callback(null, createSuccessMessage(user));
  });
}
