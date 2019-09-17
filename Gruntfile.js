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
		watch: {
			jsval: {
				files: ['server.js'],
				tasks: ['jshint']
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
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');


	grunt.registerTask('runWatch', ['watch']);
}
