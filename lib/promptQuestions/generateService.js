var prompt = require('prompt');
var assign = require('lodash.assign');
var generateDays = require('./generateDaysWorked');
var yesNoQuestion = require('./yesNoQuestion');

var generateService = {
  description: 'Generate Service Details?',
  default: 'y'
};

var serviceQuestions = [
  {
    name: 'type',
    description: 'Type of service',
    required: true
  },
  {
    name: 'rateUnit',
    description: 'Rate unit (hour, day, etc)',
    default: 'hour',
    required: true
  },
  {
    name: 'rateCurrency',
    description: 'Currency',
    required: true,
    default: '£'
  },
  {
    name: 'rateValue',
    description: 'Rate value',
    required: true,
    type: 'number'
  }
];

module.exports = (function () {

  var services = [];
  var cb;
  var options = {};

  function doPrompt() {
    yesNoQuestion(assign({}, generateService, options), function (err, answer) {
      if(!answer) {
        //all done
        return cb(null, services);
      }

      prompt.get(serviceQuestions, function (err, results) {
        var service = {
          type: results.type,
          rate: {
            unit: results.rateUnit,
            value: results.rateValue,
            currency: results.rateCurrency 
          }
        };
        service.worked = [];

        generateDays({}, function(err, results) {
          service.worked = results;
          service.billable = service.worked.reduce(function(prev, curr) {
            return prev + (curr.measurement * service.rate.value);
          }, 0);

          services.push(service);
          //ask again
          doPrompt();
        });
      });
    });
  }

  return function(opts, callback) {
    //handle no options
    if(arguments.length < 2) {
      cb = opts;
      options = {};
    } else {
      cb = callback;
      options = options;
    }

    doPrompt();
  };

})();
