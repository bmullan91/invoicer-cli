var prompt = require('prompt');
var assert = require('assert');
var write = require('write');
var cwd = process.cwd();

var questions = [
  {
    name: 'invoicesPath',
    description: 'Where do you want the invoices to be stored?',
    default: cwd + '/invoices',
    required: true
  },
  {
    name: 'storePath',
    description: 'Where do you want the generated json to be stored?',
    default: cwd + '/store',
    required: true
  }
];

module.exports = function(options, cb) {
  assert(options.configLocation);

  prompt.get(questions, function(err, results) {
    if(err) {
      return cb(err);
    }

    var data = JSON.stringify(results, null, 2);

    console.log(data);
    console.log('writing the following config to: ' + options.configLocation);

    write.sync(options.configLocation, data);
    return cb(null, results);
  });

};