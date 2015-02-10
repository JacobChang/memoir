var should = require('should');
var fs = require('fs');
var stream = require('../lib/stream');
var logger = require('../lib/logger');

describe('StreamLogger', function() {
  it('should write log to stream', function() {
    var bufferStream = new stream.BufferStream();

    var level = 'debug';
    var content = 'debug log';
    var streamLogger = new logger.StreamLogger(bufferStream);
    streamLogger.writeLine(level, content);

    bufferStream.messages.length.should.equal(1, 'bufferStream should contain one message');
    bufferStream.messages[0].should.equal(level + ' ' + content, 'log message shoud be ' + level + ' ' + content);
  });
});

describe('PrefixLogger', function() {
  it('should add prefix to log', function() {
    var prefix = 'prefix';
    var prefix_func = function(level, message) {
      return prefix;
    }

    var bufferStream = new stream.BufferStream();

    var level = 'debug';
    var content = 'debug log';
    var streamLogger = new logger.StreamLogger(bufferStream);
    var prefixLogger = new logger.PrefixLogger(prefix_func, streamLogger);
    prefixLogger.writeLine(level, content);

    bufferStream.messages.length.should.equal(1, 'bufferStream should contain one message');
    bufferStream.messages[0].should.equal(prefix + ' ' + level + ' ' + content, 'log message shoud be ' + prefix + ' ' + level + ' ' + content);
  });
});

describe('SequenceLogger', function() {
  it('should write to all logger sequencely', function() {
    var bufferStreamA = new stream.BufferStream();
    var bufferStreamB = new stream.BufferStream();

    var level = 'debug';
    var content = 'debug log';
    var streamLoggerA = new logger.StreamLogger(bufferStreamA);
    var streamLoggerB = new logger.StreamLogger(bufferStreamB);
    var streamLoggers = [streamLoggerA, streamLoggerB];
    var sequenceLogger = new logger.SequenceLogger(streamLoggers);
    sequenceLogger.writeLine(level, content);

    bufferStreamA.messages.length.should.equal(1, 'bufferStream should contain one message');
    bufferStreamA.messages[0].should.equal(level + ' ' + content, 'log message shoud be ' + level + ' ' + content);

    bufferStreamB.messages.length.should.equal(1, 'bufferStream should contain one message');
    bufferStreamB.messages[0].should.equal(level + ' ' + content, 'log message shoud be ' + level + ' ' + content);
  });
});

describe('PredicateLogger', function() {
  it('should write to logger according to predicate', function() {
    var predicate = function(level, msg) {
      if(level == 'debug') {
        return 0;
      }

      if(level == 'info') {
        return 1;
      }

      return -1;
    }

    var debugStream = new stream.BufferStream();
    var infoStream = new stream.BufferStream();

    var debugLevel = 'debug';
    var debugContent = 'debug content';
    var infoLevel = 'info';
    var infoContent = 'info content';
    var debugLogger = new logger.StreamLogger(debugStream);
    var infoLogger = new logger.StreamLogger(infoStream);
    var streamLoggers = [debugLogger, infoLogger];
    var predicateLogger = new logger.PredicateLogger(predicate, streamLoggers);
    predicateLogger.writeLine(debugLevel, debugContent);
    predicateLogger.writeLine(infoLevel, infoContent);

    debugStream.messages.length.should.equal(1, 'bufferStream should contain one message');
    debugStream.messages[0].should.equal(debugLevel + ' ' + debugContent, 'log message shoud be ' + debugLevel + ' ' + debugContent);

    infoStream.messages.length.should.equal(1, 'bufferStream should contain one message');
    infoStream.messages[0].should.equal(infoLevel + ' ' + infoContent, 'log message shoud be ' + infoLevel + ' ' + infoContent);
  });
});
