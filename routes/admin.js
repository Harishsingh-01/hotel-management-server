const express = require("express");
const Room = require("../models/Room");
const User = require("../models/User");

const Booking = require("../models/Booking");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ✅ create a rooms (Admin)
router.post("/addrooms", verifyToken, adminMiddleware, async (req, res) => {
  console.log("Received Data:"+ req.body);
    console.log("User in req:", req.user); // Should come from verifyToken
    console.log("✅ Room Add Route Hit");

    try {
        console.log("Request Body:", req.body);

        const newRoom = new Room(req.body);
        await newRoom.save();

        res.status(201).json({ message: "Room added successfully", room: newRoom });
    } catch (error) {
        console.error("❌ Error adding room:", error);
        res.status(500).json({ message: "Error adding room", error });
    }
});



// ✅ Update Room Details (Only for Admins)
router.put("/update/:roomId", verifyToken, adminMiddleware, async (req, res) => {
  try {
      console.log("Received update request for:", req.params.roomId);
      console.log("Update Data:", req.body);

      const updatedRoom = await Room.findByIdAndUpdate(
          req.params.roomId,
          req.body,
          { new: true } // Returns updated document
      );

      if (!updatedRoom) {
          return res.status(404).json({ message: "Room not found" });
      }

      res.json({ message: "Room updated successfully", room: updatedRoom });
  } catch (error) {
      console.error("Error updating room:", error);
      res.status(500).json({ message: "Internal Server Error", error });
  }
});


// DELETE Room Route
router.delete("/delete/:roomId", verifyToken, adminMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error });
  }
});


// Get all booked rooms
router.get("/booked-rooms", verifyToken, adminMiddleware, async (req, res) => {
  try {
      const bookedRooms = await Room.find({ available: false }); // Fetch rooms that are booked
      res.status(200).json(bookedRooms);
  } catch (error) {
      console.error("Error fetching booked rooms:", error);
      res.status(500).json({ message: "Failed to fetch booked rooms" });
  }
});
  
  //users data
  router.get('/usersdata', verifyToken, adminMiddleware, async (req, res) => {
    try {
      const users = await User.find({}, '_id name email role'); // Select only name and email fields
      res.status(200).json(users);
      
    } catch (err) {
      res.status(500).json({ message: "Failed to load users" });
    }
  });
  

  router.delete("/user-delete/:userId",async(req,res)=>{    
    try{
      const receivedUser = req.params.userId;
      const checkUser=await User.findById(receivedUser);
      if(!checkUser){
        return res.status(400).json({message:"User not found"})
      }

      await User.findByIdAndDelete(receivedUser);
      res.json({message:"User deleted Succesfully"})
    }
    catch(err){
      console.log(err)
      return res.status(400).json("Error User Deletion",err)
    }



  })


// // ✅ Create a room (Admin)
// router.post("/rooms", verifyToken, adminMiddleware, async (req, res) => {
//   try {
//     const newRoom = new Room(req.body);
//     await newRoom.save();
//     res.status(201).json({ message: "Room added successfully", room: newRoom });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding room", error });
//   }
// });

// // ✅ Get all bookings (Admin)
// router.get("/bookings", verifyToken, adminMiddleware, async (req, res) => {
//   const bookings = await Booking.find().populate("roomId userId");
//   res.json(bookings);
// });

module.exports = router;
