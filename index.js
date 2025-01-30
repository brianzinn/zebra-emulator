import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import https from 'https'
import fs from 'fs'
import * as dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.text({
  type: 'text/plain',
}))
app.use(express.json({
  type: (req) => {
    return req.headers['content-type'] !== 'text/plain'
  }
}));

const DEVICES_RESPONSE = {
  "deviceType": "printer",
  "uid": "Zebra ZP 500 (ZPL)",
  "provider": "com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider",
  "name": "Zebra ZP 500 (ZPL)",
  "connection": "driver",
  "version": 3,
  "manufacturer": "Zebra Technologies"
};

app.get('/default', (req, res) => {
  console.log('GET request for /default recieved')
  res.status(200).json(DEVICES_RESPONSE)
})

app.post('/convert', (req, res) => {
  // TODO: set content-type to "text/plain"?
  // this is for PDF.  the other ones would work.  you should not need it.  see:
  // https://developer.zebra.com/forum/25874
  res.send('The format conversion attempted requires a licensing key and none was provided');
})

app.get('/config', (req, res) => {
  res.json({
    "application": {
      "supportedConversions": {
        "jpg": ["cpcl", "zpl", "kpl"],
        "tif": ["cpcl", "zpl", "kpl"],
        "pdf": ["cpcl", "zpl", "kpl"],
        "bmp": ["cpcl", "zpl", "kpl"],
        "pcx": ["cpcl", "zpl", "kpl"],
        "gif": ["cpcl", "zpl", "kpl"],
        "png": ["cpcl", "zpl", "kpl"],
        "jpeg": ["cpcl", "zpl", "kpl"]
      },
      "version": "1.3.2.489",
      "apiLevel": 5,
      "buildNumber": 489,
      "platform": "windows"
    }
  })
})

app.get('/available', (req, res) => {
  console.log('GET request for /available recieved')
  res.json({
    "deviceList": [
      {
        "uid": "Zebra ZP 500 (ZPL)",
        "name": "Zebra ZP 500 (ZPL)"
      }
    ]
  })
})

// From browser-print ES
// this._paperOut = this.isFlagSet(5);
// this._paused = this.isFlagSet(7);
// this._headOpen = this.isFlagSet(43);
// this._ribbonOut = this.isFlagSet(45);
const STATUS_REQUEST = '~HQES'
const STATUS_RESPONSE = `${String.fromCharCode([2])}

  PRINTER STATUS                          
 ERRORS:         0 00000000 00000000      
 WARNINGS:       0 00000000 00000000      
${String.fromCharCode([3])}`;

const FIXED_RESPONSES_MAP = {
  [STATUS_REQUEST]: STATUS_RESPONSE
}

const preparedResponses = [];

app.post('/read', (req, res) => {
  // if(req.headers['content-type'] === 'text/plain') {
  //   if(req.body in FIXED_RESPONSES_MAP) {
  //     res.status(200).send(FIXED_RESPONSES_MAP[req.body])
  //     return;
  //   } else {
  //     console.log(`unexpected text/plain: '${req.body}'`);
  //   }
  // }
  if (preparedResponses.length !== 0) {
    console.log('Returning prepared response');
    res.status(200).send(preparedResponses.pop());
  } else {
    res.status(200).send();
  }
})

app.post('/write', (req, res) => {
  console.log('POST request for /write recieved')
  const data = req?.body?.data;
  console.log('data:', data ? data : '"data" missing req.body');
  console.log('---------------------------------------\n');

  if(data) {
    if(data in FIXED_RESPONSES_MAP) {
      // TODO: should we not call the chrome extension here?
      console.log(`Response prepared for: ${data}`);
      preparedResponses.push(FIXED_RESPONSES_MAP[data]);
    }
  }

  if (process.env.CHROME_EXTENSION_ENABLED === String(true)) {
    const port = process.env.CHROME_EXTENSION_PORT ?? '9102';
    // const payload = typeof req.body.data === 'string' ? req.body.data : Buffer.from(req.body.data);
    fetch(`http://localhost:${port}`, { method: 'POST', body: '{"mode":"print","epl":"' + Buffer.from(req.body.data) + '"}' })
      .catch((e) => {
        // do nothing, keep the console clean
      });
  }
  res.json({})
})

const SERVER_PORT = 9100;
const SERVER_PORT_SSL = 9101;
const EXTENSION_PORT = process.env.CHROME_EXTENSION_PORT ?? '9101';

//SSL key and cert
var option = {
  key: fs.readFileSync('ssl/server.key'),
  cert: fs.readFileSync('ssl/server.cert')
};


https.createServer(option, app).listen(SERVER_PORT_SSL, () => {
  console.log(`\nBrowser Print Fake Server running on https://localhost:${SERVER_PORT}\n\n`)
  console.log('******************************************************************************')
  if (process.env.CHROME_EXTENSION_ENABLED === String(true)) {
    console.log(
      '  TIP: If you want to preview the label you can install the Zpl Printer\n  extension from the chrome web store and set it up to listen on port ' + EXTENSION_PORT
    )
  } else {
    console.log('Chrome extension support not enabled.');
  }
  console.log('******************************************************************************\n')
});


app.listen(SERVER_PORT, '127.0.0.1', () => {
  console.log(`\nBrowser Print Fake Server running on http://localhost:${SERVER_PORT}\n\n`)
  console.log('******************************************************************************')
  if (process.env.CHROME_EXTENSION_ENABLED === String(true)) {
    console.log(
      '  TIP: If you want to preview the label you can install the Zpl Printer\n  extension from the chrome web store and set it up to listen on port ' + EXTENSION_PORT
    )
  } else {
    console.log('Chrome extension support not enabled.');
  }
  console.log('******************************************************************************\n')
});
