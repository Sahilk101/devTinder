const express = require('express');

const app = express();

app.use((req,res) =>{
    res.send('Hello Node')
})

app.listen(3000, () => {
    console.log('Server is up on port 3000');
})