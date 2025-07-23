const productRoute = require("./routes/product.route.js");
const express = require("express");
const dotenv = require("dotenv");
const supabase = require("./config/supabase");
const app = express();
dotenv.config();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/api/products", productRoute);

app.get("/", (req, res) => {
  res.send("Hello from Node API Server Updated");
});

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
      app.listen(3000, () => {
        console.log("Server is running on port 3000");
      });
    }
  } catch (error) {
    console.log("Connection failed:", error.message);
  }
};

testConnection();
