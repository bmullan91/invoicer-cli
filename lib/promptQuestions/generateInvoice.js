var prompt = require('prompt');
var assign = require('lodash.assign');
var yesNoQuestion = require('./yesNoQuestion');
var defaultOptions = {
  description: 'Generate Invoice Details?',
  default: 'y',
};

var questions = [
  {
    name: 'number',
    description: 'Invoice number / reference',
    required: true
  },
  {
    name: 'date',
    description: 'Date of Invoice',
    default: 'Todays date',
    required: true,
    before: function(value) {
      if(value === 'Todays date') {
        return (new Date()).toDateString();
      } else {
        return value;
      }
    }
  },
  {
    name: 'dueDate',
    description: 'Due date',
    default: 'Last day of the following month',
    required: true,
    before: function(value) {
      if(value === 'Last day of the following month') {
        var today = new Date();
        return (new Date(today.getFullYear(), today.getMonth()+2, 0)).toDateString();
      } else {
        return value;
      }
    }
  }
];

module.exports = function(options, cb) {
  //handle no options
  if(arguments.length < 2) {
    cb = options;
    options = {};
  }

  yesNoQuestion(assign({}, defaultOptions, options), function(err, result) {
    if(result) {
      prompt.get(questions, cb);
    } else {
      cb(null);
    }
  });
};
