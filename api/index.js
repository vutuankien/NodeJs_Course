const serverlessExpress = require('@vendia/serverless-express');
const app = require('../src/index');

// Bật debug nếu cần
process.env.DEBUG = 'serverless-express:*';

// Xử lý lỗi không xác định được event source
const handler = serverlessExpress({
    app,
    resolutionMode: 'PROMISE' // Thêm tùy chọn này
});

module.exports.handler = async (event, context) => {
    console.log('Incoming event:', JSON.stringify(event));
    return handler(event, context);
};