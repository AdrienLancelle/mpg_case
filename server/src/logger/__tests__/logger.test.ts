
// Mock winston
jest.mock('winston', () => {
    const mockFormat = {
        combine: jest.fn().mockReturnValue('combined-format'),
        timestamp: jest.fn().mockReturnValue('timestamp-format'),
        printf: jest.fn((callback) => {
            const mockInfo = {
                timestamp: '2025-02-28T13:44:21.025Z',
                level: 'info',
                message: 'test message'
            };
            return callback(mockInfo);
        }),
    };

    const mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
    };

    const mockConsole = jest.fn();
    const mockFile = jest.fn();

    return {
        createLogger: jest.fn().mockReturnValue(mockLogger),
        format: mockFormat,
        transports: {
            Console: jest.fn(() => mockConsole),
            File: jest.fn(({ filename }) => {
                if (!filename) {
                    throw new Error('Cannot log to file without filename or stream.');
                }
                return mockFile;
            }),
        },
    };
});

describe('logger', () => {
    let logger: any;
    let mockCreateLogger: jest.Mock;
    let mockPrintf: jest.Mock;
    let mockConsole: jest.Mock;
    let mockFile: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();

        // Store references to mocks before requiring the module
        const winston = require('winston');
        mockCreateLogger = winston.createLogger;
        mockPrintf = winston.format.printf;
        mockConsole = new winston.transports.Console();
        mockFile = new winston.transports.File({ filename: 'combined.log' });

        // Import logger which will trigger createLogger
        logger = require('@logger').default;
    });

    it('should create logger with correct configuration', () => {
        // Assert
        const createLoggerCall = mockCreateLogger.mock.calls[0][0];

        expect(createLoggerCall).toMatchObject({
            level: 'info',
            format: 'combined-format',
        });

        expect(createLoggerCall.transports).toHaveLength(3);
        createLoggerCall.transports.forEach(transport => {
            expect(jest.isMockFunction(transport)).toBe(true);
        });
    });

    it('should format log messages correctly', () => {
        // Get the printf callback that was passed to winston
        const printfCallback = mockPrintf.mock.calls[0][0];

        // Test info level message with undefined message
        const undefinedResult = printfCallback({
            timestamp: '2025-02-28T13:44:21.025Z',
            level: 'info',
            message: undefined
        });
        expect(undefinedResult).toBe('2025-02-28T13:44:21.025Z [INFO]: undefined');

        // Test info level message
        const infoResult = printfCallback({
            timestamp: '2025-02-28T13:44:21.025Z',
            level: 'info',
            message: 'test message'
        });
        expect(infoResult).toBe('2025-02-28T13:44:21.025Z [INFO]: test message');

        // Test error level message
        const errorResult = printfCallback({
            timestamp: '2025-02-28T13:44:21.025Z',
            level: 'error',
            message: 'test error'
        });
        expect(errorResult).toBe('2025-02-28T13:44:21.025Z [ERROR]: test error');
    });

    it('should log messages', () => {
        // Act
        logger.info('test info message');
        logger.error('test error message');

        // Assert
        expect(logger.info).toHaveBeenCalledWith('test info message');
        expect(logger.error).toHaveBeenCalledWith('test error message');
    });
}); 