# zebra-emulator
Paper saver that emulates the service provided by `BrowserPrint` application (Zebra ZPL).

---
The `BrowserPrint` service application sends the ZPL to the Zebra Printer from the browser and we are intercepting those calls and logging them and optionally sending to a browser extension to view in real time (without using a physical printer or paper).

- This project logs what would be sent to the printer
- You can upload to an online viewer such as [labelary](http://labelary.com/viewer.html) or better yet, if you install the [Zpl Printer Chrome browser extension](https://chrome.google.com/webstore/detail/zpl-printer/phoidlklenidapnijkabnfdgmadlcmjo?hl=en-US) and configure it to listen on port 9102. Once installed and turned on you will see the label(s) rendered in real time

> `HTTP` service on 9100

> `HTTPS` service on 9101 (with provided SSL cert)

To build the SSL keys and cert files, use command:
```
$ openssl req -nodes -new -x509 -days 7300 -keyout server.key -out server.cert
```

If you are printing a lot at once it may overflow your terminal/prompt.  You can redirect to a file for easier searching/viewing:
```bash
$ yarn start > out.log
```

**NOTE:  Makes use of ES Modules which require Node v14 or greater.

If you are working on a website - check out the browserprint-es module:
[github.com/brianzinn/browserprint-es](https://github.com/brianzinn/browserprint-es)
