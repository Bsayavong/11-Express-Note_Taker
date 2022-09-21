// declaring express and the port
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001 ; 
const path = require('path');
const fs = require('fs');
const uniqid = require('./routes/helper');
const db = require('./db/db.json');


// setting the static location for things being referenced
app.use(express.static('public'));

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());



// url endpoints 
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// get requests 
app.get('/api/notes', (req, res) => {
  // res.sendFile(path.join(__dirname, '/db/db.json'))
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    err ? console.log(err) : res.json(JSON.parse(data))  
  })
});


// post requests
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.body} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text, id } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uniqid(),
    };
    console.log(newNote);
  

    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new review
        parsedNotes.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        ); res.sendFile(path.join(__dirname, '/public/notes.html'))
      }
    });
  }});


// letting you know what port is being used
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);