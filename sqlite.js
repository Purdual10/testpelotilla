const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "resultados.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS resultados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT,
      pelotillero TEXT,
      resultado TEXT,
      goleador TEXT,
      modo TEXT
    )
  `);
});

function guardarResultado({ fecha, pelotillero, resultado, goleador, modo }, callback) {
  const stmt = db.prepare("INSERT INTO resultados (fecha, pelotillero, resultado, goleador, modo) VALUES (?, ?, ?, ?, ?)");
  stmt.run(fecha, pelotillero, resultado, goleador, modo, function (err) {
    callback(err, this.lastID);
  });
  stmt.finalize();
}

function obtenerResultados(callback) {
  db.all("SELECT * FROM resultados ORDER BY id DESC", (err, rows) => {
    callback(err, rows);
  });
}

module.exports = {
  guardarResultado,
  obtenerResultados
};
