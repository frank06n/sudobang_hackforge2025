import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Send WhatsApp message using Twilio
 * @param {string} to - recipient phone number in E.164 format (+1234567890)
 * @param {string} body - message content
 */
export const sendWhatsApp = (to, body) => {
  return client.messages
    .create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Twilio WhatsApp-enabled number
      to: `whatsapp:${to}`,
      body,
    })
    .then((msg) => console.log('WhatsApp message sent:', msg.sid))
    .catch((err) => console.error('WhatsApp error:', err.message));
};
