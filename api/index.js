const serverlessExpress = require('@vendia/serverless-express');
const app = require('../src/index'); // import app từ project của bạn

module.exports = serverlessExpress({ app });
