const express = require('express');
const router = express.Router();
const Drivers = require('../models/Driver');
const Users = require('../models/Users');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');


// Route 1: get all the Drivers of the user using GET: Login required, fetchUser is used as middleware so that it verifies the access token(id included) and in return gives the user of that id
router.get('/fetchAllDrivers', fetchUser, async (req, res) => {
    const Drivers = await Drivers.find({ user: req.user.id })
    res.json(Drivers);
})
// Route 2: Fetch all parking lot for admin.
router.get('/fetchAllDrivers_admin', async (req, res) => {
    const allDrivers = await Drivers.find({IsApproved:true})
    res.json(allDrivers);
})
// Route 3: Create a Driver using POST : Login required
router.post('/createDriver', fetchUser, async (req, res) => {
    try {
        let user = await Users.findById(req.user.id)
        console.log("Creating a new Driver with details :", req.body)
        const { Name, WalletAddress, VehicleType} = req.body; // destructuring from req.body
        const error = validationResult(req);
        if (!error.isEmpty()) {
            // console.log(error.array);
            return res.status(400).json({ errors: error.array });
        }
        const Driver = new Drivers({
            Name: Name,Email:user.email, WalletAddress: WalletAddress,user: req.user.id,VehicleType:VehicleType
        })
        const saveDrivers = await Driver.save();
        res.json(saveDrivers);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Route 4: Updating an existing Driver using PUT : Login required
router.put('/updateDriver/:id', fetchUser, async (req, res) => {

    console.log("Request for UPDATE parking lot with user id : ",req.user.id," and parking lot id : ",req.params.id);
    // create a newDriver object
    const newDriver = req.body;
    console.log("\nUpdate with these details : ",req.body);

    // find the Driver to update and update it
    let Driver = await Drivers.findById(req.params.id);
    if (!Driver) { return res.status(404).send("Not Found") }
    // to authonticate that the user is same(whose Drivers is) which is trying to update
    if (Driver.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    newDriver.IsApproved=false;
    newDriver.Status="UPDATE";
    Driver = await Drivers.findByIdAndUpdate(req.params.id, { $set: newDriver }, { new: true })
    res.json({ Driver });
})

// Route 5: Deleting an existing Driver using DELETE : Login required
router.delete('/deleteDriver/:id', fetchUser, async (req, res) => {
    console.log("Request for DELETE parking lot with user id : ",req.user.id," and parking lot id : ",req.params.id);
    let Driver = await Drivers.findById(req.params.id);
    
    if (!Driver) { return res.status(404).send("Not Found") }
    if (Driver.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    Driver = await Drivers.findByIdAndUpdate(req.params.id,{$set:{"IsApproved":false,"Status":"DELETE"}});
    res.status(200).send({"Remark":"Request is under process."});
})


// Admin approves the parking lot

router.post('/approvePL_admin/:id', async (req, res) => {
    let Driver = await Drivers.findById(req.params.id);
    if (!Driver) { return res.status(404).send("Not Found") };
    const newDriver = req.body;
    if(newDriver.Status=="NEW")
    {
        console.log("Admin :: Approved -- CREATE the parking lot with id : ",req.params.id)
        try {
            Driver = await Drivers.findByIdAndUpdate(req.params.id, { $set: { IsApproved: true } }, { new: true })
        } catch (err){
            res.status(500).send({'error':err});
        }
    }
    else if(newDriver.Status=="UPDATE")
    {
        console.log("Admin :: Approved -- UPDATE the parking lot with id : ",req.params.id)
        try {
            Driver = await Drivers.findByIdAndUpdate(req.params.id, { $set: { IsApproved: true, Status:"NEW" } }, { new: true })
        } catch (err){
            res.status(500).send({'error':err});
        }
    }
    else if(newDriver.Status=="DELETE")
    {
        console.log("Admin :: Approved -- DELETE the parking lot with id : ",req.params.id)
        try {
            Driver = await Drivers.findByIdAndDelete(req.params.id)
        } catch (err){
            res.status(500).send({'error':err});
        }
    }
    res.status(200).send("Updated successfully")
})

// Reduce parking lot size by 1 as booked by user.
router.put('/updateSlot/:id', async (req,res)=>{
    console.log("Update available slot by user")
    let pl= await Drivers.findById(req.params.id);
    if(pl.TotalSlots<=0){
        res.json({"Remark":"No free slot available for this parking lot."})
    }
    else
    {
        let Driver= await Drivers.findByIdAndUpdate(req.params.id,{$set :{TotalSlots:pl.TotalSlots-1}});
        res.status(200).json({Driver});
    }
})

module.exports = router;