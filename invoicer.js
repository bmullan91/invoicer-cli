#!/usr/bin/env node

var program = require('commander');
var hogan = require('hogan');
var async = require('async');
var config = require('./config'); // This can be extendable by the user

//TODO tidy template
var defaultTemplate = hogan.compile(require('./template'));


//generators
var generateInvoice = require('./lib/promptQuestions/generateInvoice');
var generateCompany = require('./lib/promptQuestions/generateCompany');
var generateServies = require('./lib/promptQuestions/generateService');

//helper stuff
var mediator = require('./lib/invoice-mediator');
var StoreItem = require('./lib/StoreItem');

program
    .version('0.0.1')
    .option('-m, --me <path>', 'Your company JSON file')
    .option('-c, --client <path>', 'Client company JSON file')
    .option('-s, --services <path>', 'From company JSON file')
    .option('-o, --outfile <path>', 'Where do you want it to go?')
    .option('-f, --format <string>', 'json, html or csv')
    .parse(process.argv);

//run through each piece of the puzzle
async.series({

  invoice: function(cb) {
    generateInvoice(cb);
  },

  me: function(cb) {
    var storeItem = new StoreItem({ dirName: '/me', storePath: config.storePath });
    mediator({
      storeItem: storeItem,
      userArg: program.me,
      generator: generateCompany.bind(null, { description: 'Generate your company JSON?' })
    }, cb);
  },

  client: function(cb) {
    var storeItem = new StoreItem({ dirName: '/clients', storePath: config.storePath });
    mediator({
      storeItem: storeItem,
      userArg: program.me,
      generator: generateCompany.bind(null, { description: 'Generate your client JSON?' })
    }, cb);
  },

  services: function(cb) {
    mediator({
      userArg: program.services,
      generator: generateServies
    }, cb);
  }


}, function(err, data) {
  var output;

  if(!program.format || program.format === 'json') {
    output = JSON.stringify(data, null, 2);
  }

  if(program.format === 'html') {
    //TODO check for a passed template
    //mustashe compatable
    output = defaultTemplate.render(data);
  }

  if(program.format === 'csv') {
    //TODO
  }

  if(output) {
    if(program.outfile) {
      //write to file
    } else {
      process.stdout.write(output);
    }
  }

  process.exit();

});


