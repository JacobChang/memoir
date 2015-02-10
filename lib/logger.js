var util = require('util');
var EventEmitter = require('events').EventEmitter;

var TRACE = 10;
var DEBUG = 20;
var INFO = 30;
var WARN = 40;
var ERROR = 50;
var FATAL = 60;

var LogLevel = {
  'trace': TRACE,
  'debug': DEBUG,
  'info': INFO,
  'warn': WARN,
  'error': ERROR,
  'fatal': FATAL
}

function NopLogger() {
}

NopLogger.prototype.write = function(level, msg) {
}

NopLogger.prototype.writeLine = function(level, msg) {
}

function StreamLogger(stream) {
  EventEmitter.call(this);

  this.stream = stream;
  this.msgBuffer = [];
}
util.inherits(StreamLogger, EventEmitter);

StreamLogger.prototype.write = function(message) {
  this.msgBuffer.push(message);
}

StreamLogger.prototype.writeLine = function(level, msg) {
  var line;
  if(this.msgBuffer.length) {
    this.msgBuffer.push(level);
    this.msgBuffer.push(msg);

    line = this.msgBuffer.join(' ');
    this.msgBuffer = [];
  } else {
    line = level + ' ' + msg;
  }

  this.stream.writeLine(line);
}

function PrefixLogger(prefix, logger) {
  this.prefix = prefix;
  this.logger = logger;
}

PrefixLogger.prototype.writeLine = function(level, msg) {
  var prefix = this.prefix(level, msg);
  this.logger.write(prefix);
  this.logger.writeLine(level, msg);
}

function SequenceLogger(loggers) {
  this.loggers = loggers;
}

SequenceLogger.prototype.write = function(level, msg) {
  this.loggers.forEach(function(logger) {
    logger.write(level, msg);
  });
}

SequenceLogger.prototype.writeLine = function(level, msg) {
  this.loggers.forEach(function(logger) {
    logger.writeLine(level, msg);
  });
}

function PredicateLogger(predicate, loggers) {
  this.predicate = predicate;
  this.loggers = loggers;
}

PredicateLogger.prototype.write = function(level, msg) {
  var index = this.predicate(level, msg);
  var logger = this.loggers[index];
  if(logger) {
    logger.write(level, msg);
  }
}

PredicateLogger.prototype.writeLine = function(level, msg) {
  var index = this.predicate(level, msg);
  var logger = this.loggers[index];
  if(logger) {
    logger.writeLine(level, msg);
  }
}

exports.TRACE = TRACE;
exports.DEBUG = DEBUG;
exports.INFO = INFO;
exports.WARN = WARN;
exports.ERROR = ERROR;
exports.FATAL = FATAL;

exports.NopLogger = NopLogger;
exports.StreamLogger = StreamLogger;
exports.PrefixLogger = PrefixLogger;
exports.SequenceLogger = SequenceLogger;
exports.PredicateLogger = PredicateLogger;
