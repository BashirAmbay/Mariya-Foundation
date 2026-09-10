import nodemailer from 'nodemailer';

let transporter = null;

try {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
} catch (e) {
  console.warn('Nodemailer initialization warning (running in simulation mode):', e.message);
}

export async function sendEmailNotification({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM || '"Mariya Foundation" <notifications@mariyafoundation.org>';

  if (transporter && process.env.SMTP_USER !== 'placeholder@ethereal.email') {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html
      });
      console.log(`[Email Sent] Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Email Error] Failed to send email via SMTP:', err.message);
      // Still return graceful status
      return { success: false, error: err.message };
    }
  } else {
    // Development simulation mode
    console.log('--------------------------------------------------');
    console.log(`[SIMULATED EMAIL NOTIFICATION]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}`);
    console.log('--------------------------------------------------');
    return { success: true, simulated: true };
  }
}
