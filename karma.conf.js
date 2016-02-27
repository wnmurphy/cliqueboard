
// Karma configuration
// Generated on Mon Jun 30 2014 19:35:20 GMT-0700 (PDT)

// Karma configuration
// Generated on Mon Jun 30 2014 19:35:20 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter

    frameworks: ['browserify','jasmine'],
    
    plugins : [
        'karma-browserify',
        'karma-jasmine',
        'karma-unicorn-reporter',
        'karma-nyan-reporter',
        'karma-jasmine',
        'karma-phantomjs-launcher',
        'karma-chrome-launcher',
        'karma-mocha'
    ],

      files: [

        'https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js',
        'https://cdn.socket.io/socket.io-1.4.5.js',
        'client/lib/jquery.event.drag-2.0.js',
        'client/bower_components/angular/angular.js',
        'client/bower_components/angular-route/angular-route.js',
        'client/bower_components/angular-mocks/angular-mocks.js',
        'https://code.jquery.com/jquery-1.11.2.min.js',

        //be careful with * might be including too much
        'client/app.js',
        'client/login/*.js',
        'client/v.chat/*.js',
        'client/main/*.js',
        'client/v.tasks/*.js',
        'client/v.whiteboard/*.js',

        
        // 'node_modules/expect.js/index.js',
        
        'specs/**/*.js'
      ],


    // list of files to exclude
    exclude: [
        'karma.conf.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {

    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['nyan','unicorn'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
