import nodemailer from 'nodemailer'
import { GMAIL_HOST, MAIL_PASSWORD, MAIL_USERNAME } from '../config.js'

const SMTP_PORT = 587

export const sendMail = (to: string, subject: string, html: string) => {
  const transport = nodemailer.createTransport({
    host: GMAIL_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD
    }
  })

  const mailOptions = {
    from: `BYTESHOP <${MAIL_USERNAME}>`,
    to,
    subject,
    html
  }

  transport.sendMail(mailOptions, (err, info) => {
      if(err) {
        console.log(err)
      } else {
        console.log('Email sent to: ' + info.response)
      }
    }
  )
}