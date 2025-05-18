const nodemailer = require("nodemailer");
require('dotenv').config();


const emailService = async (email) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, // Đúng cổng SMTP của Ethereal
        secure: false, // false cho cổng 587
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"A super handsome guy" <vutuankien2004@gmail.com>', // format chuẩn
        to: email,
        subject: "Hello ✔",
        text: "Hello world?",
        html: "<b>Hello world?</b>",
        attachments: [
            {
                filename: 'test.txt',
                content: 'Hello world!'
            },
            {
                filename: 'test.txt',
                content: "Tuan Kiên",
            },
            {
                filename: 'anh-trai-dep-dau-nam.jpg',
                path: "https://khoinguonsangtao.vn/wp-content/uploads/2022/08/anh-trai-dep-dau-nam.jpg"
            }
        ]
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return info
};

module.exports = { emailService };
