const nodeMailer = require('nodemailer');

class MailService{

    constructor() {
        this.transporter = nodeMailer.createTransport({
            host:process.env.MAIL_HOST,
            port:process.env.MAIL_PORT,
            auth:{user: process.env.MAIL_USER, pass:process.env.MAIL_PASSWORD},
            secure:true
        })
    }

    async sendActivationMail(to, link){
        await this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to,
            subject: 'Activation on ' + process.env.API_URL,
            text: '',
            html: `<div><h1>For activation follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>`
        })
    }
}

module.exports = new MailService;