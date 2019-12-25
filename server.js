const MongoClient = require('mongodb').MongoClient;

const DATABASE_NAME = 'eng-dict';
const MONGO_URL = 'mongodb://localhost:27017/' + DATABASE_NAME;

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
        this.coll.insertOne(doc, function(err, result) {
            console.log('Document id: ' + result.insertId);
        });
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
    myDb.insertWord('new', 'new');
    myDb.printAll();
    myDb.deleteWords('new');
    myDb.printAll();
}

main();

