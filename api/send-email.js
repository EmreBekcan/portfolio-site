import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'bekcann33@gmail.com',
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            New Portfolio Inquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; width: 100px;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; color: #333;">
                <a href="mailto:${email}" style="color: #007bff;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 10px 0; color: #333;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0; color: #333; white-space: pre-wrap;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #999; font-size: 12px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
      reply_to: email,
    });

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
}
