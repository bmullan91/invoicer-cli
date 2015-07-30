#!/usr/bin/env node

var program = require('commander');
var write = require('write');
var path = require('path');
var fs = require('fs');

var configFilename = '.invoicer-config.json';
var StoreItem = require('./lib/StoreItem');

//commands
var initCommand = require('./lib/init');
var generateCommand = require('./lib/generate');

//templates
var defaultHtmlTemplate = require('invoicer-html-template');

program
  .command('init')
  .description('Initialise a new directory to store and generate invoices')
  .action(function init() {
    var options = {
      configLocation: process.cwd() + '/' + configFilename
    };

    initCommand(options, function(err, data) {
      //done..
      //prompt user if they wish to generate an invoice?
    });
  });

program
  .command('generate [thing]')
  .description('generate things!')
  .option('--from <path>', 'Your company JSON file')
  .option('--to <path>', 'Client company JSON file')
  .option('--services <path>', 'Services JSON file')
  .option('-t, --template', 'json|html|csv or path to template function')
  .option('-o, --outfile <path>', 'Where do you want it to go?')
  .action(function generate(thing, options) {
    if(!fs.existsSync(path.join(process.cwd(), configFilename))) {
      console.log('no config file found, run: $ invoicer init');
      process.exit();
    }

    var config = require(path.join(process.cwd(), configFilename));
    var opts = {
      config: config,
      program: program,
      params: {
        thing: thing,
        options: options
      }
    };

    opts.params.options.template = thing ? 'json' : (opts.params.options.template || 'html');

    generateCommand(opts, function(err, data) {
      if(err || !data || !Object.keys(data).length) {
        if(err) {
          console.log(err);
        }

        program.outputHelp();
        process.exit();
      }

      var output;
      var filename;
      var jsonOutput = JSON.stringify(data, null, 2);

      switch(opts.params.options.template) {
        case 'html':
          output = defaultHtmlTemplate.render(data);
          filename = data.invoice.number + '.' + defaultHtmlTemplate.format;
        break;

        case 'csv':
          //TODO
        break;

        case 'json':
          output = jsonOutput;
          filename = data.invoice
            ? data.invoice.number
            : 'generated-' + (thing || '');
          filename += '.json';
        break;

        default:
          //todo
          //use passed template..
          //check it exists
          //require it and call the render function
        break;
      }

      if(!output) {
        console.log('.... something bad happend?');
        return;
      }

      if(thing) {
        //ouput JSON to stdout
        return console.log(output);
      }

      //1. write to store/invoices as a copy of the json
      var storeItem = new StoreItem({ dirName: '/invoices', storePath: opts.config.storePath });
      storeItem.save((data.invoice.number + '.json'), jsonOutput);

      //2. write the user specifies outfile or invoicesPath
      var outfilePath = opts.params.options.outfile || opts.config.invoicesPath;
      var invoicePath = path.join(outfilePath, filename);
      write.sync(invoicePath, output);

      console.log('\nNew invoice created at:\n' + invoicePath + '\n');
    });
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit();
}
