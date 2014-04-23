// Populate the graph with some random points
/*var points = [];

for (var i = 1; i <= 10; i++) {
  points.push({x: i, y: Math.floor(Math.random() * 50)});
}

var last_x = points[points.length - 1].x;

var defaultRandom = function () {
  points.shift();
  points.push({x: ++last_x, y: Math.floor(Math.random() * 50)});
  send_event('convergence', {points: points});
};
*/
var hours = 36;
var handleGraphiteResponse = function (err, response, body) {
  if (err) {
    logger.info(JSON.stringify(err));
  } else {
    var time = (Math.round(Date.now()/1000)-(hours * 60 * 60));
    //logger.info(JSON.stringify(response.statusCode));
    //logger.info(JSON.stringify(response.body));
    var pointsSent = [];
    for (var m = 0; m<body.length; m++) {
      var metric = body[m];
      //logger.info(JSON.stringify(metric));
      var datapoints = metric.datapoints;
      for (var d = 0; d<datapoints.length; d++) {
        //logger.info(JSON.stringify(datapoints));
        var point = datapoints[d];
        //logger.info(JSON.stringify(point));
        var pointValue = Math.round((point[0] / 10000));
        //logger.info(JSON.stringify(pointValue));
        var pointTime =  point[1] - time;
        //logger.info(JSON.stringify(time));
        //logger.info(point[1]);
        pointsSent.push({x: pointTime, y: pointValue});
      }
    }
    //logger.info(JSON.stringify(pointsSent));
    send_event('convergence', {points: pointsSent})
  }
};

var graphiteData = function () {
  var request = require('request');
  var reqOptions = {
    url: 'http://metric.contegix.com/render/',
    json: true,
    qs: {
      target: 'nonNegativeDerivative(sensu.mgmt.contegix.dssi01.cpu.total.idle)',
      from: '-' + hours + ' hours',
      format: 'json'
    }
  };
  logger.info(JSON.stringify(reqOptions));
  request(reqOptions, handleGraphiteResponse);
};

setInterval(graphiteData, 30 * 1000);