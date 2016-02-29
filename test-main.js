var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src',

    paths: {
        'client/bower_components/angular/angular.js',
        'client/bower_components/angular-route/angular-route.js',
        'client/bower_components/angular-mocks/angular-mocks.js',
        'https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js',
        'https://cdn.socket.io/socket.io-1.4.5.js',
        'client/lib/jquery.event.drag-2.0.js',
        "https://code.jquery.com/jquery-2.1.1.min.js",
        'https://code.jquery.com/jquery-1.11.2.min.js',

        //be careful with * might be including too much
        'client/app.js',
        'client/login/*.js',
        'client/main/*.js',
        
        // 'node_modules/expect.js/index.js',
        
        'specs/**/*.js',

        'client/bower_components/**/*.js',
    },

    shim: {
        'underscore': {
            exports: '_'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});