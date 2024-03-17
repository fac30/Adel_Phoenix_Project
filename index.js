const express = require('express');
const fs = require('fs');
require('dotenv').config();
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, 'env', '.env') });

const app = express();
const port = 3000;

const HTML_FILE_PATH = path.join('public', 'index.html');

// Read the API key from environment variables
app.use(express.static(path.join(__dirname, 'public')));
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.error('API key not found in environment variables.');
    return;
}

// Read the HTML file
fs.readFile(HTML_FILE_PATH, 'utf8', (err, htmlContent) => {
    if (err) {
        console.error('Error reading HTML file:', err);
        return;
    }

    // Replace placeholder with the API key in the HTML content
    const updatedHtmlContent = htmlContent.replace('{{API_KEY}}', apiKey.trim());

    // Write the updated HTML content back to the file
    fs.writeFile(HTML_FILE_PATH, updatedHtmlContent, 'utf8', err => {
        if (err) {
            console.error('Error writing updated HTML file:', err);
            return;
        }
        console.log('API key injected into HTML file successfully.');
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});