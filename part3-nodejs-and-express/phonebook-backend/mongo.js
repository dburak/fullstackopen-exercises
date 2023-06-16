const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://burakkddiker:${password}@cluster0.thl7lzy.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model('Contact', phonebookSchema);

// const contact = new Contact({
//   name: process.argv[3],
//   number: process.argv[4],
// });

// contact.save().then((result) => {
//   console.log(
//     `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
//   );
// });

Contact.find({}).then((result) => {
  console.log('phonebook: ');
  result.forEach((note) => {
    console.log(`${note.name} ${note.number}`);
  });
  mongoose.connection.close();
});
