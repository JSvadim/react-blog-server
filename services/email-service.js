//third-party
import nodeMailer from "nodemailer";

class EmailService {

    constructor() {
        this.transponter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        }, {
            from: process.env.SMTP_USER
        })
    }

    async sendActivationMail( email, nickname, link ) {
        this.transponter.sendMail({
            to: email,
            text: '',
            subject: `${process.env.API_URL} account activation`,
            secure: true,
            html: `
                <div class="smtpmsg">
                    <p class="smtpmsg__message">
                        <span style="display:block; margin: 0 0 10px 0">Hello, ${nickname}!</span>
                        If you've signed in at ${process.env.API_URL}, use bottom link to activate
                        the account.
                    </p>
                    <a class="smtpmsg__activate-link" href="${link}" target="_blank">
                        Activate the account
                    </a>
                </div>
                <style>
                    .smtpmsg__message {
                        font-size: 18px; 
                        margin: 0 0 30px 0;
                    }
                    .smtpmsg__activate-link {
                        background-color: blueviolet; 
                        display: inline-block; 
                        border-radius: 20px; 
                        padding: 10px 25px;
                        color: white;
                        transition: all 0.5s;
                    }
                    .smtpmsg__activate-link:hover {
                        border-radius: 5px;
                    }
                </style>
            `
        })
    }
}

export default new EmailService();