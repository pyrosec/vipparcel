'use strict';

const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs')
const { camelCase } = require('change-case');

const  [ filename ] = yargs.argv._;

const toType = (v) => {
  if (v.match('array ')) return 'any[]';
  else if (v.match(/array$/)) return 'string[]';
  else switch (v) {
    case  'integer':
    case 'float':
     return 'number';
    default:
      return v;
  }
};
	
    

(async () => {
  const schema = JSON.parse(await fs.readFile(filename, 'utf8'));
  schema.forEach((v) => {
    let param = v.url.match(/(?:\{\w+\})/g);
    let uri = v.url;
    if (param) {
      param = param[0].substr(1, param.length - 2);
      const s = v.url.split('/');
      uri = s.slice(0, -1).join('/');
    } else uri = v.url;
    const parts = uri.split('/');
    const method = camelCase(parts.join('-'));
    console.log('async ' + method + '(o: {');
    if (param) console.log('  ' + param + ': string' + (param ? ',' : ''));
    v.params.forEach((v, i, ary) => console.log('  ' + v[0] + ': ' + toType(v[1]) + ';'));
    console.log('}) {');
    console.log('  const body = { ...o };');
    if (param) console.log('  delete body[' + param + '];');
    console.log('  return await this._call("' + uri + (param ? `+ "/" + o.${param}` : "") + '", { method: "' + v.method + '"' + (v.method !== 'GET' ? ', body: JSON.stringify(body)' : '') + ' });');
    console.log('}');
  });
})().catch((err) => console.error(err));
