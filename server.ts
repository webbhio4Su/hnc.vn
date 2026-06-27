import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for sending OTP
  app.post("/api/send-otp", async (req, res) => {
    const { email, otp, type } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    // Check if credentials are set
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass || user.trim() === "" || pass.trim() === "") {
      console.warn("Gmail credentials not found. OTP will be simulated.");
      return res.json({ 
        success: true, 
        simulated: true, 
        message: "Gmail credentials not found. Simulated success." 
      });
    }

    const cleanUser = user.trim();
    const cleanPass = pass.trim().replace(/\s/g, '');

    const isReset = type === 'reset';
    const subject = isReset ? "[Học Vui Vẻ] Mã xác nhận đặt lại mật khẩu" : "[Học Vui Vẻ] Mã xác thực đăng ký tài khoản";
    const title = isReset ? "Đặt lại mật khẩu" : "Xác thực đăng ký";
    const message = isReset 
      ? `Chúng tôi nhận được yêu cầu cấp lại mật khẩu cho tài khoản <b>${email}</b>.` 
      : `Chào mừng bạn đến với Học Vui Vẻ! Để hoàn tất đăng ký cho email <b>${email}</b>, vui lòng sử dụng mã xác thực bên dưới:`;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { 
          user: cleanUser, 
          pass: cleanPass 
        },
      });

      const mailOptions = {
        from: `"Học Vui Vẻ" <${cleanUser}>`,
        to: email,
        subject: subject,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 20px; max-width: 500px; margin: auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">Học Vui Vẻ</h1>
            </div>
            <h2 style="color: #1e293b; text-align: center; font-size: 20px;">${title}</h2>
            <p style="color: #475569; line-height: 1.6;">${message}</p>
            <div style="background: #f1f5f9; padding: 25px; text-align: center; border-radius: 15px; margin: 25px 0; border: 1px dashed #cbd5e1;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #3b82f6; font-family: monospace;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 14px; text-align: center;">Mã này có hiệu lực trong vòng 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">&copy; 2026 Học Vui Vẻ - Trình học tập đỉnh cao cùng AI</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, simulated: false });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
