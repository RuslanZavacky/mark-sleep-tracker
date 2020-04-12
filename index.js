const { GoogleSpreadsheet } = require('google-spreadsheet');
const { formatToTimeZone, convertToTimeZone, parseFromString } = require('date-fns-timezone');
const differenceInSeconds = require('date-fns/differenceInSeconds');

const GOOGLE_SHEET_KEY = process.env.GOOGLE_SHEET_KEY;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_SERVICE_PRIVATE_KEY = process.env.GOOGLE_SERVICE_PRIVATE_KEY;
const TIME_ZONE = process.env.TIME_ZONE || 'Europe/London';
const DATE_FORMAT = process.env.DATE_FORMAT || 'YYYY-MM-DD HH:mm:ss';

const timeDifference = (start, finish) => {
  const diffTime = differenceInSeconds(finish, start);

  if (!diffTime) {
    return '00:00';
  }

  const minutes = Math.abs(Math.floor(diffTime / 60) % 60).toString();
  const hours = Math.abs(Math.floor(diffTime / 60 / 60)).toString();
  return `${hours.length < 2 ? 0 + hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes}`;
};

const handler = async (event) => {
  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_KEY);

  const credentials = {
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_SERVICE_PRIVATE_KEY.replace(/\|\|\|/g, `\n`),
  };

  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  await sheet.setHeaderRow(['Week Day', 'Time', 'Type', 'Duration']);

  if (event.clickType === 'SINGLE') {
    await sheet.addRow({
      'Week Day': formatToTimeZone(new Date(), 'dddd', { timeZone: TIME_ZONE }),
      Time: formatToTimeZone(new Date(), DATE_FORMAT, { timeZone: TIME_ZONE }),
      Type: 'Asleep',
      Duration: '',
    });
  } else if (event.clickType === 'DOUBLE') {
    const rows = await sheet.getRows({
      offset: 0,
      limit: null,
    });

    let lastAsleepRow = null;
    for (const row of rows) {
      if (row['Type'] === 'Asleep') {
        lastAsleepRow = row;
      }
    }

    const lastAsleepTime = parseFromString(lastAsleepRow.Time, DATE_FORMAT);
    const currentDate = convertToTimeZone(new Date(), { timeZone: TIME_ZONE });

    await sheet.addRow({
      'Week Day': formatToTimeZone(new Date(), 'dddd', { timeZone: TIME_ZONE }),
      Time: formatToTimeZone(new Date(), DATE_FORMAT, { timeZone: TIME_ZONE }),
      Type: 'Woke up',
      Duration: timeDifference(lastAsleepTime, currentDate),
    });
  } else if (event.clickType === 'LONG') {
    // TODO: implement if needed
  }
};

exports.handler = handler;
