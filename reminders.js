const config = require('./config.js');
const twilioClient = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

const body = 'Hello world!';

Promise.all(
    config.TO_NUMBERS.map((number) => {
      return twilioClient.messages.create({
        body,
        from: config.FROM_NUMBER,
        to: number,
      });
    })
  )
  .then(message => {
    if (message) {
      console.log(`sent!`);
    }
  })
  .catch(error => console.error('error:', error));
