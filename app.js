/*
 * All required modules
 */

var   express = require('express');
var   app     = express();
const fs      = require('fs');

/*
 * All global vars
 */

var settings = {
    default_filename: '/index.html',
    base_dir: '/public'
};

/*
 * Request handler
 */

app.get('/*', function(req, res) {

  console.log();
  console.log();
  console.log('New request: ' + req.url);

  // Determin if path is valid
  var is_valid = validate_path(req.path);

  // if no file spesified in path, set default
  var final_path = get_final_path(req.path);

  // Make sure file exists
  var file_exists = fs.existsSync(__dirname + final_path);

  console.log('final_path = ' + final_path);
  console.log('file_exists = ' + file_exists);
  console.log('is_valid = ' + is_valid);

  if(file_exists) {
    console.log( 'Response: ' + __dirname + final_path );
  }

  // path is valid send file, else send 404
  if(is_valid && file_exists) {

    res.sendFile( __dirname + final_path );

  } else {
    res.send('You seem to have lost the path.')
  }
});

app.listen(3000, function() {
  console.log('Server running on port 3000');
});

/*
 *  Custom Functions
 */

function validate_path(path) {

  var path_parts = path.split('/');
  for(var p in path_parts) {
    if(path_parts[p].charAt(0) == '_') { return false; }
  }

  if(path.indexOf('..') != -1) {
    return false;
  }

  return true;

}

function get_final_path(path) {

  var path_parts = path.split('/');
  if (path_parts[(path_parts.length - 1)].indexOf('.') == -1) {
    return settings.base_dir + path + settings.default_filename;
  } else {
    return settings.base_dir + path;
  }

}
