const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();



app.use(cors())
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p9sgcbw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run (){
        try{

            const electricCarCollection = client.db('assignment-12').collection('electricCarList')

            const luxuryCarCollection = client.db('assignment-12').collection('luxuryCarList')

            const microBUsCarCollection = client.db('assignment-12').collection('microBusCarList')


            const  electricBookingsCollection = client.db('assignment-12').collection('electricBookings')

            const luxuryBookingsCollection =  client.db('assignment-12').collection('luxuryBookings')

            const microBusBookingsCollection = client.db('assignment-12').collection('microbusBookings')



            const usersCollection = client.db('assignment-12').collection('users')





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




            // getting data for buyers myOrders_________________________________________________________________________

            app.get('/electricbookings', async(req, res) => {
                const email = req.query.email;
                
                const query = { email: email};
                const bookings = await electricBookingsCollection.find(query).toArray();
                res.send(bookings);
            })




            app.get('/luxurybookings', async(req, res) => {
                const email = req.query.email;
                
                const query = { email: email};
                const bookings = await luxuryBookingsCollection.find(query).toArray();
                res.send(bookings);
            })





            app.get('/microbusbookings', async(req, res) => {
                const email = req.query.email;
                
                const query = { email: email};
                const bookings = await microBusBookingsCollection.find(query).toArray();
                res.send(bookings);
            })



            // getting data for buyers myOrders_______________________________________________________________________________





            // post users data_____________________________________________________________________________________________


                app.post('/users', async(req, res) => {
                    const user = req.body
                    const result = await usersCollection.insertOne(user);
                    res.send(result);
                })

            // post users data_____________________________________________________________________________________________


        }





        finally{

        }
}
run().catch(console.log);


app.get('/', async(req, res) =>{
    res.send('assignment 12 server is running');
})


app.listen(port, () => console.log(`Assignment-12 running ${port} `))