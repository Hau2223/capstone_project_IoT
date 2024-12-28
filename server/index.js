const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;
const cors = require('cors');
mongoose
  .connect(
    'mongodb+srv://nguyentrunghau220203:capstoneIoT@database1.yqcjs.mongodb.net//',
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
      // Các tùy chọn khác nếu cần thiết
    },
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB', err);
  });

app.use(cors());

app.listen(port, () => {
  console.log(`Sever running on port ${port}`);
});
