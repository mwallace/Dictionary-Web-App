const MongoClient = require('mongodb').MongoClient;

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
        this.db = await (await MongoClient.connect(this.url, {useUnifiedTopology: true})).db();
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
    async deleteAllInstancesOf(word) {
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

module.exports = Database;