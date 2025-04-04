const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// استخدام middleware لتحليل JSON
app.use(express.json());

// خدمة الملفات الثابتة من الجذر (يجب أن يكون a1.html، app.js، style.css في نفس المجلد أو مجلد ثابت محدد)
app.use(express.static(__dirname));

// عند الوصول إلى "/" إعادة ملف a1.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'a1.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
