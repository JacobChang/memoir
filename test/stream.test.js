var should = require('should');
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var stream = require('../lib/stream');

var logContent = 'content';
var logFile = path.join(__dirname + '/stream.log');

var lowEnd = 5;
var highEnd = 100;

describe('FileStream', function() {
  describe('writeLine', function() {
    it('should write log content to log file', function(done) {
      var fileStream = new stream.FileStream(logFile);
      fileStream.writeLine(logContent);
      fileStream.close(function(err, result) {
        should.not.exist(err);
        assert.equal(result, true, 'result should be true');
        var fileContent = fs.readFileSync(logFile, {
          flag: 'r',
          encoding: 'utf8'
        });
        fileContent.should.equal(logContent + '\n', 'file content shoud be ' + logContent);
        fs.unlinkSync(logFile);
        done();
      });
    });
  });
});

describe('FileStream', function() {
  describe('writeLine', function() {
    it('should write multiple log content to log file', function(done) {
      var fileStream = new stream.FileStream(logFile);
      var logNumber = Math.floor(Math.random() * (highEnd - lowEnd) + lowEnd);
      var contents = "";
      for(var i = 0; i < logNumber; i++) {
        fileStream.writeLine(logContent);
        contents = contents + logContent + "\n";
      }
      fileStream.close(function(err, result) {
        should.not.exist(err);
        assert.equal(result, true, 'result should be true');
        var fileContent = fs.readFileSync(logFile, {
          flag: 'r',
          encoding: 'utf8'
        });
        fileContent.should.equal(contents, 'file content shoud be ' + contents);
        fs.unlinkSync(logFile);
        done();
      });
    });
  });
});

describe('BufferStream', function() {
  describe('writeLine', function() {
    it('should store message in messages', function(done) {
      var bufferStream = new stream.BufferStream();
      bufferStream.writeLine(logContent);

      bufferStream.close(function(err, result) {
        bufferStream.messages.length.should.equal(1, 'messages length should be 1');
        bufferStream.messages[0].should.equal(logContent, 'message[0] should be ' + logContent);
        done();
      });
    });
  });
});

describe('BufferStream', function() {
  describe('writeLine', function() {
    it('should store message in messages', function(done) {
      var bufferStream = new stream.BufferStream();
      var logNumber = Math.floor(Math.random() * (highEnd - lowEnd) + lowEnd);
      for(var i = 0; i < logNumber; i++) {
        bufferStream.writeLine(logContent);
      }

      bufferStream.close(function(err, result) {
        bufferStream.messages.length.should.equal(logNumber, 'messages length should be ' + logNumber);
        for(var i = 0; i < logNumber; i++) {
          bufferStream.messages[i].should.equal(logContent, 'message[i] should be ' + logContent);
        }
        done();
      });
    });
  });
});
