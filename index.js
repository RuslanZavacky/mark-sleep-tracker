const { GoogleSpreadsheet } = require('google-spreadsheet');
const { formatToTimeZone, convertToTimeZone, parseFromString } = require('date-fns-timezone');
const differenceInSeconds = require('date-fns/differenceInSeconds');

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
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_KEY);

  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(/\|\|\|/g, `\n`),
  };

  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  await sheet.setHeaderRow(['Week Day', 'Time', 'Type', 'Duration']);

  if (event.clickType === 'SINGLE') {
    await sheet.addRow({
      'Week Day': formatToTimeZone(new Date(), 'dddd', { timeZone: 'Europe/London' }),
      Time: formatToTimeZone(new Date(), 'YYYY-MM-DD HH:mm:ss', { timeZone: 'Europe/London' }),
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

    const lastAsleepTime = parseFromString(lastAsleepRow.Time, 'YYYY-MM-DD HH:mm:ss');
    const currentDate = convertToTimeZone(new Date(), { timeZone: 'Europe/London' });

    await sheet.addRow({
      'Week Day': formatToTimeZone(new Date(), 'dddd', { timeZone: 'Europe/London' }),
      Time: formatToTimeZone(new Date(), 'YYYY-MM-DD HH:mm:ss', { timeZone: 'Europe/London' }),
      Type: 'Woke up',
      Duration: timeDifference(lastAsleepTime, currentDate),
    });
  } else if (event.clickType === 'LONG') {
    // TODO: implement if needed
  }
};

exports.handler = handler;

// (async () => {
//   await handler({ clickType: 'DOUBLE' });
// })();