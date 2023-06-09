const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose
  .connect(url)

  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name required'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v) && v.length >= 8;
      },
    },
  },
  number: String,
});

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Contacts', phonebookSchema);
