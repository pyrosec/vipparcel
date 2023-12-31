"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = exports.loadFiles = exports.loadSessionFrom = exports.saveSessionAs = exports.callAPI = exports.loadProxy = exports.unsetProxy = exports.setProxy = exports.proxyStringToObject = exports.loadSession = exports.initSession = exports.saveSession = void 0;
const vipparcel_1 = require("./vipparcel");
const yargs_1 = __importDefault(require("yargs"));
const change_case_1 = require("change-case");
const fs_extra_1 = __importDefault(require("fs-extra"));
const url_1 = __importDefault(require("url"));
require("setimmediate");
const mkdirp_1 = require("mkdirp");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const logger = (0, logger_1.getLogger)();
async function saveSession(vipparcel, json = false, filename = 'session.json') {
    await (0, mkdirp_1.mkdirp)(path_1.default.join(process.env.HOME, '.vipparcel'));
    await fs_extra_1.default.writeFile(path_1.default.join(process.env.HOME, '.vipparcel', filename), vipparcel.toJSON());
    if (!json)
        logger.info('saved to ~/' + path_1.default.join('.vipparcel', filename));
}
exports.saveSession = saveSession;
async function initSession() {
    const proxyOptions = await loadProxy();
    const vipparcel = new vipparcel_1.VIPParcel();
    vipparcel.proxyOptions = proxyOptions;
    await saveSession(vipparcel);
}
exports.initSession = initSession;
async function loadSession() {
    const proxyOptions = await loadProxy();
    const vipparcel = vipparcel_1.VIPParcel.fromJSON(await fs_extra_1.default.readFile(path_1.default.join(process.env.HOME, '.vipparcel', 'session.json')));
    vipparcel.proxyOptions = proxyOptions;
    return vipparcel;
}
exports.loadSession = loadSession;
const proxyStringToObject = (proxyUri) => {
    const parsed = url_1.default.parse(proxyUri);
    const [username, ...passwordParts] = (parsed.auth || '').split(':');
    return {
        hostname: parsed.hostname,
        port: parsed.port,
        userId: username || null,
        password: passwordParts.join(':') || null
    };
};
exports.proxyStringToObject = proxyStringToObject;
async function setProxy(proxyUri) {
    await (0, mkdirp_1.mkdirp)(path_1.default.join(process.env.HOME, '.vipparcel'));
    const proxyOptions = (0, exports.proxyStringToObject)(proxyUri);
    const joined = (0, vipparcel_1.objectToProxyString)(proxyOptions);
    await fs_extra_1.default.writeFile(path_1.default.join(process.env.HOME, '.vipparcel', 'proxy'), joined);
    logger.info('set-proxy: ' + joined);
}
exports.setProxy = setProxy;
async function unsetProxy() {
    await (0, mkdirp_1.mkdirp)(path_1.default.join(process.env.HOME, '.vipparcel'));
    await fs_extra_1.default.unlink(path_1.default.join(process.env.HOME, '.vipparcel', 'proxy'));
    logger.info('unset-proxy');
}
exports.unsetProxy = unsetProxy;
async function loadProxy() {
    await (0, mkdirp_1.mkdirp)(path_1.default.join(process.env.HOME, '.vipparcel'));
    try {
        return await fs_extra_1.default.readFile(path_1.default.join(process.env.HOME, '.vipparcel', 'proxy'), 'utf8');
    }
    catch (e) {
        return null;
    }
}
exports.loadProxy = loadProxy;
async function callAPI(command, data) {
    const vipparcel = await loadSession();
    const camelCommand = (0, change_case_1.camelCase)(command);
    const json = data.j || data.json;
    const repl = data.repl;
    delete data.j;
    delete data.json;
    delete data.repl;
    if (!vipparcel[camelCommand])
        throw Error('command not foud: ' + command);
    const result = await vipparcel[camelCommand](data);
    if (repl) {
        const r = require('repl').start('> ');
        r.context.result = result;
        await new Promise(() => { });
        return result;
    }
    else if (json)
        console.log(JSON.stringify(result, null, 2));
    else
        logger.info(result);
    await saveSession(vipparcel, json);
    return result;
}
exports.callAPI = callAPI;
async function saveSessionAs(name) {
    const vipparcel = await loadSession();
    await saveSession(vipparcel, false, name + '.json');
}
exports.saveSessionAs = saveSessionAs;
async function loadSessionFrom(name) {
    const vipparcel = vipparcel_1.VIPParcel.fromObject(require(path_1.default.join(process.env.HOME, '.vipparcel', name)));
    await saveSession(vipparcel);
}
exports.loadSessionFrom = loadSessionFrom;
async function loadFiles(data) {
    const fields = [];
    for (let [k, v] of Object.entries(data)) {
        const parts = /(^.*)FromFile$/.exec(k);
        if (parts) {
            const key = parts[1];
            fields.push([key, await fs_extra_1.default.readFile(v)]);
        }
        else {
            fields.push([k, v]);
        }
    }
    return fields.reduce((r, [k, v]) => {
        r[k] = v;
        return r;
    }, {});
}
exports.loadFiles = loadFiles;
async function runCLI() {
    const [command] = yargs_1.default.argv._;
    const options = Object.assign({}, yargs_1.default.argv);
    delete options._;
    const data = await loadFiles(Object.entries(options).reduce((r, [k, v]) => {
        r[(0, change_case_1.camelCase)(k)] = String(v);
        return r;
    }, {}));
    if (data.address && data.address.indexOf(',') !== -1)
        data.address = data.address.split(',');
    switch (command) {
        case 'init':
            return await initSession();
            break;
        case 'set-proxy':
            return await setProxy(yargs_1.default.argv._[1]);
            break;
        case 'unset-proxy':
            return await unsetProxy();
            break;
        case 'save':
            return await saveSessionAs(yargs_1.default.argv._[1]);
            break;
        case 'load':
            return await loadSessionFrom(yargs_1.default.argv._[1]);
            break;
        default:
            return await callAPI(yargs_1.default.argv._[0], data);
            break;
    }
}
exports.runCLI = runCLI;
//# sourceMappingURL=cli.js.map