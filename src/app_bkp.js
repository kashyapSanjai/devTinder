const express = require('express');
const app = express();
// const auth = require('/middlwares/Auth')
const { adminAuth, userAuth } = require("./middlwares/Auth/auth")


// app.all('/products', (req, res, next) => {
//     console.log("Products route accessed");
//     next();
// });

// app.get('/products', (req, res) => {
//     res.send("Get products");
// });

// app.post('/products', (req, res) => {
//     res.send("Create product");
// });

// app.use('/hello',(req,res)=>{
//     res.send('This is hello request handler')
// })

// app.use('/user',(req,res)=>{
//     res.send('This is user request handler')
// })


// localhost:3000/user/12345
// app.get('/user/:id',(req,res)=>{
//     console.log(req.params)
//     res.send("This is a fetch request by id")
// })

// localhost:3000/user?a=12345
// localhost:3000/user
// app.get('/user',(req,res)=>{
//     console.log(req.query)
//     res.send("This is a fetch request")
// })

// app.post('/user',(req,res)=>{
//     console.log('user data saved successfully',res)
//     res.send({firsName:'sanajy', lastName:'kashyap'})
// })

// app.patch('/user',(req,res)=>{
//     console.log('user data updated successfully')
//     res.send({firstName:'ajay'})
// })

// app.delete('/user/:id',(req,res)=>{
//     console.log(req.params)
//     console.log('user data deleted successfully')
// })

// app.use('/',(req,res,next)=>{
//     res.send('This is root route')
// })




app.get('/user', (req, res, next) => {
    console.log('user 1 log');
    // res.send('its user route 1');
    next();
}, [(req, res, next) => {
    console.log('user 2 log');
    // res.send('its user route 2');
    next();
}, (req, res, next) => {
    console.log('user 3 log');
    // res.send('its user route 3');
    next();
}], (req, res, next) => {
    console.log('user 4 log');
    res.send('its user route 4');
    next();
})


// app.get('/admin/user-data',(req, res, next)=>{
//     let token = '2542xyz';
//     let isAuthenticated = token==='2542xyz'
//     if(!isAuthenticated){
//         res.send('User not authenticated')
//     }else{
//         console.log('admin user data authrised')
//         res.send('user response send')
//         next();
//     }
// })

app.get('/admin/admin-data', adminAuth, (req, res, next) => {
    console.log('admin user data authrised')
    res.send('admin response send')
    next();
})

app.get('/admin/user-data', userAuth, (req, res, next) => {
    res.send('User response send')
    next();
})

//login not required
app.get('/user/login', (req, res, next) => {
    res.send('User login response send')
    next();
})

//login  required
app.get('/user/user-data', userAuth, (req, res, next) => {
    res.send('User response send')
    next();
})

//login  required
app.get('/user/order-data', userAuth, (req, res, next) => {
    res.send('Order response send')
    next();
})


app.get('/hello', (req, res, next) => {
    throw new Error("Hello world")
    res.send('hello response send')
    next()
})


//always try to keep error handler in last
app.use('/', (err, req, res, next) => {
    if(err){
        // console.log(err.message);
        
        res.status(401).send("something went wrong")
    }
})


app.listen(3000, () => {
    console.log("Server started successfully")
})