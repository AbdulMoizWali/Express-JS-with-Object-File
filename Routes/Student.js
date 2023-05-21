const express = require("express");
const route = express.Router();
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.json());
const fs = require("fs");

const FileName = "./Routes/Student.txt";
const Endpoint = "/";

const students = [];
let studentsJSON = async () => {
  const contents = await fs.promises.readFile(FileName, "utf8");
  const lines = contents.split("\n");

  students.splice(0, students.length);
  lines.forEach((line) => {
    const data = line.split("|");

    if(data.length > 0){
      const name = data[0];
    const studentID = data[1];
    const program = data[2].length > 0 ? data[2].split("\r").length > 1 ? data[2].split("\r")[0] : data[2] : "";

    const student = {
      name: name,
      studentID: studentID,
      program: program,
    };
    students.push(student);
    }
  });
  // log(students);
  return students;
};

const appendToFile = (student, FirstData = false) => {
  const { name, studentID, program } = student;
  const dataToAppend = FirstData ? `${name}|${studentID}|${program}`: `\n${name}|${studentID}|${program}`;

  fs.appendFile(FileName, dataToAppend, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const writeToFile = () => {
  let dataToWrite = '';

  students.forEach((student, i) => {
    dataToWrite += i == 0 ? `${student.name}|${student.studentID}|${student.program}` : `\n${student.name}|${student.studentID}|${student.program}`;
  });

  fs.writeFile(FileName, dataToWrite, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Student data written to file successfully');
    }
  });
};

// Get all items
route.get(Endpoint, (req, res) => {
  studentsJSON().then((data) => {res.json(data)});
});

// Create a new item
route.post(Endpoint, (req, res) => {
  const newItem = req.body;
  studentsJSON().then((data) => {
    data.push(newItem);
    data.length == 0 ? appendToFile(newItem, true) : appendToFile(newItem);
    res.json(newItem);
  });
});

// Get a single item by ID
route.get(Endpoint + ":id", (req, res) => {
  const studentId = req.params.id;
  studentsJSON().then((data) => {
    const item = data.find((item) => item.studentID === studentId);
    res.json(item);
  });
});

// Update an item by ID
route.put(Endpoint + ":id", (req, res) => {
  const studentId = req.params.id;
  const updatedItem = req.body;
  studentsJSON().then((data) => {
    const index = data.findIndex((item) => item.studentID === studentId);
    data[index] = updatedItem;
    writeToFile();
    res.json(updatedItem);
  });
});

// Delete an item by ID
route.delete(Endpoint + ":id", (req, res) => {
  const studentId = req.params.id;
  studentsJSON().then((data) => {
    const index = data.findIndex((item) => item.studentID === studentId);
    data.splice(index, 1);
    writeToFile();
    res.sendStatus(204);
  });
});

module.exports = route;
