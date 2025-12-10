#!/bin/bash

# MongoDB Atlas Setup Script
# This will update your .env file with Atlas connection string

echo "🔧 Setting up MongoDB Atlas connection..."
echo ""

# Check if password is provided as argument
if [ -z "$1" ]; then
    echo "⚠️  Usage: ./setup-atlas.sh YOUR_PASSWORD"
    echo ""
    echo "Example: ./setup-atlas.sh mypassword123"
    echo ""
    echo "Or manually edit server/.env and update MONGODB_URI with:"
    echo "mongodb+srv://rideshare-dbvong:YOUR_PASSWORD@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true&w=majority"
    exit 1
fi

PASSWORD="$1"

# Backup current .env
cp .env .env.backup
echo "✅ Backed up .env to .env.backup"

# Update MONGODB_URI
sed -i.bak "s|MONGODB_URI=.*|MONGODB_URI=mongodb+srv://rideshare-dbvong:${PASSWORD}@cluster0.poonc1p.mongodb.net/rideshare?retryWrites=true\&w=majority|" .env

echo "✅ Updated .env with Atlas connection string"
echo ""
echo "Testing connection..."
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS: 10000}).then(() => { console.log('✅ MongoDB Atlas Connected Successfully!'); process.exit(0); }).catch(e => { console.log('❌ Connection Error:', e.message); process.exit(1); });"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup complete! Backend will connect to Atlas automatically."
else
    echo ""
    echo "⚠️  Connection test failed. Please check:"
    echo "   1. Your password is correct"
    echo "   2. Network access is allowed in Atlas"
    echo "   3. Cluster name is correct (poonc1p with number 1)"
fi

