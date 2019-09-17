module.exports = function (grunt){

	grunt.initConfig({
		jshint: {
			files: ['server.js'],
			options: {
				esversion: 6,
				globals:{
					jQuery: true
				}
			}
		},
		uglify: {
			my_target: {
				files: {
					'server.min.js': ['server.js']
				},
				options: {
					esversion: 6
				}
			}
		},
		watch: {
			jsval: {
				files: ['server.js'],
				tasks: ['jshint', 'uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');

	grunt.registerTask('default', ['watch']);
}
