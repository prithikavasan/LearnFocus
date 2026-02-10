import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ VERIFY FIRST
    await transporter.verify();
    console.log("✅ SMTP ready");

    await transporter.sendMail({
      from: `"LearnFocus Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
