import { Lambda } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies
import axios from 'axios';

import Configuration from './models/configuration';
import { createSuccessMessage } from './utils/aws';
import log from './utils/log';

const userIdKey = 'telegramUserId';

async function getTelegramUrl() {
  const telegramUrl = 'https://api.telegram.org/bot{token}';

  const tokenKey = 'telegramBotToken';
  const token = await Configuration.getValue(tokenKey);

  return telegramUrl.replace('{token}', token);
}

async function sendTelegramMessage(chatId, text) {
  const { data } = axios.post(`${await getTelegramUrl()}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  });

  return data;
}

export async function forwardSNS(event, context, callback) {
  try {
    const message = event.Records[0].Sns.Message;
    const chatId = await Configuration.getValue(userIdKey);

    await sendTelegramMessage(chatId, message);

    callback();
  } catch (error) {
    callback(error);
  }
}

export async function handleMessage(event, context, callback) {
  const body = JSON.parse(event.body);

  try {
    const expectedChatId = await Configuration.getValue(userIdKey);
    const chatId = body.message.chat.id;

    console.log(chatId);

    callback(null, createSuccessMessage({}));

    if (expectedChatId !== `${chatId}`) {
      await sendTelegramMessage(chatId, 'You cannot chat with me!');
    } else {
      const command = body.message.text;

      await sendTelegramMessage(chatId, 'Hi Nic!');

      if (command === '/scrape') {
        const lambda = new Lambda();
        const scrapeFunction = process.env.LAMBDA_SCRAPE;

        await lambda.invoke({
          FunctionName: scrapeFunction,
          InvocationType: 'Event',
        }).promise();
      }

      if (command === '/error') {
        log.error('telegram', 'OMG you have an error!!!');
      }

      if (command === '/timeout') {
        setTimeout(() => log.info('Timeout expired'), 2500);
      }
    }
  } catch (error) {
    log.error('telegram', error);

    callback(null, createSuccessMessage({}));
  }
}

export async function registerEndpoint(endpoints, context, callback) {
  const url = endpoints['telegram-handleMessage'].POST;

  await axios.post(`${await getTelegramUrl()}/setWebhook`, { url });

  callback();
}
