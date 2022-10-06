const {start} = require('./datahandler');
const {app} = require('./index');
const PORT = process.env.PORT||3000;
const clients = new Map;

start();
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}`));

//export default {app,clients};
module.exports = {clients};
