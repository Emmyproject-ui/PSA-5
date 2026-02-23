/**
 * Structured Logger Service
 * Production-ready logging with different levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    private log(level: LogLevel, message: string, context?: LogContext) {
        // In production, only log errors
        if (!this.isDevelopment && level !== 'error') {
            return;
        }

        const timestamp = new Date().toISOString();
        const logData = {
            timestamp,
            level,
            message,
            ...context,
        };

        // In development, use console
        if (this.isDevelopment) {
            switch (level) {
                case 'debug':
                    console.debug(`[${timestamp}] DEBUG:`, message, context || '');
                    break;
                case 'info':
                    console.info(`[${timestamp}] INFO:`, message, context || '');
                    break;
                case 'warn':
                    console.warn(`[${timestamp}] WARN:`, message, context || '');
                    break;
                case 'error':
                    console.error(`[${timestamp}] ERROR:`, message, context || '');
                    break;
            }
        }

        // TODO: In production, send to error reporting service
        // if (level === 'error') {
        //   errorReporter.captureException(new Error(message), { extra: context });
        // }
    }

    debug(message: string, context?: LogContext) {
        this.log('debug', message, context);
    }

    info(message: string, context?: LogContext) {
        this.log('info', message, context);
    }

    warn(message: string, context?: LogContext) {
        this.log('warn', message, context);
    }

    error(message: string, context?: LogContext) {
        this.log('error', message, context);
    }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();
