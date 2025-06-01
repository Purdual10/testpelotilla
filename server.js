import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;
(async () => {
  db = await open({
    filename: './partidos.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS partidos (
      id_partido TEXT PRIMARY KEY,
      nombre_lugar TEXT,
      fecha_hora_partido TEXT,
      fecha_limite_apuesta TEXT,
      resultado TEXT,
      goleadores TEXT,
      modo TEXT
    )
  `);
})();

// Servir archivos estáticos en /public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para guardar partido
app.post('/admin/guardar', async (req, res) => {
  const { id_partido, nombre_lugar, fecha_hora_partido, fecha_limite_apuesta, resultado, goleadores, modo } = req.body;

  if (!id_partido || !nombre_lugar || !fecha_hora_partido || !fecha_limite_apuesta || !resultado || !modo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    await db.run(`
      INSERT INTO partidos (id_partido, nombre_lugar, fecha_hora_partido, fecha_limite_apuesta, resultado, goleadores, modo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id_partido) DO UPDATE SET
        nombre_lugar=excluded.nombre_lugar,
        fecha_hora_partido=excluded.fecha_hora_partido,
        fecha_limite_apuesta=excluded.fecha_limite_apuesta,
        resultado=excluded.resultado,
        goleadores=excluded.goleadores,
        modo=excluded.modo
    `, [id_partido, nombre_lugar, fecha_hora_partido, fecha_limite_apuesta, resultado, goleadores, modo]);

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error guardando en la base de datos' });
  }
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
