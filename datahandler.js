const fs = require('fs');
const {Queue} = require('./queue');
const buffer = new Buffer.alloc(1024);
const maxQueueLength = 10;
const emitter = require('events').EventEmitter;

const dataChangeEvent = new emitter();
let logs = new Queue, isStarted=0;

function insertData(startAfter){
    fs.open('data.txt', (err, fd)=>{
        if(err){
            dataChangeEvent.emit('error',err);
            return;
        }

        fs.read(fd, buffer, 0, buffer.length, startAfter, (err, bytes, buffer)=>{
            if(err){
                dataChangeEvent.emit('error',err);
                return;
            }

            let data = buffer.slice(0,bytes).toString();
            let newLogs = data.split(/(?:\r\n|\r|\n)/g);
            let sliceLenght = Math.min(maxQueueLength,newLogs.length);

            newLogs.slice(-1*sliceLenght).forEach(element => {
                if(logs.getLength()>=maxQueueLength)
                    logs.dequeue();
                logs.enqueue(element);
            });
            dataChangeEvent.emit('data-changed',logs.items);
        });

    })
}

let start = ()=>{
    insertData(0);
    fs.watchFile('data.txt',(cur,prev)=>{
        console.log('file content changed');
        insertData(prev.length);
    })
}

let currentData = ()=>{
    return logs.items;
}

module.exports = {start,dataChangeEvent,currentData};



