const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5,
};

function doLog(level, logger, message, meta = {}) {
  if (!message) {
    message = logger;
    logger = 'default';
  }

  const logObj = Object.assign({
    level,
    levelIndex: levels[level],
    logger,
    message,
  }, meta);

  console.log(JSON.stringify(logObj));
}

const log = {};

Object.keys(levels).forEach((level) => {
  log[level] = (logger, message, meta) => doLog(level, logger, message, meta);
});

export default log;
