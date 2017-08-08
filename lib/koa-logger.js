/**
 * sam zhang
 * yu521shao@163.com
 * 
 */    


const DEFAULT_FORMAT = ':time :remote-addr - -' +
    ' ":method :url HTTP/:http-version"' +
    ' :status :content-length ":referrer"' +
    ' ":user-agent"';

const path = require('path');
const fs = require('fs');
const moment = require('moment');

const baseUrl = path.join(__dirname, '../../../loggers/');
let jsPath;
if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
}

const colors = {
    white: [37, 39],
    grey: [90, 39],
    black: [90, 39],
    // colors
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39]
};


function getKoaLogger(options) {

    if (typeof options === 'object') {
        options = options || {};
    } else if (options) {
        options = {
            format: options
        };
    } else {
        options = {};
    }

    var fmt = options.format || DEFAULT_FORMAT;

    /**
     * 写入日志文件
     */

    jsPath = path.join(baseUrl + 'logs_' + moment().format('YYYY-MM-DD HH:mm:ss') + '.log');

    return async function a(ctx, next) {

        if (options.level === 'auto') {
            assembleTokens(ctx, fmt, options.tokens || []);
        }

        try {
            await next();
        } catch (error) {
            assembleTokens(ctx, fmt, options.tokens || []);
            throw error;
        }

    };
}

/**
 *
 * @return {Array}
 */
function assembleTokens(ctx, fmt, customTokens) {
    var arrayUniqueTokens = function (array) {
        let a = array.concat();
        for (let i = 0; i < a.length; ++i) {
            for (let j = i + 1; j < a.length; ++j) {
                if (a[i].token == a[j].token) {
                    a.splice(j--, 1);
                }
            }
        }
        var b = '';
        console.log(format(fmt, a));
        fs.appendFileSync(jsPath, format(fmt, a) + '\n');
    };
    var loggersArr = [];
    loggersArr.push({
        token: ':time',
        replacement: '[ ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ]'
    });
    loggersArr.push({
        token: ':url',
        replacement: ctx.originalUrl
    });
    loggersArr.push({
        token: ':protocol',
        replacement: ctx.protocol
    });
    loggersArr.push({
        token: ':hostname',
        replacement: ctx.hostname
    });
    loggersArr.push({
        token: ':method',
        replacement: ctx.method
    });
    loggersArr.push({
        token: ':status',
        replacement: ctx.response.status || ctx.response.__statusCode || ctx.res.statusCode
    });
    loggersArr.push({
        token: ':response-time',
        replacement: ctx.response.responseTime
    });
    loggersArr.push({
        token: ':date',
        replacement: new Date().toUTCString()
    });
    loggersArr.push({
        token: ':referrer',
        replacement: ctx.headers.referer || ''
    });
    loggersArr.push({
        token: ':http-version',
        replacement: ctx.req.httpVersionMajor + '.' + ctx.req.httpVersionMinor
    });
    loggersArr.push({
        token: ':remote-addr',
        replacement: ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
            (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)))
    });
    loggersArr.push({
        token: ':user-agent',
        replacement: ctx.headers['user-agent']
    });
    loggersArr.push({
        token: ':content-length',
        replacement: (ctx.response._headers && ctx.response._headers['content-length']) ||
            (ctx.response.__headers && ctx.response.__headers['Content-Length']) ||
            ctx.response.length || '-'
    });
    loggersArr.push({
        token: /:req\[([^\]]+)\]/g,
        replacement: function (_, field) {
            return ctx.headers[field.toLowerCase()];
        }
    });
    loggersArr.push({
        token: /:res\[([^\]]+)\]/g,
        replacement: function (_, field) {
            return ctx.response._headers ?
                (ctx.response._headers[field.toLowerCase()] || ctx.response.__headers[field]) :
                (ctx.response.__headers && ctx.response.__headers[field]);
        }
    });

    customTokens = customTokens.map(function (token) {
        if (token.content && typeof token.content === 'function') {
            token.replacement = token.content(ctx);
        }
        return token;
    });

    return arrayUniqueTokens(customTokens.concat(loggersArr));
}

/**
 *
 * @param  {String} str
 * @param  {IncomingMessage} req
 * @param  {ServerResponse} res
 * @return {String}
 * @api private
 */

const styles = {
    ':time': 'green',
    ':url': 'red',
    ':method': 'yellow'
};

function format(str, tokens) {
    for (let i = 0; i < tokens.length; i++) {
        str = str.replace(tokens[i].token, colorize(tokens[i].replacement, styles[tokens[i].token] || 'blue'));
    }
    return str;
}

function colorize(str, color) {
    if (!colors[color]) return str;
    return `\x1B[${colors[color][0]}m` + str + `\x1B[${colors[color][1]}m`;
}

module.exports = getKoaLogger;