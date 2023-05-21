const express = require("express");
const route = express.Router();
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.json());
const fs = require("fs");

const FileName = "./Routes/Faculty.txt";
const Endpoint = "/";

const faculties = [];
let studentsJSON = async () => {
  const contents = await fs.promises.readFile(FileName, "utf8");
  const lines = contents.split("\n");

  faculties.splice(0, faculties.length);
  lines.forEach((line) => {
    const data = line.split("|");

    if(data.length > 0){
      const name = data[0];
    const type = data[1];
    const department = data[2].length > 0 ? data[2].split("\r").length > 1 ? data[2].split("\r")[0] : data[2] : "";

    const student = {
      name: name,
      type: type,
      department: department,
    };
    faculties.push(student);
    }
  });
  return faculties;
};

const appendToFile = (student, FirstData = false) => {
  const { name, type, department } = student;
  const dataToAppend = FirstData ? `${name}|${type}|${department}`: `\n${name}|${type}|${department}`;

  fs.appendFile(FileName, dataToAppend, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

const writeToFile = () => {
  let dataToWrite = '';

  faculties.forEach((student, i) => {
    dataToWrite += i == 0 ? `${student.name}|${student.type}|${student.department}` : `\n${student.name}|${student.type}|${student.department}`;
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
route.get(Endpoint + ":name", (req, res) => {
  const facultyName = req.params.name;
  studentsJSON().then((data) => {
    const item = data.find((item) => item.name === facultyName);
    res.json(item);
  });
});

// Update an item by ID
route.put(Endpoint + ":name", (req, res) => {
  const facultyName = req.params.name;
  const updatedItem = req.body;
  studentsJSON().then((data) => {
    const index = data.findIndex((item) => item.name === facultyName);
    data[index] = updatedItem;
    writeToFile();
    res.json(updatedItem);
  });
});

// Delete an item by ID
route.delete(Endpoint + ":name", (req, res) => {
  const facultyName = req.params.name;
  studentsJSON().then((data) => {
    const index = data.findIndex((item) => item.name === facultyName);
    data.splice(index, 1);
    writeToFile();
    res.sendStatus(204);
  });
});

module.exports = route;
