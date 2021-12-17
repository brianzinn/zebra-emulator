var express = require('express');
var cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ type: '*/*' }));

app.get('/default', (req, res) => {
  res.json({
    "deviceType": "printer",
    "uid": "Zebra ZP 500 (ZPL)",
    "provider": "com.zebra.ds.webdriver.desktop.provider.DefaultDeviceProvider",
    "name": "Zebra ZP 500 (ZPL)",
    "connection": "driver",
    "version": 3,
    "manufacturer": "Zebra Technologies"
  })
})

app.get('/available', (req, res) => {
  res.json({
    "deviceList": [
      {
        "uid": 1,
        "name": "Fake Printer"
      }
    ]
  })
})

app.post('/write', (req, res) => {
  console.log('data:', (req && req.body) ? req.body.data : '"data" missing req.body');
  console.log('---------------------------------------\n')
  res.json({})
})

const SERVER_PORT = 9100;
app.listen(SERVER_PORT, () =>
  console.log(`Browser Print Fake Server running on http://localhost:${SERVER_PORT}`)
);