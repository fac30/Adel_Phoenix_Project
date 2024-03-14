const express = require('express');
const { request } = require('follow-redirects').https;
const fs = require('fs');
const auth_key = Buffer.from('access_key:secret_key').toString('base64');

const options = {
  method: 'GET',
  hostname: 'api.roadgoat.com',
  port: 80,
  path: '/api/v2/destinations/new-york-ny-usa',
  headers: {
    Authorization: `Basic ${auth_key}`
  },
  maxRedirects: 20
};

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const reqApi = request(options, (response) => {
    let chunks = '';

    response.on('data', (chunk) => {
      chunks += chunk;
    });

    response.on('end', () => {
      const responseBody = JSON.parse(chunks);
      const photos = responseBody.included.filter(
        (item) => item.type === 'photo'
      );
      // Extracting photo URLs
      const photoUrls = photos.map((photo) => {
        return photo.attributes.image.medium; // or 'thumb' for thumbnail
      });
      res.json(photoUrls);
    });
  });

  reqApi.on('error', (error) => {
    console.error(error);
    res.status(500).json({ error: error.message });
  });

  reqApi.end();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});