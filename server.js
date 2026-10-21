import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Cargar variables de entorno locales
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Middleware
app.use(cors()); // Permite peticiones de origen cruzado (GitHub Pages -> Render)
app.use(express.json());
app.use(express.static('public'));

// Inicializar Gemini con la API Key alojada en variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint que recibirá las consultas
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El campo "prompt" es requerido.' });
    }

    // Modelo de alto rendimiento y bajo costo
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error('Error procesando en Gemini API:', error);
    res.status(500).json({ error: 'Error al comunicarse con la inteligencia artificial.' });
  }
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});