var prompt = require('prompt');
var assign = require('lodash.assign');
var defaultQuestion = {
  name: 'yesNo',
  description: 'This is a yes or no question',
  default: 'n',
  before: function(value) { 
    return (value === 'y' || value === 'yes') 
  }
};

module.exports = function(options, callback) {
  var q = assign({}, defaultQuestion, options);

  prompt.get([q], function (err, results) {
    callback(err, results.yesNo);
  });
};