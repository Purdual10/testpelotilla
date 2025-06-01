const express = require('express');
const cors = require('cors');
const path = require('path');
const { guardarResultado, obtenerResultados } = require('./sqlite');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta API para guardar resultado
app.post('/guardar', (req, res) => {
  guardarResultado(req.body, (err, id) => {
    if (err) {
      console.error('Error al guardar resultado:', err.message);
      return res.status(500).json({ error: 'Error al guardar resultado' });
    }
    res.json({ mensaje: 'Resultado guardado con éxito', id });
  });
});

// Ruta API para obtener resultados
app.get('/resultados', (req, res) => {
  obtenerResultados((err, resultados) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener resultados' });
    }
    res.json(resultados);
  });
});

// Esta ruta envía siempre el index.html para que la SPA funcione
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
