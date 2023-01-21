// third-party
import nodeMailer from "nodemailer";

// local imports
import pool from "../config/db.js";


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

    async sendActivationMail(email, nickname, code) {
        this.transponter.sendMail({
            to: email,
            text: '',
            subject: `"Best Blog Ever" account activation`,
            secure: true,
            html: `
                <div>
                    <p style="font-size: 18px;">
                        <span style="display:block; margin: 0 0 10px 0">Hello, ${nickname}!</span>
                        <span style="display:block; margin: 0 0 10px 0">
                            If you've signed in at "Best Blog Ever", use bottom code to activate
                            the account.
                        </span>
                        <span style="display:block; margin: 0 0 10px 0">
                            CODE:
                        </span>
                        <span style="display:block; font-size: 20px; margin: 0 0 10px 0; color: blueviolet;">
                            ${code}
                        </span>
                    </p>
                </div>
            `
        })
    }

    async addActivationInfo(email, code) {
        const sqlQueryDropRow = `DELETE FROM email_activation WHERE email = ?`;
        const sqlQueryInsertRow = `INSERT INTO email_activation(email, code) VALUES(?, ?)`;
        
        await pool.query(sqlQueryDropRow, email);
        await pool.query(sqlQueryInsertRow, [email, code]);
    }

    async checkActivationCode(email, code) {
        const sqlQuery = `SELECT code FROM email_activation WHERE email = ?`;
        const databaseCode = await pool.query(sqlQuery, email);
        console.log(databaseCode[0][0]);
        return databaseCode[0][0].code === code ? true : false
    }
}

export default new EmailService();