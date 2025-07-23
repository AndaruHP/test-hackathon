const productRoute = require("./routes/product.route.js");
const express = require("express");
const dotenv = require("dotenv");
const supabase = require("./config/supabase");
const app = express();
const authRoute = require("./routes/auth.route");
const authenticate = require("./middleware/auth");
const path = require("path");
dotenv.config();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
// Example protected route
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

app.get("/", (req, res) => {
  res.send("Hello from AndaruHP :')");
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err); // Full stack trace
  res
    .status(500)
    .json({ error: "Internal server error", details: err.toString() });
});

const PORT = process.env.PORT || 3000;

// Test Supabase connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .limit(1);
    if (error) {
      console.log("Supabase connection failed:", error.message);
    } else {
      console.log("Connected to Supabase database!");
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.log("Connection failed:", error.message);
  }
};

testConnection();
