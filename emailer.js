import { google } from "googleapis";
import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const server = express();
const PORT = process.env.PORT;
server.use(express.json());
server.use(cors());

server.post("/sendmail", async (req, res) => {
  const oAuthClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oAuthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  console.log(req.body);
  try {
    console.log("im try von sendmail: ", req.body);
    const accessToken = await oAuthClient.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MYMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: process.env.MYMAIL,
      to: req.body.email,
      subject: `Anmeldung ${req.body.event}`,
      text: "hallo ich hoffe das html wird angezeigt",
      html: `<p>Hallo ${req.body.name}, danke für deine Anmeldung!<p><p>Wir freuen uns dich beim ${req.body.event} zu sehen. <br/><br/><p>Liebe Grüße</p><p>Dein Event-Pilot-Team<p/>`,
    };

    const result = await transport.sendMail(mailOptions);
    console.log("Result:", result);
    return result;
  } catch (error) {
    return error;
  }
});

server.listen(process.env.PORT, () => console.log(PORT, "rennt"));
