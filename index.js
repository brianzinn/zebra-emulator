import express from 'express'
import cors from 'cors'
import fs from 'fs'
import multer from 'multer'
import { Jimp } from 'jimp'
import zplImage from 'zpl-image'
import * as dotenv from 'dotenv';

dotenv.config();

const { rgbaToACS } = zplImage;

const CONVERTED_DIR = './converted';
if (!fs.existsSync(CONVERTED_DIR)) fs.mkdirSync(CONVERTED_DIR);

const nextFileIndex = () => {
  const files = fs.readdirSync(CONVERTED_DIR).filter(f => /^\d+\.png$/.test(f));
  if (files.length === 0) return 1;
  return Math.max(...files.map(f => parseInt(f))) + 1;
};

const app = express();
app.use(cors());
app.use((req, res, next) => {
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    return next();
  }
  express.json({ type: '*/*' })(req, res, next);
});

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
  res.status(200).json(DEVICES_RESPONSE);
});

app.get('/available', (req, res) => {
  res.json({
    "deviceList": [
      { "uid": "Zebra ZP 500 (ZPL)", "name": "Zebra ZP 500 (ZPL)" }
    ]
  });
});

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
  });
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/convert', upload.single('blob'), async (req, res) => {
  try {
    const image = await Jimp.fromBuffer(req.file.buffer);
    const { width, data } = image.bitmap;

    const rv = rgbaToACS(data, width, { black: 50 });
    const zpl = `^XA^FO0,0^GFA,${rv.length},${rv.length},${rv.rowlen},${rv.acs}^XZ`;

    const idx = nextFileIndex();
    fs.writeFileSync(`${CONVERTED_DIR}/${idx}.png`, req.file.buffer);
    fs.writeFileSync(`${CONVERTED_DIR}/${idx}.zpl`, zpl);
    console.log(`[${idx}] Saved ${image.bitmap.width}x${image.bitmap.height} PNG + ZPL (${zpl.length} bytes) → converted/${idx}.*`);

    res.status(200).json(zpl);
  } catch (err) {
    console.error('Error in /convert:', err);
    res.status(500).send('Conversion error: ' + err.message);
  }
});

// Always return empty — the library interprets an empty read as "printer idle / job done"
app.post('/read', (req, res) => {
  res.status(200).send();
});

// Always return success — no status queueing to avoid write/read feedback loops
app.post('/write', (req, res) => {
  res.json({});
});

const PORT = process.env.PORT || 9100;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`\nZebra emulator running on http://localhost:${PORT}`);
  console.log(`Labels saved to: ${CONVERTED_DIR}/\n`);
});
