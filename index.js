const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3300;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dukesoni05:hEREcp3BNkGC77ED@cluster0.frwkvay.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Create a Schema for the history
const calculationSchema = new mongoose.Schema({
  expression: String,
  result: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: String,
  ipAddress: String, // New field: A field to store the IP address of the user making the calculation
  isImportant: { type: Boolean, default: false }, // New field: A field to mark a calculation as important
  tags: [String], // New field: An array field to store tags associated with the calculation
  additionalData: mongoose.Schema.Types.Mixed, // New field: A field to store additional data in a flexible format
});

// Create a model for the history collection
const Calculation = mongoose.model("Calculation", calculationSchema);

// Middleware to parse JSON data
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// API route to save a calculation to the database
app.post("/api/calculate", async (req, res) => {
  const { expression, ipAddress, isImportant, tags, additionalData } = req.body;

  let result;
  try {
    result = eval(expression);
  } catch (error) {
    result = "Invalid Operation";
  }

  const calculation = new Calculation({
    expression: expression.replace(/\s/g, ""),
    result: result.toString(),
    ipAddress: ipAddress,
    isImportant: isImportant,
    tags: tags,
    additionalData: additionalData,
  });

  try {
    await calculation.save();
    return res.status(201).json({ message: "Calculation saved successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to save calculation" });
  }
});

// API route to get all calculations from the database
app.get("/api/calculations", async (req, res) => {
  try {
    const calculations = await Calculation.find();
    console.log(calculations); // Add this line to log the calculations
    return res.json(calculations);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve calculation history" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Listening on port", PORT);
