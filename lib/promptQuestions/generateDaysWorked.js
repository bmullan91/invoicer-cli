var prompt = require('prompt');
var assign = require('lodash.assign');
var yesNoQuestion = require('./yesNoQuestion');

var defaultOptions = {
  description: 'Generate the days worked for this service?',
  default: 'y'
};

var firstDayWorked = [
  {
    name: 'startDate',
    description: 'First Day of work (anything that new Date(..) will accept',
    default: (function() {
      var today = new Date();
      return (new Date(today.getFullYear(), today.getMonth())).toDateString();
    }()),
    required: true
  }
];

var didYouWorkTodayQ = function(date) {
  return [
    {
      name: 'didYouWork',
      description: 'Did you work on ' + date.toDateString() + ' (q to quit)',
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
        description: 'how much did you work?',
        type: 'number',
        default: defaultMeasurement,
        before: function(v) {
          return defaultMeasurement = v;
        }
      }
    ];
  };

})();

//TODO clean this up
var askDaysQuestion = (function() {
  var day;
  var cb;
  var days = [];
  var unit = 'hour';

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

      if(!results.didYouWork) {
        return askAgain();
      }

      prompt.get(workQuestions(), function (err, results) {
        results.date = day.toDateString();
        days.push(results);
        askAgain();
      });      
    });
  }

  function askAgain() {
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate()+1);
    doPrompt();
  }

})();

module.exports = function(options, cb) {
  if(arguments.length < 2) {
    cb = options;
    options = {};
  }

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
