module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngAnnotate: {
        demo: {
            files: {
                'client/dist/WithAnnotationsCtrl.js': ['client/app.js', 'client/main/main.js', 'client/login/login.js','client/login/signup.js']
            },
        }
    },
    concat: {
      options: {
        separator: ';',
      },
      js: {
        // src: ['client/lib/jquery.js', 'client/lib/underscore.js','client/lib/backbone.js','client/lib/handlebars.js', 'client/client/*.js'],
        src: ['client/lib/jquery.event.drag-2.0.js'],
        dest: 'client/dist/built.js'
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
        script: 'server/server.js'
      }
    },

    uglify: {
      js: {
        files:{
          'client/dist/built.min.js': ['client/dist/built.js'],
          'client/dist/WithAnnotationsCtrl.min.js': ['client/dist/WithAnnotationsCtrl.js']
        }
      }
    },

    jshint: {
      files:[
         [
         'client/login/*.js',
         'client/app.js',
         'client/server/*.js' 
         ],
      ],
      options: {
        force: 'false',
        jshintrc: '.jshintrc',
        ignores: [
          'client/lib/**/*.js',
          'client/dist/*.js'
        ]
      }
    },

    cssmin: {
      dist:{
        files:{
          'client/dist/style.min.css': 'client/styles/*css'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'client/**/*.js',
          'client/lib/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'client/styles/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: [
            'git add .',
            'git commit -m "Pushing to production"',
            'git push heroku master'
        ].join('&&')
      }
    },
  });

  grunt.loadNpmTasks('grunt-ng-annotate');
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


  grunt.registerTask('test', [
    // 'jshint',
    // 'karma'
  ]);

  grunt.registerTask('build', [
    // 'test',
    // 'ngAnnotate',
    // 'concat',
    // 'cssmin',
    // 'uglify'
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
