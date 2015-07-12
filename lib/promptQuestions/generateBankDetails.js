var prompt = require('prompt');
var assign = require('lodash.assign');
var yesNoQuestion = require('./yesNoQuestion');
var defaultOptions = {
  description: 'Generate Bank Details?'
};
var fields = [
  {
    name: 'name',
    description: 'Bank Name',
    required: true
  },
  {
    name: 'address',
    type: 'array',
    minItems: 3,
    maxItems: 5,
    description: 'Bank Address',
    required: true
  },
  {
    name: 'ac',
    description: 'Account number',
    required: true
  },
  {
    name: 'sc',
    description: 'Sort Code',
    required: true
  },
  {
    name: 'iban',
    description: 'IBAN Code',
    required: true
  },
  {
    name: 'swift',
    description: 'Swift Code',
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