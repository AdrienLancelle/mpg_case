#!/bin/bash
set -e

echo "🚀 Starting Couchbase initialization..."

# Function to check if Couchbase is ready
wait_for_couchbase() {
    echo "⏳ Waiting for Couchbase to be ready..."
    for i in {1..30}; do
        if curl -s http://127.0.0.1:8091 > /dev/null; then
            echo "✅ Couchbase is up!"
            return 0
        fi
        echo "⏳ Attempt $i/30: Couchbase not ready yet..."
        sleep 5
    done
    echo "❌ Couchbase failed to start within 150 seconds"
    return 1
}

# Start Couchbase in the background
/entrypoint.sh couchbase-server &

# Wait for Couchbase to be ready
wait_for_couchbase

echo "🔧 Configuring Couchbase cluster..."
couchbase-cli cluster-init -c 127.0.0.1 --cluster-name cluster-mpg \
    --cluster-username admin --cluster-password monpetitgazon \
    --services data,index,query --cluster-ramsize 512 --index-storage-setting default || true

echo "📦 Creating bucket..."
couchbase-cli bucket-create -c 127.0.0.1:8091 \
    --username admin --password monpetitgazon \
    --bucket mpg --bucket-type couchbase --bucket-ramsize 256 || true

echo "⏳ Waiting for bucket to be ready..."
sleep 10

echo "📝 Creating initial data..."

# Create index separately
cbq -u admin -p monpetitgazon -s "CREATE PRIMARY INDEX ON mpg;"

# Insert data
cbq -u admin -p monpetitgazon -s "
    MERGE INTO mpg USING [
        {'id': 'user_1', 'type': 'user', 'name': 'Greg'},
        {'id': 'user_2', 'type': 'user', 'name': 'Ben'},
        {'id': 'user_3', 'type': 'user', 'name': 'Theo'},
        {'id': 'user_4', 'type': 'user', 'name': 'Max'},
        {'id': 'mpg_league_1', 'type': 'mpg_league', 'adminId': 'user_1', 'name': 'la ligue 1', 'description': 'super', 'usersTeams': {'user_1': 'mpg_team_1_1', 'user_3': 'mpg_team_1_2'}},
        {'id': 'mpg_league_2', 'type': 'mpg_league', 'adminId': 'user_2', 'name': 'la ligue deux', 'description': 'top'},
        {'id': 'mpg_league_3', 'type': 'mpg_league', 'adminId': 'user_3', 'name': 'la ligue 3', 'description': 'ouais', 'usersTeams': {}},
        {'id': 'mpg_team_1_1', 'type': 'mpg_team', 'name': 'la team de Greg'},
        {'id': 'mpg_team_1_2', 'type': 'mpg_team', 'name': 'la team de Theo'}
    ] AS source
    ON KEY source.id
    WHEN NOT MATCHED THEN INSERT source;"

# Verify data
cbq -u admin -p monpetitgazon -s "SELECT * FROM mpg;"

echo "✅ Couchbase initialization completed!"

# Keep container running
tail -f /dev/null
