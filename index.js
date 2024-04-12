// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const { Worker } = require("worker_threads");
const fs = require("fs");
const Sample = require("./model/User");
const TemplateParser = require("./template");

// Initialize Express app
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://praveenreddy:1832000apr@mydatabase.dml7j5l.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Multer upload configuration
const upload = multer({ storage });

// POST API endpoint for uploading CSV file
app.post("/upload", upload.single("dataSheet"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message:"No file uploaded."});
    }
    const filePath = req.file.path;

    // Create a new worker thread to process the file asynchronously
    const worker = new Worker("./worker/worker.js", {
      workerData: { filePath },
    });

    let hasError = false; // Flag to track if there's any error during processing

    // Listen for messages from the worker thread
    worker.on("message", async (message) => {
      try {
        const newUsers = []; // Array to store newly created Csv objects
        const updatedUsers = []; // Array to store updated Csv objects

        for (const info of message) {
          // Find user by email
          const existingUser = await Sample.findOne({ email: info.email });

          if (existingUser) {
            // Update existing user
            const updatedUser = await Sample.findByIdAndUpdate(
              existingUser._id,
              {
                $set: {
                  firstName: info.first_name,
                  dob: info.DOB,
                  address: info.address,
                  phoneNumber: info.phone_number,
                  state: info.state,
                  zipCode: info.zip_code,
                  gender: info.gender,
                  userType: info.user_type,
                  agent: info.agent,
                  usersAccount: info.users_account,
                  policyCategory: info.policy_category,
                  "policyInfo.policyNumber": info.policy_number,
                  "policyInfo.policyStartDate": info.policy_start_date,
                  "policyInfo.policyEndDate": info.policy_end_date,
                  "policyInfo.collectionId": info.collection_id,
                  "policyInfo.companyCollectionId": info.company_collection_id,
                  "policyInfo.userId": info.user_id,
                },
              },
              { new: true }
            );
            updatedUsers.push(updatedUser);
          } else {
            // Create new user
            const newUser = new Sample({
              firstName: info.first_name,
              dob: info.DOB,
              address: info.address,
              phoneNumber: info.phone_number,
              state: info.state,
              zipCode: info.zip_code,
              email: info.email,
              gender: info.gender,
              userType: info.user_type,
              agent: info.agent,
              usersAccount: info.users_account,
              policyCategory: info.policy_category,
              policyInfo: {
                policyNumber: info.policy_number,
                policyStartDate: info.policy_start_date,
                policyEndDate: info.policy_end_date,
                policyCategory: info.policy_category,
                collectionId: info.collection_id,
                companyCollectionId: info.company_collection_id,
                userId: info.user_id,
              },
            });
            newUsers.push(newUser);
          }
        }

        // Save new users to the database
        const newUsersResult = await Sample.insertMany(newUsers);

        await fs.unlinkSync(filePath);

        if (!hasError) {

          res.json({
            message: "File uploaded and processed successfully",
            data: updatedUsers,
          });
        }
      } catch (error) {
        hasError = true; // Set error flag to true
        console.error("Error saving users:", error);
        res.status(500).json({ message: "Failed to save users" });
      }
    });

    // Listen for errors from the worker thread
    worker.on("error", (error) => {
      hasError = true; // Set error flag to true
      console.error(error);
      res.status(500).json({ message: "Failed to process file" });
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({message:"Error uploading file please check Network or File path"});
  }
});


const template = 'Hello, my name is <%firstName%>. My email is <%email%>. My age is <%age%> years.';
const data = { firstName: "John", email: "john@example.com", age: 26 };
const parsedTemplate = TemplateParser(template, data);
console.log(parsedTemplate);




// Start the Express server
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
