"use server";

import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

const domain = process.env.NEXT_PUBLIC_APP_URL;

const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmailJoinRoomConfirm = async (
  email: string,
  roomId: string,
  roomName: string,
  hostRoomEmail: string,
) => {
  const url = `${domain}/email/join-room-confirmation/?roomId=${roomId}&email=${email}`;
  console.log(url);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Join the room confirmation</title>
      </head>
      <body>
        <div>
          <h1>Join the room - Click link to join it</h1>
          <p>Hi there,</p>
          <p>You have been invited to join the room <strong>${roomName}</strong> by <strong>${hostRoomEmail}</strong>.</p>
          <p>Click the link below to join the room:</p>
          <a href="${url}">${url}</a>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thanks!</p>
        </div>
      </body>
    </html>
    `;
  const message = {
    to: email,
    from: process.env.SMTP_EMAIL,
    cc: hostRoomEmail,
    subject: `[${siteConfig.name}] - Join the room confirmation`,
    html,
  };

  try {
    await transporter.sendMail(message);
  } catch (err) {
    console.log(err);
  }
};
