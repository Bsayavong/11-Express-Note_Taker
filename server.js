// Starts by declaring express and port
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001 ; 
const path = require('path');
const fs = require('fs');
const uniqid = require('./routes/helper');
const db = require('./db/db.json');


// Set locations for things to be referenced to
app.use(express.static('public'));

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


// URL paths/endpoints
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});


// "Get" requests
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    err ? console.log(err) : res.json(JSON.parse(data))  
  })
});


// "Post" requests
app.post('/api/notes', (req, res) => {
  // Confirmation log that post request has been received
  console.info(`${req.body} request received to add a review`);

  // Destructure objects for the items in req.body
  const { title, text, id } = req.body;

  // When the required properties are present
  if (title && text) {
    // Variable for object to be saved
    const newNote = {
      title,
      text,
      id: uniqid(),
    };
    console.log(newNote);
  
    // Obtaining existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(newNote);

        // Write new reviews back into the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Updated notes, Success!')
        ); res.sendFile(path.join(__dirname, '/public/notes.html'))
      }
    });
  }});


// Identifying which port is being used
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);