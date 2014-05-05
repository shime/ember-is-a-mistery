module.exports = function(grunt){
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['**/*.{js,hbs,handlebars,html}', '!js/dist/**/*'],
        tasks: ["local"]
      },
    },
    connect: {
      server: {
        options: {
          port: 3000,
          livereload: true,
          base: './'
        }
      }
    }
  });
  grunt.task.registerTask("server", ['connect:server', 'watch']);
}
