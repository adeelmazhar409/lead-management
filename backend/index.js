const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://lead-management-ochre.vercel.app",
    ],
  })
);
app.get("/", (req, res) => {
  res.send("Leads Management API");
});

// Endpoint to create a new lead
app.post("/leads", async (req, res) => {
  try {
    const { name, email, status } = req.body;
    const lead = await prisma.lead.create({
      data: { name, email, status },
    });
    res.json(lead);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

// Endpoint to get all leads
app.get("/leads", async (req, res) => {
  try {
    const leads = await prisma.lead.findMany();
    res.json(leads);
  } catch (error) {
    res.status(400).send();
  }
});

// Endpoint to update a lead
app.put("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status } = req.body;
    const lead = await prisma.lead.update({
      where: { id: Number(id) },
      data: { name, email, status },
    });
    res.json(lead);
  } catch (error) {
    res.status(400).send();
  }
});

// Endpoint to delete a lead
app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).send();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
