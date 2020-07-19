let mongoose = require('mongoose');

const server = '127.0.0.1'; // REPLACE WITH YOUR DB SERVER
const database = 'chat_app_db';



class Database {
  constructor(http) {
    this._connect(http)
  }

  _connect(http) {
    mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
      .then(() => {
        require('../socket/socket')(http)
        console.log('Database Connected')

      })
      .catch(err => {
        console.error('Database connection error', err)
      })
  }
}

module.exports = (http) => new Database(http)