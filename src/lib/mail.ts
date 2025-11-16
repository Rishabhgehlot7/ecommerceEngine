
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // You would configure your email provider here.
    // For example, for Gmail:
    // service: 'gmail',
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASS,
    // },
    
    // For development, we can use a service like Ethereal to preview emails
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
    },
});

export async function sendPasswordResetEmail(to: string, url: string) {
    console.log('--- PASSWORD RESET ---');
    console.log(`Sending password reset link to ${to}`);
    console.log(`Link: ${url}`);
    console.log('----------------------');

    // This is a placeholder. In a real app, you would uncomment and configure this.
    /*
    const mailOptions = {
        from: '"BlueCart" <no-reply@bluecart.com>',
        to: to,
        subject: 'Reset Your Password',
        html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${url}">${url}</a>
            <p>If you didn't request this, you can ignore this email.</p>
        `,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        // You can get a URL to preview the email on Ethereal.email
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email.');
    }
    */
}
