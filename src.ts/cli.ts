import { VIPParcel, objectToProxyString } from "./vipparcel";
import yargs from "yargs";
import { camelCase } from "change-case";
import fs from "fs-extra";
import util from "util";
import url from "url";
import "setimmediate";
import { mkdirp } from "mkdirp"
import path from "path";
import { getLogger } from "./logger";
import { HttpProxyAgent } from "http-proxy-agent";

const logger = getLogger();

export async function saveSession(vipparcel, json = false, filename = 'session.json') {
  await mkdirp(path.join(process.env.HOME, '.vipparcel'));

  await fs.writeFile(path.join(process.env.HOME, '.vipparcel', filename), vipparcel.toJSON());
  if (!json) logger.info('saved to ~/' + path.join('.vipparcel', filename));
}
  

export async function initSession() {
  const proxyOptions = await loadProxy();
  const vipparcel = new VIPParcel();
  vipparcel.proxyOptions = proxyOptions;
  await saveSession(vipparcel);
}

export async function loadSession() {
  const proxyOptions = await loadProxy();
  const vipparcel = VIPParcel.fromJSON(await fs.readFile(path.join(process.env.HOME, '.vipparcel', 'session.json')));
  vipparcel.proxyOptions = proxyOptions;
  return vipparcel;
}

export const proxyStringToObject = (proxyUri: string) => {
  const parsed = url.parse(proxyUri);
  const [ username, ...passwordParts ] = (parsed.auth || '').split(':')
  return {
    hostname: parsed.hostname,
    port: parsed.port,
    userId: username || null,
    password: passwordParts.join(':') || null
  };
};

export async function setProxy(proxyUri: string) {
  await mkdirp(path.join(process.env.HOME, '.vipparcel'));
  const proxyOptions = proxyStringToObject(proxyUri);
  const joined = objectToProxyString(proxyOptions);
  await fs.writeFile(path.join(process.env.HOME, '.vipparcel', 'proxy'), joined);
  logger.info('set-proxy: ' + joined);
}

export async function unsetProxy() {
  await mkdirp(path.join(process.env.HOME, '.vipparcel'));
  await fs.unlink(path.join(process.env.HOME, '.vipparcel', 'proxy'));
  logger.info('unset-proxy');
}

export async function loadProxy() {
  await mkdirp(path.join(process.env.HOME, '.vipparcel'));
  try {
    return await fs.readFile(path.join(process.env.HOME, '.vipparcel', 'proxy'), 'utf8');
  } catch (e) {
    return null;
  }
}


export async function callAPI(command, data) {
  const vipparcel = await loadSession();
  const camelCommand = camelCase(command);
  const json = data.j || data.json;
  const repl = data.repl;
  delete data.j
  delete data.json;
  delete data.repl;
  if (!vipparcel[camelCommand]) throw Error('command not foud: ' + command);
  const result = await vipparcel[camelCommand](data);
  if (repl) {
    const r = require('repl').start('> ');
    r.context.result = result;
    await new Promise(() => {});
    return result;
  } else if (json) console.log(JSON.stringify(result, null, 2));
  else logger.info(result);
  await saveSession(vipparcel, json);
  return result;
}

export async function saveSessionAs(name) {
  const vipparcel = await loadSession();
  await saveSession(vipparcel, false, name + '.json');
}

export async function loadSessionFrom(name) {
  const vipparcel = VIPParcel.fromObject(require(path.join(process.env.HOME, '.vipparcel', name)));
  await saveSession(vipparcel);
}


export async function loadFiles(data: any) {
  const fields = [];
  for (let [ k, v ] of Object.entries(data)) {
    const parts = /(^.*)FromFile$/.exec(k);
    if (parts) {
      const key = parts[1];
      fields.push([key, await fs.readFile(v)]);
    } else {
      fields.push([k, v]);
    }
  }
  return fields.reduce((r, [k, v]) => {
    r[k] = v;
    return r;
  }, {});
}
      

export async function runCLI() {
  const [ command ] = yargs.argv._;
  const options = Object.assign({}, yargs.argv);
  delete options._;
  const data = await loadFiles(Object.entries(options).reduce((r, [ k, v ]) => {
    r[camelCase(k)] = String(v);
    return r;
  }, {}));
  if (data.address && data.address.indexOf(',') !== -1) data.address = data.address.split(',');
  switch (command) {
    case 'init':
      return await initSession();
      break;
    case 'set-proxy':
      return await setProxy(yargs.argv._[1]);
      break;
    case 'unset-proxy':
      return await unsetProxy();
      break;
    case 'save':
      return await saveSessionAs(yargs.argv._[1]);
      break;
    case 'load':
      return await loadSessionFrom(yargs.argv._[1]);
      break;
    default: 
      return await callAPI(yargs.argv._[0], data);
      break;
  }
}
