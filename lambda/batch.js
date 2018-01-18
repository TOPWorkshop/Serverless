import Configuration from './models/configuration';
import User, { fields as userFields } from './models/users';
import { getEventAttending } from './utils/facebook';
import log from './utils/log';

// eslint-disable-next-line import/prefer-default-export
export async function scrape(event, context, callback) {
  const eventIdKey = 'fbEventId';
  const eventId = await Configuration.getValue(eventIdKey);

  try {
    const users = await getEventAttending(eventId);

    log.verbose('scrape', users);

    await Promise.all(users.map(user => User.update({
      [userFields.userId]: user.id,
    }, {
      [userFields.name]: user.name,
    }, {
      createRequired: true,
    })));

    log.info('scrape', 'Scraping completed!');

    callback();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      let { message } = error.response.data.error;

      if (message.match(/Error validating access token/)) {
        message = 'Facebook token expired! Please login again';
      }

      callback(message);

      return;
    }

    log.error('scrape', error);

    callback(error);
  }
}
