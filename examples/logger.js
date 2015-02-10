var memoir = require('memoir');
var moment = require('moment');
var path = require('path');

var logFile = path.join(__dirname + "/../test.log");

var fileStream = new memoir.stream.FileStream(logFile);
var consoleStream = new memoir.stream.ConsoleStream();

var fileLogger = new memoir.logger.StreamLogger(fileStream);
var consoleLogger = new memoir.logger.StreamLogger(consoleStream);

function timestamp() {
  return moment().format();
}

var prefixLogger = new memoir.logger.PrefixLogger(timestamp, fileLogger);
var sequenceLogger = new memoir.logger.SequenceLogger([prefixLogger, consoleLogger]);

exports.trace = function(message) {
  sequenceLogger.writeLine('TRACE', message);
}

exports.debug = function(message) {
  sequenceLogger.writeLine('DEBUG', message);
}

exports.info = function(message) {
  sequenceLogger.writeLine('INFO', message);
}

exports.warn = function(message) {
  sequenceLogger.writeLine('WARN', message);
}

exports.error = function(message) {
  sequenceLogger.writeLine('ERROR', message);
}

exports.fatal = function(message) {
  sequenceLogger.writeLine('FATAL', message);
}
