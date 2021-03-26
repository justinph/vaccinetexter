const fetch = require('node-fetch');
const fs = require('fs');
const config = require('./config.js');

const twilioClient = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

let datastore = {
  lastCheck: null,
  proximateIds: [],
};

try {
  const file = fs.readFileSync(config.DATASTORE_PATH, 'utf8');
  if (file) {
    datastore = JSON.parse(file);
  }
} catch (err) {}

const deg2rad = (degrees) => degrees * (Math.PI/180);

const distanceFromHome = (lat, lng) => {
  const earthRadius = 3958.75;
  const dLat = deg2rad(config.HOME_LAT - lat);
  const dLng = deg2rad(config.HOME_LNG - lng);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(config.HOME_LAT)) * Math.cos(deg2rad(lat)) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const dist = earthRadius * c;
  return dist;
};

let HAS_NEW_DATA = false;
let messageArr= [];

fetch(config.DATA_URL)
    .then(res => res.json())
    .then(json => {
      if (!json.features || !Array.isArray(json.features)){
        throw new Error('No data found');
      }
      // filter by available first dose appointments
      const hasAppts = json.features.filter(ftr =>
        ftr.properties.appointments_available && !ftr.properties.appointments_available_2nd_dose_only
      ).map(ftr => {
        const lat = ftr.geometry.coordinates[1];
        const lng = ftr.geometry.coordinates[0];
        const distance = distanceFromHome(lat, lng);
        return { distance, ...ftr };
      })
      messageArr.push(`Appts locs in MN: ${hasAppts.length}`);


      const hasApptsNearby = hasAppts.filter(ftr => ftr.distance <= config.MAX_DISTANCE)

      messageArr.push(`Appts with within ${config.MAX_DISTANCE}mi: ${hasApptsNearby.length}`);

      // figure out new appts we havent seen yet
      const newApptsNearby = hasApptsNearby.filter(ftr => !datastore.proximateIds.includes(ftr.properties.id));

      if (newApptsNearby && newApptsNearby.length > 0){
        HAS_NEW_DATA = true;
        datastore.proximateIds = [];
        messageArr.push('NEW appts nearby:');
        messageArr.push('-----------------');
        newApptsNearby.forEach(ftr => {
          const p = ftr.properties;
          const apptCount = p.appointments.length;
          const apptWord = apptCount > 1 ? 'appointments' : 'appointment';
          const dist = Math.round(ftr.distance);

          // prep message
          messageArr.push(`${p.provider}: ${p.city} ${p.postal_code}, ${dist}mi, ${apptCount} ${apptWord} - ${p.url}\n`);

          //add the seen ID to the datastore;
          datastore.proximateIds.push(ftr.properties.id);
        })
      } else {
        messageArr.push("No new appts");
      }

      const body = messageArr.join('\n').trim();
      console.log(body);

      if (HAS_NEW_DATA) {
        console.log('sending...');
        return Promise.all(
          config.TO_NUMBERS.map((number) => {
            return twilioClient.messages.create({
              body,
              from: config.FROM_NUMBER,
              to: number,
            });
          })
        );
      }

      console.log('writing...');
      datastore.lastCheck = new Date();
      const data = JSON.stringify(datastore, null, 2);
      fs.writeFileSync(config.DATASTORE_PATH, data, 'utf8');
    })
    .then(message => {
      if (message && HAS_NEW_DATA) {
         console.log(`sent!`);
      }
      // const used = process.memoryUsage().heapUsed / 1024 / 1024;
      // console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    })
    .catch(error => console.error(error));
