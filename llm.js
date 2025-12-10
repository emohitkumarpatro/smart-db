// llm.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// This function will ask the LLM to convert a question to SQL
async function questionToSQL(question) {
  const schemaDescription = `
  You are an assistant that converts natural language questions to SQL for a SQLite database.

  Database schema:
  - customers(id, name, email)
  - products(id, name, price)
  - orders(id, customer_id, product_id, quantity, order_date)

  Rules:
  - Only use these tables and columns.
  - Only generate SELECT queries.
  - Never use DELETE, UPDATE, INSERT, DROP, or ALTER.
  - Return ONLY the SQL query, nothing else.
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: schemaDescription },
      { role: "user", content: question },
    ],
  });

  const sql = response.choices[0].message.content.trim();
  return sql;
}

module.exports = { questionToSQL };
