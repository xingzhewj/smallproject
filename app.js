/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ejs = require('ejs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', ejs.__express);
app.set('view engine', 'ejs'); // app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//映射请求
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', routes.login);
app.post('/login', routes.dologin);
app.get('/home', routes.home);
app.post('/home', routes.getInfo);
app.get('/getstudent', routes.getStudent);
app.get('/geteatstudent', routes.getEatStudent);
app.get('/menu', routes.getMenuName);
app.post('/savamenu', routes.savaMenu);
app.get('/getmenuinfo', routes.getMenuInfo);
app.get('/gettodaymenu', routes.gettodaymenu);
app.post('/savetodaystudent', routes.saveTodayStudent);
app.post('/saveUser', routes.saveUser);
app.get('/deleteUser', routes.deleteUser);
app.get('/getTodayPeople', routes.getTodayPeople);
app.post('/saveUserEdit', routes.saveUserEdit);
app.post('/saveTodayStu', routes.saveTodayStu);

app.get('/noteindex', routes.noteindex);
app.post('/notelogin', routes.noteLogin);
app.get('/note',routes.note);
app.post('/submitnote',routes.submitnote);
app.get("/notecontent",routes.notecontent);
app.get("/getNoteContent",routes.getNoteContent);
app.get("/getContentId",routes.getContentId);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});