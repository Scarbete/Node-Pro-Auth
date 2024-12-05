const nodemailer = require('nodemailer')

class EmailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        })
    }

    async sendActivationEmail(to, link) {
        await this.transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: 'Hello ✔',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке:</h1>
                    <a href="${link}">${link}</a>
                    <p>Made by (Quasar) telegramm: @impxrfect</p>
                </div>
            `
        })
    }
}

module.exports = EmailService