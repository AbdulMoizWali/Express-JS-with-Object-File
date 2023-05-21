const express = require('express');
const app = express();
app.use(express.json());




const studentRouter = require("./Routes/Student");
const facultyRouter = require("./Routes/Faculty");



app.use("/api/student", studentRouter);
app.use("/api/faculty", facultyRouter);

app.listen(3000, ()=>{
    console.log("Server is listening on this port 3000");
})
