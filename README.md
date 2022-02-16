# zebra-emulator
Paper saver that emulates server needed for BrowserPrint (Zebra ZPL).

Runs a service that acts like the server that runs on a computer, which sends the ZPL to the Zebra Printer from the browser (Browser Print).

It will log what is being sent to the printer.  You can upload to an online viewer such as [labelary](http://labelary.com/viewer.html) or better yet, if you install the [Zpl Printer Chrome browser extension](https://chrome.google.com/webstore/detail/zpl-printer/phoidlklenidapnijkabnfdgmadlcmjo?hl=en-US) and configure it to listen on port 9101. Once installed and turned on you will see the label(s) rendered in real time.

This fork of [zebra-emulator](https://github.com/brianzinn/zebra-emulator) makes use of ES Modules which require Node v14 or greater.