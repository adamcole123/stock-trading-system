import express from "express";

const app = express();

const port_no = 3000;

app.get('/', (req, res) => {
    res.send('yeet');
});

app.listen(port_no, ()=>{
    console.log(`Server listening on ports: ${port_no}`);
});