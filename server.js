const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = 'eng-dict';
const MONGO_URL = 'mongodb://localhost:27017/' + DATABASE_NAME;

const express = require('express');
const app = express();

app.use(express.static('public'));

// Database handles connecting to a MongDB database and manages data in the
// form of word:definition pairs.
class Database {
    constructor(url) {
        this.url = url;
        this.db = null;
        this.coll = null;
        this.isConnected = false;
    }

    async connect() {
        this.db = await (await MongoClient.connect(this.url)).db(); 
        this.coll = this.db.collection('test');
        this.isConnected = true;
    }

    // Inserts a word:def pair if it word is not present in database.
    // Updates existing definition if word is present.
    async insertWord(word, def) {
        if (!this.isConnected) {
            await this.connect();
        }
        const doc = {
            word: word,
            def: def
        };
        let result = null;
        try {
            result = this.coll.updateOne(
                { 'word': word },
                { $set: doc },
                { upsert: true }
            )
        } catch (e) {
            console.log(e);
        }
        return result;
    }

    // For debug purposes: Prints out entire database
    async printAll() {
        if (!this.isConnected) {
            await this.connect();
        }
        const cursor = await this.coll.find();
        while( await cursor.hasNext()) {
            const result = await cursor.next();
            console.log('Word: ' + result.word + '; Definition: ' + result.def);
        }
    }

    // Clears out entry based on word provided.
    async deleteWords(word) {
        if (!this.isConnected) {
            await this.connect();
        }
        const query = {
            word: word
        }
        const result = await this.coll.deleteMany(query);
        console.log('Removed ' + result.deletedCount + ' occurences of entry ' + word);
    }

    // Looks up a word
    async findWord(word) {
        if (!this.isConnected) {
            await this.connect();
        }
        const query = {
            word: word
        } 
        const result = await this.coll.findOne(query);
        if (result !== null) {
            console.log('Found: ' + result.word + ', definition: ' + result.def);   
        }     
        return result;  
    }
}

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
        const result = await myDb.insertWord(word, definition);
        const isOkay = result ? true : false;
        res.send({OK: isOkay});
    });
});

// Basic stuff for getting server up and initializing db object
const PORT = process.env.PORT || 3000;
const myDb = new Database(MONGO_URL);

app.listen(PORT, function () {
    console.log('Server listening on port ' + PORT);
});