# koa2-loggers

A wrapper for support Koa2 logger middleware，Generate log files。

# Installation
```
$ npm i --save koa2-loggers
```

## Koa-middleware way

 Similar to use Express (Connect) logger middleware.

```
const getKoaLogger = require('koa2-loggers');
app.use(getKoaLogger({ level: 'auto'}));
```
 Log information display
```
[ 2017-08-07 21:09:35 ] ::ffff:127.0.0.1 - - "GET /api/getway HTTP/1.1" 200 73 "" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
```

## test


