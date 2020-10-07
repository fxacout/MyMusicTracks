var db;
const mongoose = require('mongoose')

const connect =async () =>{await mongoose.connect('mongodb://localhost/tracks',{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    promiseLibrary: global.Promise,

}).then(()=>{
    console.log("Conectado correctamente")
    mongoose.Promise = global.Promise;
}).catch((err)=>{console.log(err)})}
connect();
 
 




