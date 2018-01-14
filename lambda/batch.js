import User, { fields as userFields } from './models/users';
import { getEventAttending } from './utils/facebook';
import log from './utils/log';

export async function scrape(event, context, callback) {
  const eventId = '1804514646517478';

  try {
    const users = await getEventAttending(eventId);

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
      let message = error.response.data.error.message;

      if (message.match(/Error validating access token/)) {
        message = 'Facebook token expired! Please login again';
      }

      callback(message);

      return;
    }

    console.error(error);

    callback(error);
  }
}
