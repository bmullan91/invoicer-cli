var path = require('path');
var defaultStorePath = path.join(process.env.HOME || process.env.USERDIR, 'invoicer-store');

module.exports = {
  storePath: defaultStorePath //where the generator stores it information to reuse
};