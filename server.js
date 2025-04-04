const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// استخدام middleware لتحليل JSON
app.use(express.json());

// خدمة الملفات الثابتة من مجلد client
app.use(express.static(path.join(__dirname, 'client')));

// API للتحقق من رمز التفعيل
app.post('/api/verify', (req, res) => {
  const { code } = req.body;
  // نقوم بتقسيم الرموز من ملف .env وتقليم أي مسافات زائدة
  const allowedCodes = process.env.ALLOWED_CODES.split(',').map(c => c.trim());
  console.log("Received code:", code);
  console.log("Allowed codes:", allowedCodes);
  
  if (allowedCodes.includes(code)) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// عند الوصول إلى "/" إعادة ملف a1.html من داخل مجلد client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'a1.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
