import Newsletter from "../models/Newsletter.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: true, 
  maxConnections: 5,
});


const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const buildWelcomeHtml = () => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f8f8f8;font-family:Inter,Arial,sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8f8f8;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#FF9E75,#FF4DCD);padding:40px;text-align:center;color:white;">
                <h1 style="margin:0;font-family:'Playfair Display',serif;font-size:42px;">
                  Flaire.
                </h1>
                <p style="margin:10px 0 0;font-size:16px;opacity:0.9;">
                  Ditch the Fashion. Embrace the Style.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;color:#333333;">
                <h2 style="margin-top:0;font-size:24px;">
                  ✨ You're on the list!
                </h2>
                <p style="font-size:15px;line-height:1.6;color:#555;">
                  Thanks for joining the Flaire newsletter. You'll now be the first to hear about new collections, exclusive drops, and special offers curated just for you.
                </p>
                <p style="font-size:15px;line-height:1.6;color:#555;">
                  Get ready for bold styles, fresh inspiration, and members-only perks.
                </p>
                <div style="margin:30px 0;text-align:center;">
                  <a href="https://flairsecommerce.vercel.app/collection"
                    style="display:inline-block;padding:14px 28px;border-radius:999px;
                           background:#111;color:white;text-decoration:none;
                           font-size:14px;font-weight:600;">
                    Explore Collection →
                  </a>
                </div>
                <p style="font-size:13px;color:#999;text-align:center;margin-top:30px;">
                  If you didn't subscribe, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px;text-align:center;font-size:12px;color:#999;border-top:1px solid #f1f1f1;">
                © 2026 Flaire. All rights reserved.<br/>
                <a href="#" style="color:#999;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;


export const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (!EMAIL_RE.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    
    await Newsletter.create({ email: email.toLowerCase().trim() });

    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Flaire ✨",
      html: buildWelcomeHtml(),
    };

    transporter.sendMail(mailOptions).catch((err) => {
      console.error("Failed to send welcome email:", err.message);
    });

    return res
      .status(201)
      .json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already subscribed" });
    }

    console.error("Subscription Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
