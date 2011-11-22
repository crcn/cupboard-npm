var exec = require('child_process').exec,
fs = require('fs');

/**
 * "Untouches" target projects so they appear to be updated in cupboard
 */

exports.plugin = function(router) {
	
	function findLink(path, moduleName, callback) {
		path = path + '/node_modules/' + moduleName;
		try {
			console.log(path = fs.realpathSync(path));
			callback(false, path);
		} catch(e) {
			callback(true);
		}
	}
	
	function link(path, moduleName, callback) {
		//TODO: identify project type
		exec('npm link ' + moduleName, { cwd: this.path() }, function(err, stdout, stderr) {
			console.log(stdout);
			console.error(stderr);
			
			callback(err, stdout);
		});
	}
	
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function(request) {
			
			return [{
				name: 'link',
				execute: function(data, callback) {
					
					console.log(data)
					return;
					link(this.path(), data.args.join(' '), function(err, result) {
						
					});
				}
			},
			{
				name: 'find-link',
				execute: function(data, callback) {
					
					findLink(this.path(), data.args[0], callback);
					
				}
			}]
		},
		
		
		/**
		 */
		
		'pull -multi help/item': function() {
			
			return {
				commands: [{
					command: 'link <proj>',
					desc: 'Links project against NPM'
				},
				{
					command: 'find-link <proj>',
					desc: 'Finds project link'
				}]
			};
		}
	})
}