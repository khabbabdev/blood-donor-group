const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'Blood Donor Group'} <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(message);

  return info;
};

module.exports = sendEmail;
