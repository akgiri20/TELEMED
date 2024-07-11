const express = require('express');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;



// Route for /chat
 app.get('/chat', (req, res) => {
  //  res.redirect(' http://localhost:5173/');
 // window.location.href='http://127.0.0.1:5173/';
  
  res.sendFile(path.join(__dirname, 'index.html'));
 });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});