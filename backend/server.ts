import express from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Leads Management API");
});

// POST /leads - Add a new lead
app.post("/leads", async (req, res) => {
  const { name, email, status } = req.body;
  try {
    const newLead = await prisma.lead.create({
      data: {
        name,
        email,
        status,
      },
    });
    res.status(201).json(newLead);
  } catch (error: unknown) {
    // Explicitly typing error as unknown
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

// GET /leads - Fetch all leads
app.get("/leads", async (req, res) => {
  try {
    const leads = await prisma.lead.findMany();
    res.status(200).json(leads);
  } catch (error: unknown) {
    // Explicitly typing error as unknown
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
