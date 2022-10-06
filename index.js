//const {clients,app} = require('./server');
const express = require('express');
// const {clients} = require('./server');
const app = express();
const {dataChangeEvent,currentData} = require('./datahandler')
let counter = 0
let clients = new Map;

app.use((req,res,next)=>{
    console.log('in index.js');
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    next();
});

app.get('/',(req,res)=>{
    console.log('New User entered');
    write(res,currentData());
    req.clientId=counter;
    clients.set(req.clientId,res);
    counter++;

    req.on('close',()=>{
        clients.delete(req.clientId);
        console.log(`client : ${req.clientId} is closed`);
    })
})

dataChangeEvent.on('data-changed',(logs)=>{
    clients.forEach((res)=>{
        write(res,logs);
    });
})

function write(res,logs){
    let currentLog = '';
    for(log of logs)
    currentLog+=(log+'\n');
    res.write(currentLog);
}

module.exports = {app};