# koa2-loggers

A wrapper for support Koa2 logger middleware，Generate log files。

# Installation
```
$ npm i --save kog2-loggers
```

## Koa-middleware way

Similar to use Express (Connect) logger middleware.

```
const getKoaLogger = require('koa2-loggers');
app.use(getKoaLogger({ level: 'auto'}));
```


