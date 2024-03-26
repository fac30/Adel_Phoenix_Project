const express = require('express');
const fs = require('fs');
require('dotenv').config();
const dotenv = require('dotenv');
const path = require('path');
const openai = require('openai');

const app = express();
const port = 3000;

const HTML_FILE_PATH = path.join('public', 'index.html');

dotenv.config({ path: path.join(__dirname, 'env', '.env') });

// Read the API key from environment variables
app.use(express.static(path.join(__dirname, 'public')));
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    console.error('OpenAI API key not found in environment variables.');
    return;
}

// Read the HTML file
fs.readFile(HTML_FILE_PATH, 'utf8', (err, htmlContent) => {
    if (err) {
        console.error('Error reading HTML file:', err);
        return;
    }

    // Replace placeholder with the OpenAI API key in the HTML content
    const updatedHtmlContent = htmlContent.replace('{{OPENAI_API_KEY}}', openaiApiKey.trim());

    // Write the updated HTML content back to the file
    fs.writeFile(HTML_FILE_PATH, updatedHtmlContent, 'utf8', err => {
        if (err) {
            console.error('Error writing updated HTML file:', err);
            return;
        }
        console.log('OpenAI API key injected into HTML file successfully.');
    });
});

// Set up OpenAI API client
const ai = new openai.OpenAI(openaiApiKey);

// Endpoint to generate responses using ChatGPT
app.post('/generate-response', express.json(), (req, res) => {
    const { prompt } = req.body;

    // Use the OpenAI API to generate a response
    ai.chat.completions.create({
        prompt,
        model: "gpt-3.5-turbo",
      })
    .then(response => {
        res.json({ response: response.data.choices[0].text.trim() });
    })
    .catch(error => {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'An error occurred while generating the response.' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
