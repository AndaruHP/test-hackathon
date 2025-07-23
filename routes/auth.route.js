const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Supabase signup error:", error); // Log full error
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (e) {
    console.error("Unexpected error:", e); // Log stack trace
    res
      .status(500)
      .json({ error: "Internal server error", details: e.toString() });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// OAuth
router.post("/oauth/:provider", async (req, res) => {
  const { provider } = req.params;
  const { data, error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
