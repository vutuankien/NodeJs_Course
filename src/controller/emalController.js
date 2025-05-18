const { emailService } = require('../services/EmailService');

class EmailController {
    async sendEmail(req, res) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email is required' });
            }

            const response = await emailService(email);
            return res.status(200).json({
                message: 'Email sent successfully',
                data: response
            });

        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({
                message: 'Error sending email',
                error: error.message
            });
        }
    }
}

module.exports = new EmailController();
