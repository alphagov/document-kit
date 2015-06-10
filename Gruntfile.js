module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'dist/<%= pkg.name %>.min.css': 'src/css/<%= pkg.name %>.scss'
        }
      }
    },
    watch: {
      files: ['src/**/*'],
      tasks: ['sass', 'uglify', 'sync']
    },
    sync: {
      main: {
        files: [{
          cwd: 'src/images',
          src: ['**'],
          dest: 'dist/images',
          filter: 'isFile'
        }],
        updateAndDelete: true
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      target: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['src/js/vendor/*.js','src/js/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sync');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'uglify', 'sync']);

};
