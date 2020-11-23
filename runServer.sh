#! /bin/bash
val=$(fuser 9911/tcp)
pid=${val/9911/tcp:/}
echo "${pid}" | xargs kill
echo "{\"PROD\": true}" > process.json
node serverDist/src/server/server.js &
