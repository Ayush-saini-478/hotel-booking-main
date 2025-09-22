import transporter from "../config/nodemailer.js"
import { CURRENCY, SENDER_EMAIL } from "../config/server_config.js"

const sendMail = async ({ req, roomData, booking }) => {
    const mailOptions = {
        from: SENDER_EMAIL,
        to: req.user.email,
        subject: 'Hotel Booking Details',
        html: `
            <h2>Your Booking Details</h2>
            <p>Dear ${req.user.username},</p>
            <p>Thank you for your booking! Here are your details:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${booking._id}</li>
                <li><strong>Hotel Name: </strong> ${roomData.hotel.name}</li>
                <li><strong>Location: </strong> ${roomData.hotel.address}</li>
                <li><strong>Date: </strong> ${booking.checkInDate.toDateString()}</li>
                <li><strong>Booking Amount: </strong>${CURRENCY} ${booking.totalPrice} / night</li>
            </ul>
            <p> We look forward to welcoming you!</p>
            <p>If you need to make any changes, feel free to contact us.</p>
            <p>Once again Thank you! for choosing us!</p>
        `
    }
    await transporter.sendMail(mailOptions);
}

export default sendMail;