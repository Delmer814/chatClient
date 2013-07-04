var app = require('express').createServer(),
	io = require('socket.io').listen(app),
	nicknames = [];
	
app.listen(3000);

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res){
	res.sendfile(__dirname + '/style.css');
});	

io.sockets.on('connection', function(socket) {
	socket.on('nickname', function(data, callback) {
		if (nicknames.indexOf(data) != -1) {
			callback(false);
		} else{
			callback(true);
			nicknames.push(data);
			socket.nickname = data;
			console.log('Nicknames are ' + nicknames);
			io.sockets.emit('nicknames', nicknames);			
		}
	});
	
	socket.on('clickX', function(data) {
		io.sockets.emit('clickX', {
			clickX: data});
	});
	socket.on('clickY', function(data) {
		io.sockets.emit('clickY', {
			clickY: data});
	});
	socket.on('clickSize', function(data) {
		io.sockets.emit('clickSize', {
			clickSize : data});
	});
	socket.on('clickDrag', function(data) {
		io.sockets.emit('clickDrag', {
			clickDrag: data});
	});
	socket.on('clickColor', function(data) {
		io.sockets.emit('clickColor', { 
			clickColor: data});
	});
	socket.on('user message', function(data) {
		io.sockets.emit('user message', {
			nick: socket.nickname,
			message: data
		});
	});
	
	socket.on('disconnect', function() {
		if (!socket.nickname) return;
		if (nicknames.indexOf(socket.nickname) > -1) {
				nicknames.splice(nicknames.indexOf(socket.nickname), 1);
			}
			console.log('Nicknames are ' + nicknames);
			io.sockets.emit('nicknames', nicknames);
	});
});