/*
Registers custtom functions for handlebars  files
Don't think we'll need to use this anymore, but it's here just in case.
in handlebars you can do
{{#if message}}
xx
{{/if}}
which means if message exists, do xx

handlebars doesn't support if == '' or if !=  '' , etc. so this makes it possible to do so
Just use as:

{{#ifeq message 'equalsthismessage'}}
xx
{{/ifeq}}

dont think we'll need this still but jusut in case
*/

module.exports = {
    ifeq: function(a, b, options){
      if (a === b) {
        return options.fn(this);
        }
      return options.inverse(this);
    },
    ifnoteq: function(a, b, options){
        if (a != b) { return options.fn(this); }
        return options.inverse(this);
    }
  }
