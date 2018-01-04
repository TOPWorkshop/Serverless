import axios from 'axios';

async function sendTelegramMessage(token, chat_id, text) {
  const { data } = axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id,
    text,
    parse_mode: 'HTML',
  });

  console.log(data);

  return data;
}

export function forwardSNS(event, context, callback) {
  const message = event.Records[0].Sns.Message;

  console.log(message);

  callback();
}
