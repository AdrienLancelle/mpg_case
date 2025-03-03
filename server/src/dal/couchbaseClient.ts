import {connect as couchbaseConnect, Cluster} from 'couchbase';

let cluster: Cluster | null = null;

export async function connect(): Promise<Cluster> {
  const host = process.env.DB_HOST;
  const username = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;

  return couchbaseConnect(host, {
    username,
    password,
  });
}

export async function getCluster(): Promise<Cluster> {
  if (!cluster) {
    cluster = await connect();
  }
  return cluster;
}

export async function getBucket() {
  const cluster = await getCluster();
  const bucketName = process.env.DB_BUCKET;
  return cluster.bucket(bucketName);
}

export async function getCollection() {
  const bucket = await getBucket();
  return bucket.collection('_default');
}
