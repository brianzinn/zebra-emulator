# zebra-emulator

A standalone emulator for the **Zebra BrowserPrint** service. Instead of sending labels to a physical printer, it intercepts the browser's print calls, converts the image to ZPL, and saves both the original PNG and the generated ZPL to a local folder.

No physical printer, no external emulator app, no extra configuration required.

---

## How it works

Web apps that use the [Zebra BrowserPrint](https://www.zebra.com/us/en/software/zebra-browser-print.html) library communicate with a local service on port `9100`. This project replaces that service:

1. The browser sends a PNG image to `/convert`
2. The server converts the PNG → ZPL (using ACS encoding via `zpl-image`)
3. Both files are saved to the `converted/` folder with an auto-incrementing index
4. The ZPL string is returned to the browser so the BrowserPrint library completes normally

---

## Requirements

- Node.js >= 14

---

## Setup

```bash
npm install
```

Configure the port if needed (default is `9100`):

```env
# .env
PORT=9100
```

---

## Running

```bash
# production
npm start

# development (auto-restart on file changes)
npm run startdev
```

The server starts on `http://localhost:9100`.

---

## Output

Every print job saves two files to the `converted/` folder:

| File | Contents |
|------|----------|
| `converted/1.png` | Original PNG image sent by the browser |
| `converted/1.zpl` | Generated ZPL label command |

Files are numbered sequentially and never overwritten. The counter survives server restarts.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/default` | Returns the emulated Zebra ZP 500 device info |
| `GET` | `/available` | Returns the list of available devices |
| `GET` | `/config` | Returns supported image conversion formats |
| `POST` | `/convert` | Converts a PNG blob to ZPL and saves both files |
| `POST` | `/write` | Accepts ZPL write calls (no-op, returns success) |
| `POST` | `/read` | Accepts printer read polls (returns empty) |

---

## Notes

- Requires **ES Modules** (Node v14+)
- The BrowserPrint library runs a background heartbeat (`/write` + `/read`) as long as the browser page is open — this is normal and harmless
- To view the generated ZPL labels, upload the `.zpl` file to [labelary.com/viewer.html](http://labelary.com/viewer.html)
