const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();



app.use(cors())
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p9sgcbw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






// verifyJWT____________________________________________________________________



    function verifyJWT (req, res, next){

        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).send('unauthorized access');
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
            if(err){
                return res.status(403).send({message: 'forbidden access'})
            }
            req.decoded = decoded = decoded;
            next();
        })

    }


// verifyJWT_____________________________________________________________________________






async function run (){
        try{

            const electricCarCollection = client.db('assignment-12').collection('electricCarList')

            const luxuryCarCollection = client.db('assignment-12').collection('luxuryCarList')

            const microBUsCarCollection = client.db('assignment-12').collection('microBusCarList')


            const  electricBookingsCollection = client.db('assignment-12').collection('electricBookings')

            const luxuryBookingsCollection =  client.db('assignment-12').collection('luxuryBookings')

            const microBusBookingsCollection = client.db('assignment-12').collection('microbusBookings')



            const usersCollection = client.db('assignment-12').collection('users')


            const addProductsCollection = client.db('assignment-12').collection('addProduct')







// verifyAdmin START_________________________________________________________________

    const verifyAdmin = async (req, res, next) => {
      
        const decodeEmail = req.decoded.email;
        const query = { email: decodeEmail };
        const user = await usersCollection.findOne(query);

        if(user?.userType !== 'Admin') {
            return res.status(403).send({message: 'forbidden access'})
        }
        next();
    }


 // verifyAdmin START_________________________________________________________________








// getting data for categories section__________________________________________________________________________________________________________________

            app.get('/electriccarlist', async(req, res) =>{
                const query = {};
                const options = await electricCarCollection.find(query).toArray();
                res.send(options);
            })



            app.get('/luxurycarlist', async(req, res) =>{
                const query = {};
                const options = await luxuryCarCollection.find(query).toArray();
                res.send(options);
            })




            app.get('/microbuscarlist', async(req, res) =>{
                const query = {};
                const options = await microBUsCarCollection.find(query).toArray();
                res.send(options);
            })

// getting data for categories section__________________________________________________________________________________________________________________




// Posting data from Modal ________________________________________________________________________________________________________
            app.post('/electricbookings', async(req, res) => {
                const booking = req.body;
                console.log(booking);
                const result = await electricBookingsCollection.insertOne(booking);
                res.send(result);
            })





            app.post('/luxurybookings', async(req, res) => {
                const booking = req.body;
                console.log(booking);
                const result = await luxuryBookingsCollection.insertOne(booking);
                res.send(result);
            })





            app.post('/microbusbookings', async(req, res) => {
                const booking = req.body;
                console.log(booking);
                const result = await microBusBookingsCollection.insertOne(booking);
                res.send(result);
            })


// Posting data from Modal ________________________________________________________________________________________________________




            // getting data for buyers myOrders START_________________________________________________________________________

            app.get('/electricbookings', verifyJWT, async(req, res) => {
                const email = req.query.email;

                const decodedEmail = req.query.email;
                if(email !== decodedEmail){
                    return res.status(403).send({message: 'forbidden access'});
                }

                const query = { email: email};
                const bookings = await electricBookingsCollection.find(query).toArray();
                res.send(bookings);
            })




            app.get('/luxurybookings', verifyJWT, async(req, res) => {
                const email = req.query.email;
                

                const decodedEmail = req.query.email;
                if(email !== decodedEmail){
                    return res.status(403).send({message: 'forbidden access'});
                }


                const query = { email: email};
                const bookings = await luxuryBookingsCollection.find(query).toArray();
                res.send(bookings);
            })





            app.get('/microbusbookings', verifyJWT, async(req, res) => {
                const email = req.query.email;
                

                 const decodedEmail = req.query.email;
                if(email !== decodedEmail){
                    return res.status(403).send({message: 'forbidden access'});
                }


                const query = { email: email};
                const bookings = await microBusBookingsCollection.find(query).toArray();
                res.send(bookings);
            })



            // getting data for buyers myOrders END _______________________________________________________________________________





            // post users data START _____________________________________________________________________________________________


                app.post('/users', async(req, res) => {
                    const user = req.body
                    const result = await usersCollection.insertOne(user);
                    res.send(result);
                })

                
            // post users data END _____________________________________________________________________________________________






//  collecting users data START___________________________________________________________           

        app.get('/users', async(req, res) =>{
            const query = {userType:'Seller'};
            const users = await usersCollection.find(query).toArray();
            res.send(users);

        })       
        
        


        app.get('/buyers', async(req, res) =>{
            const query = {userType:'Buyer'};
            const users = await usersCollection.find(query).toArray();
            res.send(users);

        })      

//  collecting users data END___________________________________________________________           






// jwt Token START ________________________________________________________________________________________


            app.get('/jwt', async(req, res) => {
                const email = req.query.email;
                const query = {email: email};
                const user = await usersCollection.findOne(query);
                if(user){
                     const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
                     return res.send({accessToken: token });
                }
               
                res.status(403).send({accessToken: ''})
            }) 


// jwt Token END ________________________________________________________________________________________










// get Admin START_______________________________________________________________________________________

        app.get('/usertype/:email', async (req, res) =>{
            const email = req.params.email;
            
            const query = { email: email};
            const user = await usersCollection.findOne(query);
            console.log(user);
            if(user.userType === 'Admin'){
                res.send({ isAdmin: "Admin" });
            }
           
        })

// / get Admin END_______________________________________________________________________________________







// post addProduct START__________________________________________________________________________________


        app.post('/addproducts', async(req, res) =>{
            const addProducts = req.body;
            const result = await addProductsCollection.insertOne(addProducts);
            res.send(result);
        })


// post addProduct END__________________________________________________________________________________







// getting AddProducts START_______________________________________________________________________________________________
// app.get('/addproducts/:id', async (req, res) => {
//     const id = req.params.id;
//     const query = { _id: ObjectId(id) };
//     const products = await addProductsCollection.findOne(query);
//     res.send(products);
// });

// getting AddProducts START_______________________________________________________________________________________________







// update product advertized___________________________________________________________________________________



app.put('/addproducts/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id)};
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            advrtized: true,
        },

    };
    const result = await addProductsCollection.updateOne(query,updateDoc, options);
    res.send(result);

});



