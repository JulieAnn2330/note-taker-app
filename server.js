/* Pseudocode
1. Understand directions
    a. Where does new file need to live?
    b. Is IT supposed to be js?
    c. What is it supposed to do?
2. App needs to be able to:
    a. Write notes -- DONE
    b. Save notes -- DONE
    c. Delete notes -- DONE
    d. Display all notes -- DONE
3. Create note taker app 
    a. Create app.js file -- DONE
4. Front end is already done -- do not edit!
5. Items app.js file needs:
    a. HTML routes
        i. get `/notes` - returns the `notes.html` file -- DONE
        ii. get `*` - returns the `index.html` file -- DONE
    b. api routes
        i. get `/api/notes` - reads db.json file and returns all notes as json -- DONE
        ii. post `/api/notes` - receives a new note and adds it to the `db.json` file via fs -- DONE
        iii. delete `/api/notes/:id` - receives a query containing id of note to delete. -- DONE
    c. Misc
        i. Way to id notes when saved -- good id system --DONE USED UUID
6. App needs a `db.json` file - this will store and retrieve notes -- This is already done. 
7. Steps needed to complete project:
    a. Create app.js file -- DONE
    b. npm init -- DONE
    c. npm install -- DONE
    d. npm i express -- DONE
    e.. npm i nodemon -- DONE
    f. script for nodemon dev so I don't have to keep restarting server -- DONE
    g. .git ignore file for node_modules -- DONE
    h. Code app.js file -- DONE
        i. Find way to connect to html files -- DONE
    i. Deploy to heroku -- notes on pg 94 of notebook
*/

const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Notes HTML & API Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
  });

  app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirName, "./Develop/public/index.html"));
  });

//Save note to db.json
app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    newNote.id = uuid.v4(),
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})

//Delete Note
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));