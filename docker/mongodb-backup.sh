#!/bin/bash

# Set the current date as a variable for the backup filename
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")

# Set backup directory
BACKUP_DIR="/backup/mongodb"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Get the MongoDB container name
MONGO_CONTAINER=$(docker ps --filter name=mongodb --format {{.Names}})

# Perform the backup using mongodump inside the container
docker exec $MONGO_CONTAINER mongodump --out=/data/db/backup

# Copy the backup from container to host
docker cp $MONGO_CONTAINER:/data/db/backup $BACKUP_DIR/backup_$BACKUP_DATE

# Compress the backup
cd $BACKUP_DIR
tar -czf backup_$BACKUP_DATE.tar.gz backup_$BACKUP_DATE/

# Remove the uncompressed backup directory
rm -rf backup_$BACKUP_DATE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -type f -mtime +30 -delete

# Log the backup completion
echo "Backup completed successfully on $(date)" >> $BACKUP_DIR/backup.log
