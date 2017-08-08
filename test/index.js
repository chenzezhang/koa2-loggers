const Koa = require('koa');
const app = new Koa();

const router = require('koa-router')();

const getKoaLogger = require('./../index');

app.use(getKoaLogger({ level: 'auto' }));


router.get('/api/test', async (ctx, next) => {
    
    ctx.body = {
        test: 'test'
    };
});

 app.use(router.routes())
    .use(router.allowedMethods());




const server = app.listen(3002, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('http://%s:%s', host, port, ',启动成功');
});