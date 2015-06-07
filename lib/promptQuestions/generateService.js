var generateDays = require('./generateDaysWorked');
var prompt = require('prompt');

var ServicesQuestion = {
  name: 'ServicesQuestion',
  description: 'Generate a service json',
  default: 'n',
  before: function(value) { return value === 'y' || value === 'yes' }
};

var serviceGenerator = [
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
    name: 'rateValue',
    description: 'Rate value',
    required: true,
    type: 'number'
  }
];

var askAboutService = (function () {

  var services = [];
  var cb;

  function doPrompt() {
    prompt.get([ServicesQuestion], function (err, results) {
      if(results.ServicesQuestion) {
        prompt.get(serviceGenerator, function (err, results) {
          var service = {
            type: results.type,
            rate: {
              unit: results.rateUnit,
              value: results.rateValue
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

      } else {
        //all done
        cb(null, services);
      }
    });
  }


  return function(callback) {
    cb = callback;
    doPrompt();
  };



})();


module.exports = askAboutService;