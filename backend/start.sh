#!/bin/sh
set -e

echo "⏳ Waiting for MySQL at $DB_HOST:$DB_PORT..."
until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" --silent; do
  sleep 2
done

echo "✅ MySQL is ready, running init-db..."
node scripts/init-db.js

echo "🚀 Starting server..."
node app.js
