var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var Datastore = require('nedb');
var db = new Datastore({
    filename: './db.datastore',
    autoload: true
});

app.listen(7000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var ENV = {
    env: {
        'OS_PROJECT_DOMAIN_NAME': 'default',
        'OS_USER_DOMAIN_NAME': 'default',
        'OS_PROJECT_NAME': 'admin',
        'OS_USERNAME': 'admin',
        'OS_PASSWORD': 'descargarte',
        'OS_AUTH_URL': 'http://192.168.1.101:35357/v3',
        'OS_IDENTITY_API_VERSION': '3',
        'OS_IMAGE_API_VERSION': '2'
    }
};


//ROUTES
// /new/instance/:flavor/:image/:name/:email/
app.get('/new/instance/:flavor/:image/:name/:email', function(req, res, next) {
    exec('openstack server create --flavor ' + req.params.flavor +
        ' --image ' + req.params.image +
        ' --nic net-id=bb3013bd-c02e-41df-9edd-50910efc00c5 --security-group default ' + req.params.name,
        ENV,
        function(err, stdout, stderr) {
            if (err) {
                console.log('ERROR', err);
            }
            if (stderr) {
                console.log('stderr', stderr);
                res.send('<pre>' + stderr + '</pre>');
            } else {
                var resp = cleanOut(stdout);
                var id = null;
                resp.forEach(function(d) {
                    if (d.Field == 'id') {
                        id = d.Value;
                    }
                });
                db.insert({
                    'email': req.params.email,
                    'id': id
                }, function(err, newDoc) {
                    console.log('New', newDoc);
                });
                res.json(resp);
            }
        });
});

// /list/image
app.get('/list/image', function(req, res, next) {
    exec('openstack image list',
        ENV,
        function(err, stdout, stderr) {
            if (stderr) {
                res.send('<pre>' + stderr + '</pre>');
            } else {
                res.json(cleanOut(stdout));
            }
        });
});

// /list/flavor
app.get('/list/flavor', function(req, res, next) {
    exec('openstack flavor list',
        ENV,
        function(err, stdout, stderr) {
            if (stderr) {
                res.send('<pre>' + stderr + '</pre>');
            } else {
                res.json(cleanOut(stdout));
            }
        });
});

// /status/:email
app.get('/status/:email', function(req, res, next) {
    var response = [];
    db.find({
        email: req.params.email
    }, function(err, docs) {
        docs.forEach(function(item) {
            if (item && typeof item.id !== 'undefined') {
                try {
                    var r = execSync('openstack server show ' + item.id, ENV);
                    response.push(cleanOut(r.toString('utf8')));
                } catch (e) {
                    db.remove({
                        _id: item['_id']
                    }, {}, function() {});
                }
            } else {
                db.remove({
                    _id: item['_id']
                }, {}, function() {});
            }
        });
        res.json(response);
    });

});


// /email/:ip -> `-´ separated
app.get('/email/:ip/:password', function(req, res, next) {
  console.log('Params:', req.params);
    exec('openstack server list',
        ENV,
        function(err, stdout, stderr) {
            if (stderr) {
                res.send('<pre>' + stderr + '</pre>');
            } else {
                var resp = cleanOut(stdout);
                resp.forEach(function(r){
                  if(r['Networks'].indexOf(req.params.ip.split("\n")[0]) > 0){
                    db.find({
                        id: r.ID
                    }, function(err, docs) {
                      docs.forEach(function(ee){
                        exec('echo "Tu maquina con ip ' + req.params.ip.split("\n")[0] + ' esta lista.\n Password: ' + req.params.password + '" |' + 'sendmail ' + ee.email, function(err, stdout, stderr){
                          console.log('Email log: ', stdout + stderr);
                        });
                      });
                    });
                  }
                });
            }
        });
        res.send('ok');
});






app.get('/', function(req, res, next) {
    res.send('Running');
});





app.use(function(err, req, res, next) {
    console.log('ERR', err);
    res.status(err.status || 500);
    res.send('Error ');
});



app.listen(6000, function() {
    console.log('Listening on port 7000!');
});






function cleanOut(inn) {
    var temp = inn.split("|\n");
    var props = temp.shift();
    var res = [];
    props = cleanArray(props.split('--').join(' ').split('+').join(' ').split('|').join(' ').split("\n").join(' ').split(' '));
    temp.forEach(function(t) {
        var actual = cleanArray(t.split('--').join(' ').split('+').join(' ').split('|').join(' ').split("\n").join(' ').split(' '));
        var newArray = {};
        for (var i = 0; i < actual.length; i++) {
            if (actual[i] && actual[i] != '-') {
                newArray[props[i]] = actual[i];
            }
        }
        if (Object.getOwnPropertyNames(newArray).length > 0) {
            res.push(newArray);
        }
    });

    return res;
}



function cleanArray(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i] && actual[i] != '-') {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}
