# zebra-emulator
Paper saver that emulates server needed for BrowserPrint (Zebra ZPL).

Runs a service that acts like the server that runs on a computer, which sends the ZPL to the Zebra Printer from the browser (Browser Print).

It will log what is being sent to the printer.  You can upload to an online viewer such as [labelary](http://labelary.com/viewer.html) or better yet, if you install the [Zpl Printer Chrome browser extension](https://chrome.google.com/webstore/detail/zpl-printer/phoidlklenidapnijkabnfdgmadlcmjo?hl=en-US) and configure it to listen on port 9102. Once installed and turned on you will see the label(s) rendered in real time.

Makes use of ES Modules which require Node v14 or greater.

HTTP service on 9100
HTTPS service on 9101 with provided SSL cert

To build the SSL keys and cert files, use command `openssl req -nodes -new -x509 -days 7300 -keyout server.key -out server.cert`
