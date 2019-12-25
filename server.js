const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = 'eng-dict';
const MONGO_URL = 'mongodb://localhost:27017/' + DATABASE_NAME;

const express = require('express');
const app = express();

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

    async insertWord(word, def) {
        if (!this.isConnected) {
            await this.connect();
        }
        const doc = {
            word: word,
            def: def
        };
        try {
            this.coll.updateOne(
                { 'word': word },
                { $set: doc },
                { upsert: true }
            )
        } catch (e) {
            console.log(e);
        }
    }

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
}

async function main() {
    const myDb = new Database(MONGO_URL);
    myDb.insertWord('new', 'foo');
    myDb.insertWord('new', 'bar');
    myDb.insertWord('new', 'baz');
    myDb.printAll();
}

//main();

app.get('/', (req, res) => {
    res.send('Jello World!\n');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Server listening on port ' + PORT);
});