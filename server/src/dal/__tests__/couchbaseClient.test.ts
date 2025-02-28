import { Cluster, Collection } from 'couchbase';

describe('couchbaseClient', () => {
    let mockCluster: jest.Mocked<Cluster>;
    let mockBucket: jest.Mocked<any>;
    let mockCollection: jest.Mocked<Collection>;
    let mockConnect: jest.Mock;
    let couchbaseClient: typeof import('../couchbaseClient');

    beforeEach(() => {
        // Reset all mocks and module cache
        jest.clearAllMocks();
        jest.resetModules();

        // Setup mock collection
        mockCollection = {
            get: jest.fn(),
            insert: jest.fn(),
            upsert: jest.fn(),
        } as unknown as jest.Mocked<Collection>;

        // Setup mock bucket
        mockBucket = {
            collection: jest.fn().mockReturnValue(mockCollection),
            defaultCollection: jest.fn().mockReturnValue(mockCollection),
        };

        // Setup mock cluster
        mockCluster = {
            bucket: jest.fn().mockReturnValue(mockBucket),
            close: jest.fn(),
        } as unknown as jest.Mocked<Cluster>;

        // Setup mock connect function
        mockConnect = jest.fn().mockResolvedValue(mockCluster);

        // Mock couchbase module
        jest.doMock('couchbase', () => ({
            connect: mockConnect
        }));

        // Import the module fresh for each test
        couchbaseClient = require('../couchbaseClient');
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('connect', () => {
        it('should connect to couchbase successfully', async () => {
            // Act
            const result = await couchbaseClient.connect();

            // Assert
            expect(mockConnect).toHaveBeenCalledWith(
                'couchbase://localhost',
                {
                    username: 'Administrator',
                    password: 'password'
                }
            );
            expect(result).toEqual(mockCluster);
        });

        it('should throw error if connection fails', async () => {
            // Setup error
            const error = new Error('Connection failed');
            mockConnect.mockRejectedValueOnce(error);

            // Act & Assert
            await expect(couchbaseClient.connect()).rejects.toThrow('Connection failed');
        });
    });

    describe('getCluster', () => {
        it('should return existing cluster if available', async () => {
            // Act - Get cluster twice
            const firstCluster = await couchbaseClient.getCluster();
            const result = await couchbaseClient.getCluster();

            // Assert
            expect(result).toEqual(firstCluster);
            expect(mockConnect).toHaveBeenCalledTimes(1); // Should only connect once
        });

        it('should create new connection if no cluster exists', async () => {
            // Act
            const result = await couchbaseClient.getCluster();

            // Assert
            expect(result).toEqual(mockCluster);
            expect(mockConnect).toHaveBeenCalledTimes(1);
        });
    });

    describe('getBucket', () => {
        it('should return bucket from cluster', async () => {
            // Arrange
            await couchbaseClient.getCluster(); // Ensure we have a cluster

            // Act
            const result = await couchbaseClient.getBucket();

            // Assert
            expect(mockCluster.bucket).toHaveBeenCalledWith('mpg');
            expect(result).toEqual(mockBucket);
        });
    });

    describe('getCollection', () => {
        it('should return collection from bucket', async () => {
            // Act
            const result = await couchbaseClient.getCollection();

            // Assert
            expect(mockBucket.collection).toHaveBeenCalledWith('_default');
            expect(result).toEqual(mockCollection);
        });
    });
}); 