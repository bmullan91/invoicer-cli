var fs = require('fs');
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
  var userArg = options.userArg;
  var generator = options.generator;

  if(userArg) {
    //read it
    if(!fs.existsSync(program.me)) {
      return cb('ERROR: file ' + program.me + ' does not exist');
    }

    var data = fs.readFileSync(program.me, { encoding: 'utf8' });
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