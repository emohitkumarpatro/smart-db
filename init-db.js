const db = require("./db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    order_date TEXT,
    FOREIGN KEY(customer_id) REFERENCES customers(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Insert sample data (only once)
  db.run(`INSERT INTO customers (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com')
  `);

  db.run(`INSERT INTO products (name, price) VALUES
    ('Product A', 10.0),
    ('Product B', 20.0)
  `);

  db.run(`INSERT INTO orders (customer_id, product_id, quantity, order_date) VALUES
    (1, 1, 3, '2024-01-10'),
    (2, 2, 5, '2024-01-12'),
    (1, 2, 2, '2024-02-01')
  `);

  console.log("DB initialized");
});