// update product advertized___________________________________________________________________________________





// get advertized products______________________________________________________________________________________


app.get('/advrtized', async(req, res) =>{
    const query = { advrtized: true};
    const result = await addProductsCollection.find(query).toArray();
    res.send(result);
});


// get advertized products______________________________________________________________________________________







// verify seller by admin_______________________________________________________________________


app.put('/users/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id)};
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            
            verify: true,
        },

    };
    const result = await usersCollection.updateOne(query,updateDoc, options);
    res.send(result);

});

// verify seller by admin_______________________________________________________________________









// post addProduct START__________________________________________________________________________________


        app.get('/addproducts', async(req, res) => {
            const query = {};
            const getProducts = await addProductsCollection.find(query).toArray();
            res.send(getProducts);
        })


// post addProduct END__________________________________________________________________________________






// Delete AddProduct START____________________________________________________________________________________

        app.delete('/addproducts/:id', async(req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await addProductsCollection.deleteOne(filter);
            res.send(result);
        })

// Delete AddProduct END____________________________________________________________________________________








// DElete seller and buyer by Admin ____START_______________________________________________________________________


        app.delete('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })




        app.delete('/buyers/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })


// DElete seller and buyer by Admin ____START_______________________________________________________________________





        }





        finally{

        }
}
run().catch(console.log);


app.get('/', async(req, res) =>{
    res.send('assignment 12 server is running');
})


app.listen(port, () => console.log(`Assignment-12 running ${port} `))