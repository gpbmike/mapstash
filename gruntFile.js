module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    jshint: {
      files: [
        'gruntFile.js',
        'app/**/*.js'
      ]
    },
    connect: {
      server: {
        options: {
          livereload: true
        }
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      scripts: {
        files: ['**/*.js'],
        tasks: ['jshint']
      },
      html: {
        files: ['**/*.html']
      }
    },
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'dist/'
      }
    },
    usemin: {
      html: ['dist/index.html']
    },
    copy: {
      files: {
        src: 'app/index.html',
        dest: 'dist/',
        flatten: true
      }
    },
    clean: ['dist/']
  });

  this.registerTask("dist", ['clean', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'copy', 'usemin']);

  this.registerTask("default", ["jshint", "connect", "watch"]);
};
