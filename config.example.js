const config = {
  DATA_URL: 'https://www.vaccinespotter.org/api/v0/states/MN.json',
  HOME_LAT: 45.210,
  HOME_LNG: -92.221,
  MAX_DISTANCE: 50,
  DATASTORE_PATH: './data.json',
  TWILIO_ACCOUNT_SID: '',
  TWILIO_AUTH_TOKEN: '',
  FROM_NUMBER: '+12125551212', // e.g. +12125551212
  TO_NUMBERS: [ // needs to be array of at least 1 number
    '+12125551212', // e.g. +12125551212
    '+12125551234',
  ],
};

module.exports = config;
