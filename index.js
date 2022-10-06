//const {clients,app} = require('./server');
const express = require('express');
// const {clients} = require('./server');
const app = express();
const {start,dataChangeEvent} = require('./datahandler')
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
    res.write('hello world');
    req.clientId=counter;
    clients.set(req.clientId,res);
    counter++;
    start(req,res);

    req.on('close',()=>{
        clients.delete(req.clientId);
        console.log(`client : ${req.clientId} is closed`);
    })

//    res.send('You are at Homepage, go to logs to see details');
})

dataChangeEvent.on('data-changed',(data)=>{
    clients.forEach((res)=>{
        for(lines of data){
    //        let curLine = lines.toString()+'\n';
            res.write(lines.toString());
        }
    });
})

module.exports = {app};