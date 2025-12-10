
const express = require("express");
const { questionToSQL } = require("./llm");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/health", (req, res) => {
  console.log("Health check");
  res.json({ status: "ok" });
});

// Helper to run SQL safely
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Temporary route to test DB
app.get("/test-orders", async (req, res) => {
  try {
    const rows = await runQuery("SELECT * FROM orders");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  try {
    // 1. Ask LLM to generate SQL
    const sql = await questionToSQL(question);
    console.log("Generated SQL:", sql);

    // Basic safety: allow only SELECT queries
    const lower = sql.toLowerCase();
    if (!lower.startsWith("select")) {
      return res
        .status(400)
        .json({ error: "Only SELECT queries are allowed.", sql });
    }

    // 2. Run SQL on DB
    const rows = await runQuery(sql);

    // 3. Return raw rows for now
    res.json({ sql, rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

