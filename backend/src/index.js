const cors = require("cors");
const morgan = require("morgan");
const express = require("express");

const { registerUser } = require("./use-cases/register-user");
const { showAllUser } = require("./use-cases/show-all-users");
const { loginUser } = require("./use-cases/login-user");
const { makeDoAuthMiddleware } = require("./auth/doAuthMiddleware");
const { refreshUserToken } = require("./use-cases/refresh-user-token");

const {
  getNotes,
  editNote,
  addNote,
  removeNote,
  getNoteById,
} = require("./db-access/notes-dao.js");

const PORT = process.env.PORT || 3838;
const app = express();

const doAuthMiddleware = makeDoAuthMiddleware("access");
const doRefreshTokenMiddleware = makeDoAuthMiddleware("refresh");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// app.use(express.static("uploads"));

// ==== ROUTES ====

// ==== USER ====
app.get("/users", doAuthMiddleware, async (_, res) => {
  try {
    const users = await showAllUser();
    res.json(users);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: err.toString() || "Internal Server Error." });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    const { accessToken, refreshToken } = await loginUser({
      email: req.body.email,
      password: req.body.password,
    });
    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: err.toString() || "Internal Server Error." });
  }
});

app.post("/users/refreshtoken", doRefreshTokenMiddleware, async (req, res) => {
  try {
    const userId = req.userClaims.sub;
    const accessToken = await refreshUserToken({ userId });
    res.json({ token: accessToken });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: err.toString() || "Internal Server Error." });
  }
});

app.post("/users/register", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: err.toString() || "Internal Server Error." });
  }
});

// app.get("/", (_, res) => res.send("it works :)"));

// ==== NOTES ====

app.get("/notes", (_, res) => {
  getNotes()
    .then((notes) => res.json(notes))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Failed to load notes from database." }); // internal server error
    });
});

app.post("/notes/add", doAuthMiddleware, async (req, res) => {
  try {
    const owner_id = req.userClaims.sub;

    const newNote = {
      owner_id,
      title: req.body.title,
      content: req.body.content,
      private: true,
    };

    // console.log("New Note:", newNote);
    console.log("Request-Userclaims:", req.userClaims);
    const addedNote = await addNote(newNote);
    res.json(addedNote);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: err.toString() || "Internal Server Error." });
  }
});

app.delete("/note/delete/:id([0-9a-fA-F]{24})", async (req, res) => {
  try {
    const noteId = req.params.id;
    console.log("frontend", noteId);
    const removedNote = await removeNote(noteId);
    res.json({ removedNote });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: err.toString() || "Failed to delete Note" });
  }
});

app.put("/note/edit/:id([0-9a-fA-F]{24})", async (req, res) => {
  try {
    const noteId = req.params.id;
    console.log("noteId: ", noteId);
    const editedNote = {
      id: noteId,
      title: req.body.title,
      content: req.body.content,
    };
    console.log("Editednote: ", editedNote);
    const updatedNote = await editNote(noteId, editedNote);
    res.json(updatedNote);
    console.log("Updatednote: ", updatedNote);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: err.toString() || "Failed to update Product" });
  }
});

// app.post("/products/add", (req, res) => {
//   //   if (!req.body || !req.body.productName) {
//   //     res.status(400).json({ error: "Please include a product-task." }); // 400 ==> Bad request
//   //     return;
//   //   }

//   const newProduct = {
//     title: req.body.title,
//     category: req.body.category,
//     description: req.body.description,
//     price: req.body.price,
//     stock: req.body.stock,
//     // img: req.file.filename,
//   };

//   addProduct(newProduct)
//     .then((addedProduct) => res.status(201).json(addedProduct)) // 201 => Created
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: "Failed to add product to database." });
//     });
// });

// app.delete("/products/delete/:id", (req, res) => {
//   const productId = req.params.id;
//   removeProduct(productId)
//     .then((removedProduct) => res.json({ removedProduct }))
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: "Failed to remove todo." });
//     });
// });

// 404 not found
app.use((_, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(PORT, () => console.log("Server listening on port", PORT));
