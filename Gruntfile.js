module.exports = function(grunt){
	grunt.initConfig({
		watch: {
			js: {
				files: [‘js/*.js’, ‘!js/*.min.js’],
				tasks: [‘jshint’, ‘uglify']
			}
		},
		jshint: {
			files: [‘js/*.js’, ‘!js/*.min.js’],
			options: {
				esversion: 6
			}
		},
		uglify: {
      my_target: {
        files: {
          'js/server.min.js': ['js/server.js']
        }
      }
    }
	});

	grunt.loadNpmTasks(‘grunt-contrib-watch’);
	grunt.loadNpmTasks(‘grunt-contrib-jshint’);
	grunt.loadNpmTasks(‘grunt-contrib-uglify-es’);

	grunt.registerTask('runWatch', ['watch'])
};
