var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Stream() {
}

Stream.prototype.writeLine = function(message) {
}

Stream.prototype.close = function(callback) {
  process.nextTick(function() {
    callback(null, true);
  });
}

function ConsoleStream() {
  Stream.call(this);
}
util.inherits(ConsoleStream, Stream);

ConsoleStream.prototype.writeLine = function(message) {
  console.log(message);
}

function FileStream(path) {
  Stream.call(this);

  this.path = path;
  this.writeStream = fs.createWriteStream(this.path, {
    flags: 'a',
    encoding: 'utf8',
    mode: 0666
  });
}
util.inherits(FileStream, Stream);

FileStream.prototype.writeLine = function(message) {
  this.writeStream.write(message + '\n');
}

FileStream.prototype.close = function(callback) {
  if(this.writeStream) {
    this.writeStream.on('finish', function() {
      callback(null, true);
    });

    this.writeStream.on('error', function(err) {
      callback(err, false);
    });

    this.writeStream.end();
    this.writeStream.destroySoon();
    this.writeStream = null;
  }
}

function BufferStream() {
  Stream.call(this);

  this.messages = [];
}
util.inherits(BufferStream, Stream);

BufferStream.prototype.writeLine = function(message) {
  this.messages.push(message);
}

exports.Stream = Stream;
exports.ConsoleStream = ConsoleStream;
exports.FileStream = FileStream;
exports.BufferStream = BufferStream;
