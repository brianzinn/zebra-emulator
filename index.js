import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

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
  fetch('http://localhost:9101', { method: 'POST', body: '{"mode":"print","epl":"' + Buffer.from(req.body.data) + '"}' })
    .catch((e) => {
      // do nothing, keep the console clean
    });
  res.json({})
})

const SERVER_PORT = 9100;
app.listen(SERVER_PORT, () => {
  console.log(`\nBrowser Print Fake Server running on http://localhost:${SERVER_PORT}\n\n`)
  console.log('******************************************************************************')
  console.log(
    '  TIP: If you want to preview the label you can install the Zpl Printer\n  extension from the chrome web store and set it up to listen on port 9101'
  )
  console.log('******************************************************************************\n')
});