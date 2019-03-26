const express = require('express');
const appData = require('./data.json');
const config = require('./config/index')

var app = express();
var apiRoutes = express.Router();

var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  })
})

apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})

apiRoutes.get('/ratings', function (req, res) {
  res.json({
    error: 0,
    data: ratings
  })
})

app.use('/api', apiRoutes);
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('listening at http://localhost:' + port + '\n')
})