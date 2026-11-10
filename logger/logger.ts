import * as winston from 'winston';
import colors from '@colors/colors';
import '../config/load-env';

// Define the custom format
const myFormat = winston.format.printf(({ level, message }) => {
  const msgStr =
    typeof message === 'string' ? message : JSON.stringify(message);

  const timestamp = new Date().toLocaleString('en-GB', {
    timeZone: 'Europe/London',
    hour12: false,
  });

  let colorizedMessage = msgStr;

  switch (level) {
    case 'error':
      colorizedMessage = colors.red(msgStr);
      break;

    case 'warn':
      colorizedMessage = colors.yellow(msgStr);
      break;

    case 'info':
      colorizedMessage = colors.green(msgStr);
      break;
  }
  return `${timestamp} [${level.toUpperCase()}]: ${colorizedMessage}`;
});

// Create a logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(winston.format.timestamp(), myFormat),
  transports: [new winston.transports.Console()],
});

export default logger;
