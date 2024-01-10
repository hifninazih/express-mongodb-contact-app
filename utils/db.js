// Local Database
// const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/wpu");

//Atlas Database
const dotenv = require("dotenv");
dotenv.config();

const URI = process.env.MONGODB_CONNECT_URI;
const mongoose = require("mongoose");
mongoose.connect(URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

// const Contact = mongoose.model("contact", {
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//   },
//   noHP: {
//     type: String,
//     required: true,
//   },
// });
// Add Data
// const contact1 = new Contact({
//   name: "Hifnienazih",
//   email: "hifnies@mail.com",
//   noHP: "0895324232s4",
// });

// const contact2 = new Contact({
//   name: "2HifniHif",
//   email: "2hifnie@mail.com",
//   noHP: "20895324234",
// });

// const contact3 = new Contact({
//   name: "3HifniHif",
//   email: "3hifnie@mail.com",
//   noHP: "30895324234",
// });

// Save Data to collection
// contact1.save().then((result) => console.log(result));

// Contact.find().then((contacts) => console.log(contacts));
