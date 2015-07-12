# invoicer


A simple way to generate invoices, via a cli utility.

## installation

`npm install invoicer-cli -g`

## usage


### `invoicer init`

Create a new folder where you want to store the json files and invoices that are generated.

TODO insert GIF

`mkdir my-invoices && cd my-invoices`

Running `invoicer init` will prompt you for some basic information:

- Where to store the invoices (default is `cwd/invoices`)
- Where to store the json files (default is `cwd/store`)

This store the information within `cwd/.invoicer-config.json`:

```json
{
  "invoicesPath": "/path/to/invoices",
  "storePath": "/path/to/store"
}
```

- Generate your first invoice (y/n) - TODO



### `invoicer generate`

This will prompt the user with all the necessary information to generate an invoice.

TODO insert GIF

Arguments:

- `--from` (path) from company JSON file 
- `--to` (path) to company JSON file
- `--services` (path) services JSON file
- `-t, --template` html | csv | json or path to a custom template, see below (link) 
- `-o, --outfile` file to output the invoice (default stdout)


### `invoicer generate [thing]`

Use this when you want to generate pieces of JSON directly.

**thing** can be:

- `from`
- `to`
- `services`
- `service.worked`

JSON is output to stdout.


## templates

A template needs to have two pieces of information:

 - format
 - render function

To specify your own template pass a file path as the -t option.

```js
module.exports = {
  format: 'html',
  render: function htmlTemplate(data, cb) {

    if(badThing) {
        return cb(new Error('oops'));
      }
      
      //render the template or something...
      var html = template.render(data);
      
      return cb(null, html);
  }
};
```

The default html template is a seperate [module](https://www.npmjs.com/package/invoicer-html-template).
