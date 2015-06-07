var prompt = require('prompt');
var assign = require('lodash.assign');
var yesNoQuestion = require('./yesNoQuestion');

var firstDayWorked = [
  {
    name: 'startDate',
    description: 'First Day of work (anything that new Date(..) will accept',
    default: (function() {
      var today = new Date();
      return (new Date(today.getFullYear(), today.getMonth(), 2)).toUTCString();
    }()),
    required: true
  }
];

var didYouWorkTodayQ = function(date) {
  return [
    {
      name: 'didYouWork',
      description: 'Did you work on ' + date.toUTCString() + ' (q to quit)',
      default: 'y',
      before: function(value) {
        if(value === 'q') {
          return value;
        } else {
          return value === 'y' || value === 'yes'
        }
      }
    }
  ];
};

var workQuestions = (function() {

  var defaultProject = '';
  var defaultMeasurement = '';
  var defaultUnit = '';

  return function(unit) {
    defaultUnit = unit || defaultUnit;
    return [
      {
        name: 'project',
        description: 'What project where you working on?',
        default: defaultProject,
        before: function(v) {
          return defaultProject = v;
        }
      },
      {
        name: 'measurement',
        description: 'how much / many ' + defaultUnit + ' did you work?',
        type: 'number',
        default: defaultMeasurement,
        before: function(v) {
          return defaultMeasurement = v;
        }
      }
    ];
  };

})();



var askDaysQuestion = (function() {

  var day;
  var cb;
  var days = [];
  var unit = 'hour'; // TODO pass through

  return function(date, callback) {
    day = (date instanceof Date) ? date : new Date(date);
    cb = callback;
    days = [];
    doPrompt();
  };

  function doPrompt() {

    prompt.get(didYouWorkTodayQ(day), function (err, results) {
      if(results.didYouWork === 'q') {
        return cb(null, days);
      }

      if(results.didYouWork) {
        prompt.get(workQuestions(), function (err, results) {
          results.date = day.toUTCString();
          days.push(results);

          day = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
          //ask again
          doPrompt();
        });
      } else {
        day = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
        //ask again
        doPrompt();
      }

    });
  }

})();

module.exports = function(options, cb) {
  //handle no options
  if(arguments.length < 2) {
    cb = options;
    options = {};
  }

  var defaultOptions = {
    description: 'Generate days worked JSON?',
  };

  yesNoQuestion(assign({}, defaultOptions, options), function(err, result) {
    if(result) {
      prompt.get(firstDayWorked, function(err, results) {
        askDaysQuestion(results.startDate, cb);
      });
    } else {
      cb(null, []);
    }
  });

};
