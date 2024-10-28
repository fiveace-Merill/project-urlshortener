require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const dns = require('node:dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const urlDB = {}

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
  let longurl = req.body
  console.log(longurl)
  res.send(longurl)
  // dns.lookup(longurl, (err, address, family) => {
  //   if(err){
  //     res.json({error: 'invalid url'})
  //   }else{
  //     let urlId = Math.floor(Math.random() * 1000)
  //     urlDB[urlId] = longurl;
  //     res.json({original_url: longurl, short_url: urlId})
  //   }
  // });
})

app.get('/api/shorturl/:urlId', (req, res) => {
  if(req.params.urlId === Object.keys(urlDB)[0]){
    res.redirect(urlDB['urlId'])
  }else{
    res.json({error: 'invalid url'})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
