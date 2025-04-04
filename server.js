const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// استخدام middleware لتحليل JSON
app.use(express.json());

// خدمة الملفات الثابتة من مجلد client
app.use(express.static('client'));

// API للتحقق من رمز التفعيل
app.post('/api/verify', (req, res) => {
  const { code } = req.body;
  const allowedCodes = process.env.ALLOWED_CODES.split(',');
  
  if (allowedCodes.includes(code)) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// تشغيل الخادم على المنفذ المحدد
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});