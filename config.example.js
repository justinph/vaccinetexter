const config = {
                          // See: https://www.vaccinespotter.org/api/
  DATA_URL: 'https://www.vaccinespotter.org/api/v0/states/MN.json',
  HOME_LAT: 45.210,       // latitude to calc distance from
  HOME_LNG: -92.221,      // longitude to calc distance from
  MAX_DISTANCE: 50,       // distance in miles
  MIN_APPOINTMENTS: 5,    // minimum number of appointments to notify about
  DATASTORE_PATH: './data.json', // not much reason to change this
  TWILIO_ACCOUNT_SID: '', // add your SID
  TWILIO_AUTH_TOKEN: '',  // add your token
  FROM_NUMBER: '+12125551212', // e.g. +12125551212
  TO_NUMBERS: [           // needs to be array of at least 1 number
    '+12125551212',       // e.g. +12125551212
    '+12125551234',
  ],
};

module.exports = config;
