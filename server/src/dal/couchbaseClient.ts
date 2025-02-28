import { connect as couchbaseConnect, Cluster } from 'couchbase';

let cluster: Cluster | null = null;

export async function connect(): Promise<Cluster> {
    const host = process.env.DB_HOST || 'couchbase://localhost';
    const username = process.env.DB_USERNAME || 'admin';
    const password = process.env.DB_PASSWORD || 'monpetitgazon';

    return couchbaseConnect(
        host,
        {
            username,
            password
        }
    );
}

export async function getCluster(): Promise<Cluster> {
    if (!cluster) {
        cluster = await connect();
    }
    return cluster;
}

export async function getBucket() {
    const cluster = await getCluster();
    return cluster.bucket('mpg');
}

export async function getCollection() {
    const bucket = await getBucket();
    return bucket.collection('_default');
}
