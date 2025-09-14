import nodemailer from 'nodemailer';
import { SMTP_PASS, SMTP_USER } from './server_config';

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: "",//smtp hoster
    port: 587,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});


export default transporter;