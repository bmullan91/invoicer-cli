var fs = require('fs');
var path = require('path');
var yesNoQuestion = require('./promptQuestions/yesNoQuestion');

function savePromptToStore(options, callback) {
  var storeItem = options.storeItem;
  var fileName = options.fileName || generateFileName();

  // the actual callback prompt will invoke
  return function(err, results) {
    if(err || !results) {
      return callback(err, results);
    }

    if(storeItem) {
      storeItem.save(fileName, results);
    }

    callback(null, results);
  }
}

function generateFileName(options) {
  return Date.now() + '.json';
}

module.exports = function(options, cb) {
  options = options || {};
  var storeItem = options.storeItem;
  var userArg = options.userArg ? path.normalize(options.userArg) : null;
  var generator = options.generator;

  if(options.description) {
    console.log('\n' + options.description + '\n');
  }

  if(userArg) {
    if(!fs.existsSync(userArg)) {
      return cb('ERROR: file ' + userArg + ' does not exist');
    }

    var data = fs.readFileSync(userArg, { encoding: 'utf8' });
    //TODO validate data

    console.log(data);

    //prompt if you want to save it?
    yesNoQuestion({ description: 'Do you want to save ^ to re-use?' }, function(answer) {
      if(answer) {
        var fileName = Date.now() + '.json';
        storeItem.save(fileName, data);
      }
      cb(null, JSON.parse(data));
    });

  } else {
    var latest = storeItem ? storeItem.getLatest() : null;      

    if(!latest) {
      return generator(savePromptToStore({ storeItem: storeItem }, cb));
    }

    console.log(latest);

    //ask if you want to use it..
    yesNoQuestion({ default: 'y', description: 'Reuse the existing data above ^ ?' }, function(err, answer) {
      return answer 
        ? cb(null,  JSON.parse(latest)) 
        : generator(savePromptToStore({ storeItem: storeItem }, cb));
    });
  }

}