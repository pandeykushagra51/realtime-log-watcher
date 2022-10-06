class Queue
{
    constructor()
    {
        this.items = [];
    }
    enqueue(element)
    {    
        this.items.push(element);
    }
    dequeue()
    {
        if(this.items.length==0)
            return;
        this.items.shift();
    }
    front()
    {
        if(this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    toString(){
        return this.items.toString();
    }
    getLength(){
        return this.items.length;
    }
}

module.exports = {Queue}