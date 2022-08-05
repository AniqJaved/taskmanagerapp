const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error,client)=>{
    if(error){
        return error;
    }

    const db = client.db(databaseName);

    ////////////////////////////////////////
    //Inserting the documents in collecction
    ////////////////////////////////////////


    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Clean the house',
    //         completed: true
    //     },
    //     {
    //         description: 'Renew inspection',
    //         completed: false
    //     },
    //     {
    //         description: 'Go to place',
    //         completed: true
    //     }
    // ],(error,result) => {
    //     if(error){
    //         return console.log("Unable to insert");
    //     }
    //     console.log(result);
    // });



    ////////////////////////////////////
    //Finding the document in collection
    ////////////////////////////////////

    //Finding the last inserted document
    // db.collection('tasks').find({}).sort({_id:-1}).limit(1).toArray((error,task)=>{  //Here sort id:-1 is sorting in desccedning order and then limit(1) is just grabbing the first field of collection.
    //     console.log(task);
    // });

    // db.collection('tasks').find({completed: true}).toArray((error,tasks)=>{
    //     console.log(tasks);
    // })


    ///////////////////////////////
    //Updating the document////////
    ///////////////////////////////

    // Unlink the insert and find we are gonna use promise, instead of callbacks. As in insertMany we are passing
    // a callback as second argument but here we are going to use the promise which returns only then if the request
    // is fulfilled and catch if we get an error/

    // db.collection('tasks').updateMany({
    //     completed: true
    // },{
    //     $set: {
    //         completed: true
    //     }
    // }).then((result)=>{
    //     console.log(result);
    // }).catch((error)=>{
    //     console.log(error);
    // })


    ////////////////////////////////
    //Deleting the document/////////
    ////////////////////////////////

    // db.collection('tasks').deleteMany({
    //     description: "Clean the house"
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log("Unable to delete")
    // });


    
    console.log("Connected successfully")
})