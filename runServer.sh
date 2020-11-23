#! /bin/bash
val=$(fuser 9911/tcp)
pid=${val/9911/tcp:/}
echo ${pid} | xargs kill 
export  PROD="true"
node serverDist/src/server/server.js &
