import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured.' });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: messages.slice(-20),
      temperature: 0.7
    });
    res.json({ reply: response.choices[0]?.message?.content || 'No response.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while contacting the AI.' });
  }
});

app.listen(port, () => console.log(`darkAI running at http://localhost:${port}`));
