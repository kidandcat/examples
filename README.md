# Express API Architecture

- express-api.js  ->  Server, independent
- api  ->  Folder containing API independent files


## Usage
 
 Load api files in express-api.js like:
 
        app.use('/', require('./api/buy'));

Then run node express-api.js.
