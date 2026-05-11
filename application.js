const express = require('express');
const path = require('path');
const PORT = 3000;
const publicPath = path.join(__dirname, './');
const app = express();

app.use(express.static(publicPath));
app.get('/', (req, res) => {
    res.sendFile(publicPath);
});
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})