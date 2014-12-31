(function () {
  'use strict';
  module.exports = function (grunt) {
    // require it at the top and pass in the grunt instance
    // it will measure how long things take for performance
    //testing
    require('time-grunt')(grunt);

    // load-grunt will read the package file and automatically
    // load all our packages configured there.
    // Yay for laziness
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

      // Hint the grunt file and all files under js/
      // and one directory below
      jshint: {
        files: ['Gruntfile.js', 'js/{,*/}*.js'],
        options: {
          reporter: require('jshint-stylish')
          // options here to override JSHint defaults
        }
      },
      // Vulcanize elements.html to reduce the number of
      // network requests
      vulcanize: {
        elements: {
          options: {
            strip: true
          },
          files: {
            'element-vulcanized.html': 'elements.html'
          }
        }
      },

      'gh-pages': {
          options: {
            message: 'Content committed from Grunt gh-pages',
            dotfiles: true
        },
          // These files will get pushed to the `
          // gh-pages` branch (the default)
          src: ['**/*', '!node_modules'],
      }

    }); // closes initConfig

    // CUSTOM TASK REGISTRATION
    // Not sure if I want to register a default task as it may cause more
    // problems than it's worth. If you want it, copy the publish task and
    // rename it default.
    grunt.task.registerTask('publish', [
        'jshint',
        'gh-pages'
      ]);

  }; // closes module.exports
}()); // closes the use strict function
