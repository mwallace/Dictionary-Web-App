// Database stuff
const DATABASE_NAME = 'eng-dict';
const MONGO_URL = 'mongodb://localhost:27017/' + DATABASE_NAME;
const Database = require('./modules/database');
const myDb = new Database(MONGO_URL);
// Server stuff
const PORT = process.env.PORT || 3000;
// Express stuff
const express = require('express');
const app = express();
app.use(express.static('public'));

// Path for looking up a definition, given a word
app.get('/:word', async (req, res) => {
    const routeParams = req.params;
    const word = routeParams.word;
    const result = await myDb.findWord(word);
    res.json(result);
});

// Path for providing a definition, given a word
app.post('/:word', async (req, res) => {
    let data = '';
	req.setEncoding('utf8');
	req.on('data', (chunk) => {
		data += chunk;
    });
    req.on('end', async () => {
        const body = JSON.parse(data);
        const word = body.word;
        const definition = body.definition;
        const insertResult = await myDb.insertWord(word, definition);
        if (insertResult) {
            const findResult = await myDb.findWord(word);
            res.json(findResult);
        } else {
            res.send(null);
        }
    });
});

// All other routes
app.all('*', (req, res) => {
    res.redirect('/');
});

let server = app.listen(PORT, function () {
    console.log('Server listening on port ' + PORT);
});

function stop() {
    server.close();
}

module.exports = server;
module.exports.stop = stop;
module.exports.port = PORT;