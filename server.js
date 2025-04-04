const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// خدمة الملفات الثابتة من مجلد client
app.use(express.static(path.join(__dirname, 'client')));

// عند الوصول إلى "/" إعادة ملف a1.html من داخل مجلد client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'a1.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
