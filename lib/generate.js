var async = require('async');
var write = require('write');
var path = require('path');

//generators
var generateInvoice = require('./promptQuestions/generateInvoice');
var generateCompany = require('./promptQuestions/generateCompany');
var generateServices = require('./promptQuestions/generateService');

//helper stuff
var mediator = require('./invoice-mediator');
var StoreItem = require('./StoreItem');

//template
var defaultHtmlTemplate = require('invoicer-html-template');

module.exports = function(opts, done) {
  var generatorThings = {
    invoice: function(cb) {
      generateInvoice(cb);
    },

    from: function(cb) {
      var storeItem = new StoreItem({ dirName: '/from', storePath: opts.config.storePath });
      mediator({
        description: 'Your Company Details:',
        storeItem: storeItem,
        userArg: opts.params.options.from,
        generator: generateCompany.bind(null, { description: 'Generate your company JSON?' })
      }, cb);
    },

    to: function(cb) {
      var storeItem = new StoreItem({ dirName: '/to', storePath: opts.config.storePath });
      mediator({
        description: 'Your Client\'s Details:',
        storeItem: storeItem,
        userArg: opts.params.options.to,
        generator: generateCompany.bind(null, { description: 'Generate your client\'s JSON?' })
      }, cb);
    },

    services: function(cb) {
      mediator({
        description: 'Services Provided:',
        userArg: opts.params.options.services,
        generator: generateServices
      }, cb);
    }
  };

  var questions = opts.params.thing ? generatorThings[opts.params.thing] : generatorThings;

  if(!questions) {
    opts.program.outputHelp();
    process.exit();
  }

  return async.series(questions, function handleOutput(err, data) {   
    if(err) {
      return done(err);
    }

    //currency -> total
    var due = {};

    data.services.forEach(function(service) {
      due[service.rate.currency] = due[service.rate.currency] 
        ? (due[service.rate.currency] + service.billable)
        : service.billable;
    });

    data.invoice.totalDue = Object.keys(due).map(function(currency) {
      return {
        currency: currency,
        value: due[currency]
      };
    });

    return done(err, data);
  });

};
