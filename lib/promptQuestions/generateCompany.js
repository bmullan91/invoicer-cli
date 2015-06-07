var prompt = require('prompt');
var assign = require('lodash.assign')
var yesNoQuestion = require('./yesNoQuestion');
var defaultOptions = {
  description: 'Generate Company JSON'
};
var fields = [
  {
    name: 'name',
    description: 'Company Name',
    required: true
  },
  {
    name: 'number',
    description: 'Registered company number',
    required: true
  },
  {
    name: 'address',
    type: 'array',
    minItems: 3,
    maxItems: 5,
    description: 'Company Address',
    required: true
  }
];

module.exports = function generateCompany(options, cb) {
  yesNoQuestion(assign({}, defaultOptions, options), function(err, result) {
    if(result) {
      prompt.get(fields, cb);
    } else {
      cb(null);
    }
  });
};