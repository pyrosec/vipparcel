'use strict';

const schema = require('../schema');
const path = require('path');
schema.forEach((v) => {
  const parts = v.url.split('/');
  let param = parts.find((v) => v.match('{'));
  if (param) param = param.substr(1, param.length - 2);
  console.log('  async ' + parts.
