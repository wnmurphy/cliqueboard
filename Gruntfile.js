module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      js: {
        // src: ['public/lib/jquery.js', 'public/lib/underscore.js','public/lib/backbone.js','public/lib/handlebars.js', 'public/client/*.js'],
        src: ['public/lib/jquery.event.drag-2.0.js','public/bower_components/angular-route/angular-route.min.js', 'public/bower_components/angular/angular.min.js', 'public/login/*.js','public/v.chat/*.js', 'public/v.tasks/*.js','public/whiteboard/*.js', 'public/app.js','public/server/*.js', 'public/test/*.js'],
        dest: 'public/dist/built.js'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
      },
      //continuous integration mode: run tests once in PhantomJS browser.
      continuous: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Chrome', 'PhantomJS']
      },
    },

    nodemon: {
      dev: {
        script: 'index.js'
      }
    },

    uglify: {
      js: {
        files:{
          'public/dist/built.min.js': ['public/dist/built.js'],
          // 'public/dist/templates.min.js': ['public/dist/templates.js']
        }
      }
    },

    jshint: {
      files:[
         [
         'public/lib/jquery.event.drag-2.0.js',
         'public/bower_components/angular-route/angular-route.min.js', 
         'public/bower_components/angular/angular.min.js', 
         'public/login/*.js',
         'public/v.chat/*.js', 
         'public/v.tasks/*.js',
         'public/whiteboard/*.js', 
         'public/app.js',
         'public/server/*.js', 
         'public/test/*.js'
         ],
      ],
      options: {
        force: 'false',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/*.js'
        ]
      }
    },

    cssmin: {
      dist:{
        files:{
          'public/dist/style.min.css': 'public/**/*css'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/**/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: [
            // 'karma start',
            'git add -A',
            'git commit -m "Pushing to production"',
            'git push heroku master'
        ].join('&&')
      }
    },
  });


  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    console.log("PORT: ", target);
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  grunt.registerTask('default', ['ngtemplates']);

  grunt.registerTask('test', [
    // 'jshint',
    // 'karma'
  ]);

  grunt.registerTask('build', [
    'test',
    'concat',
    'cssmin',
    'uglify'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('production')) {
      console.log("Pushing to production!"),
      // upload to heroku
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // 'test',
    'build',
    'upload'
  ]);
  // grunt.registerTask('heroku:prod', ['build']);
  grunt.registerTask('heroku:production', 'build');

};


//
//grunt deploy local deployment
  //build it, then turn on server local
//grunt deploy --prod
  //got to heroku
  //push to heroku
  //then heroku will autommatically catch the heroku task
  //and build it
