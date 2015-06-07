var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');


function StoreItem(options) {
  this.dirName = options.dirName;
  this.storePath = options.storePath;
}

StoreItem.prototype.save = function(fileName, data) {

  var loc = this.storePath + this.dirName + '/' + fileName;
  var dir = path.dirname(loc);

  if(!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  }

  fs.writeFileSync(loc, JSON.stringify(data, null, 2));

};

StoreItem.prototype.load = function(fileName) {
  //check it exits
  return fs.readFileSync(this.storePath + this.dirName +'/' + fileName, { encoding: 'utf8' });
}

StoreItem.prototype.listItems = function(options) {
  options = options || {};
  var sort = (options.sort !== undefined) ? options.sort : true;

  if(!fs.existsSync(this.storePath + this.dirName)) {
    return [];
  }

  if(!sort) {
    return fs.readdirSync(this.storePath + this.dirName);
  }

  return fs.readdirSync(this.storePath + this.dirName)
    .map(function(file) {return parseInt(file.slice(0, file.indexOf('.json')), 10); })
    .sort(function(a, b) { return b-a;})
    .map(function(item) { return item+'.json'; })
};

StoreItem.prototype.getLatest = function(options) {
  var latest = this.listItems()[0];
  return latest ? this.load(latest) : null;
}

module.exports = StoreItem;