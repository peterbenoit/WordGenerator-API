import { WordGenerator } from '../lib/WordGenerator.js';

export default function handler(req, res) {
  const { wordList = 'latin', format = 'string', limit = 10 } = req.query;

  // Initialize WordGenerator with the requested options
  const generator = new WordGenerator({ wordList });

  // Get the output in the requested format and limit
  const output = generator.getOutput(format, parseInt(limit, 10));

  // Respond with the generated output
  res.status(200).json({ output });
}
