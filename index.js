require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const dns = require('node:dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let urlDB = {}

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res, next){
  let longurl = req.body['url']
  let hostname = new URL(longurl).hostname
  dns.lookup(hostname, (err, address, family) => {
    if(err){
      console.log(err)
      res.json({error: 'invalid url'})
    }else{
      let urlId = Math.floor(Math.random() * 1000)
      urlDB = {id: `${urlId}`, url: longurl}
      res.json({original_url: longurl, short_url: urlId})
    }
  });
})

app.get('/api/shorturl/:urlId', (req, res, next) => {
  if(req.params.urlId === urlDB.id){
    res.redirect(urlDB.url)
  }else{
    res.json({error: 'invalid url'})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
