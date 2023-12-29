// Load Express
const express = require("express");
// Load EJS
const expressEjsLayouts = require("express-ejs-layouts");
// Load Flash
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
// Load Validator
const { body, validationResult, check } = require("express-validator");
// Method Override
const methodOverride = require("method-override");
// Create Express App
const app = express();
const port = 3000; // Port
// Setup Method Override Middleware
app.use(methodOverride("_method"));
// Connect to database
require("./utils/db");
// Load Contact Model
const Contact = require("./models/contact");

// Use ejs as view engine
app.set("view engine", "ejs");
app.use(expressEjsLayouts); //Third-party Middleware
app.use(express.static("public")); //Build-in Middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded Middleware untuk parsing body

// Konfigurasi Flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Halaman HOME
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    layout: "layouts/main-layout.ejs",
    active: "home",
  });
});

// Halaman ABOUT
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    layout: "layouts/main-layout.ejs",
    active: "about",
  });
});

// Halaman CONTACT/ADD
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Contact",
    layout: "layouts/main-layout.ejs",
    active: "contact",
    contact: {
      name: "",
      email: "",
      noHP: "",
    },
  });
});

// Proses tambah data
app.post(
  "/contact",
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    check("noHP").isMobilePhone("id-ID").withMessage("No. HP must be valid"),
    check("email").isEmail().withMessage("Email must be valid"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Add Contact",
        layout: "layouts/main-layout.ejs",
        active: "contact",
        errors: errors.array(),
        contact: {
          name: req.body.name,
          email: req.body.email,
          noHP: req.body.noHP,
        },
      });
    } else {
      await Contact.create({
        name: req.body.name,
        email: req.body.email,
        noHP: req.body.noHP,
      });
      req.flash("msg", "Contact added successfully!");
      res.redirect("/contact");
    }
  }
);

// Proses Delete by GET
// app.get("/contact/delete/:id?", async (req, res) => {
//   // jika id tidak ada di parameter
//   if (!req.params.id) {
//     req.flash("msg", "Error, parameter not found!");
//     res.redirect("/contact");
//     // jika id ada di parameter
//   } else {
//     let valid = false;
//     const contacts = await Contact.find();
//     for (const contact of contacts) {
//       if (contact._id == req.params.id) {
//         valid = true;
//         break;
//       }
//     }
//     if (!valid) {
//       req.flash("msg", "Error, id not found!");
//       res.redirect("/contact");
//       return;
//     }
//     const contact = await Contact.deleteOne({ _id: req.params.id });
//     req.flash("msg", "Contact deleted successfully!");
//     res.redirect("/contact");
//   }
// });

// Proses delete by DELETE
app.delete("/contact", async (req, res) => {
  await Contact.deleteMany({ _id: req.body.oid }).then((result) => {
    req.flash("msg", "Contact deleted successfully!");
    res.redirect("/contact");
  });
});

// Halaman CONTACT and DETAIL
app.get("/contact/:id?", async (req, res) => {
  // jika id tidak ada
  if (!req.params.id) {
    const contacts = await Contact.find();
    res.render("contact", {
      title: "Contact",
      layout: "layouts/main-layout.ejs",
      active: "contact",
      contacts,
      msg: req.flash("msg"),
    });
    // jika id ada
  } else {
    let valid = false;
    const contacts = await Contact.find();
    for (const contact of contacts) {
      if (contact._id == req.params.id) {
        valid = true;
        break;
      }
    }
    if (!valid) {
      req.flash("msg", "Error, id not found!");
      res.redirect("/contact");
      return;
    }
    const contact = await Contact.findOne({ _id: req.params.id });
    res.render("detail", {
      title: "Detail Contact",
      layout: "layouts/main-layout.ejs",
      active: "contact",
      contact,
    });
  }
});

// Halaman EDIT
app.get("/contact/edit/:id?", async (req, res) => {
  // jika id tidak ada
  if (!req.params.id) {
    req.flash("msg", "Error, parameter not found!");
    res.redirect("/contact");
    // jika id ada
  } else {
    let valid = false;
    const contacts = await Contact.find();
    for (const contact of contacts) {
      if (contact._id == req.params.id) {
        valid = true;
        break;
      }
    }
    if (!valid) {
      req.flash("msg", "Error, id not found!");
      res.redirect("/contact");
      return;
    }
  }
  const contact = await Contact.findOne({ _id: req.params.id });
  res.render("edit-contact", {
    title: "Edit Contact",
    layout: "layouts/main-layout.ejs",
    active: "contact",
    contact,
  });
});

// Proses Edit by POST
// app.post(
//   "/contact/update",
//   [
//     body("name").notEmpty().withMessage("Name cannot be empty"),
//     check("noHP").isMobilePhone("id-ID").withMessage("No. HP must be valid"),
//     check("email").isEmail().withMessage("Email must be valid"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       res.render("edit-contact", {
//         title: "Edit Contact",
//         layout: "layouts/main-layout.ejs",
//         active: "contact",
//         errors: errors.array(),
//         contact: req.body,
//       });
//     } else {
//       await Contact.updateOne(
//         { _id: req.body.oid },
//         {
//           $set: {
//             name: req.body.name,
//             email: req.body.email,
//             noHP: req.body.noHP,
//           },
//         }
//       )
//         .then((result) => {
//           req.flash("msg", "Contact updated successfully!");
//           res.redirect("/contact");
//         })
//         .catch((err) => {
//           req.flash("msg", err.message);
//           res.redirect("/contact");
//         });
//     }
//   }
// );

// Proses Edit by PUT
app.put(
  "/contact",
  [
    body("name").notEmpty().withMessage("Name cannot be empty"),
    check("noHP").isMobilePhone("id-ID").withMessage("No. HP must be valid"),
    check("email").isEmail().withMessage("Email must be valid"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Edit Contact",
        layout: "layouts/main-layout.ejs",
        active: "contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      await Contact.updateOne(
        { _id: req.body.oid },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            noHP: req.body.noHP,
          },
        }
      )
        .then((result) => {
          req.flash("msg", "Contact updated successfully!");
          res.redirect("/contact");
        })
        .catch((err) => {
          req.flash("msg", err.message);
          res.redirect("/contact");
        });
    }
  }
);

// Dijalankan jika path tidak ditemukan
app.use((req, res) => {
  res.status(404);
  res.render("404", {
    title: "404",
    layout: "layouts/main-layout.ejs",
    active: "404",
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
