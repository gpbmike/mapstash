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
  grunt.loadNpmTasks('grunt-gh-pages');

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
        files: ['app/**/*.js'],
        tasks: ['jshint']
      },
      html: {
        files: ['app/**/*.html']
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
        expand: true,
        cwd: 'app/',
        src: ['*.html'],
        dest: 'dist/'
      }
    },
    clean: ['dist/'],
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    }
  });

  this.registerTask("build", ['clean', 'useminPrepare', 'concat', 'uglify', 'cssmin', 'copy', 'usemin']);

  this.registerTask("deploy", ['build', 'gh-pages']);

  this.registerTask("default", ["jshint", "connect", "watch"]);
};
