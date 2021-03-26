# Vaccine Spotter Texter

This very simple node script will help notify you or your loved ones of available vaccine appointments via text message. It uses the [Vaccine Spotter Very Beta API](https://www.vaccinespotter.org/api/) and [Twilio](https://www.twilio.com/) to make this happen.

## Requirements

* Node JS
* Yarn
* Paid Twilio account


## Setup

1. Clone this package
2. Run `yarn` to install the dependencies
3. Configure by editing `config.js`.
4. Run: `node index.js`.

I use a cron job every 5 minutes on a very basic cloud instance. It works well.

## License and Warranty

There is no warranty. You're on your own.

This script is free as in beer.