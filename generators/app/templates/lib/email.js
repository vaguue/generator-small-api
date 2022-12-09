import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const dev = (process.env.NODE_ENV || global.env) !== 'production';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function send({ to, subject, text, html, images }) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: Array.isArray(to) ? to.join(', ') : to, 
    subject, 
    text,
    html,
    attachments: [],
  });
  const msg = `Message sent: ${info.messageId}`;
  console.log(msg);
  return msg;
};

export default send;
