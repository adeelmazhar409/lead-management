const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Leads Management API");
});

// Endpoint to create a new lead
app.post("/leads", async (req, res) => {
  const { name, email, status } = req.body;
  const lead = await prisma.lead.create({
    data: { name, email, status },
  });
  res.json(lead);
});

// Endpoint to get all leads
app.get("/leads", async (req, res) => {
  const leads = await prisma.lead.findMany();
  res.json(leads);
});

// Endpoint to update a lead
app.put("/leads/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, status } = req.body;
  const lead = await prisma.lead.update({
    where: { id: Number(id) },
    data: { name, email, status },
  });
  res.json(lead);
});

// Endpoint to delete a lead
app.delete("/leads/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.lead.delete({
    where: { id: Number(id) },
  });
  res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
