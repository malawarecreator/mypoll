import clientPromise from "../../lib/db";

export default async (req, res) => {
  if (req.method === "POST") {
    const { name, options } = req.body;

    if (!name || !Array.isArray(options) || options.length === 0) {
      res.status(400).json({ message: "Missing or invalid parameters: 'name' and 'options' are required." });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("polls");
      const pollsCollection = db.collection("polls");

      const existingPoll = await pollsCollection.findOne({ name });
      if (existingPoll) {
        res.status(400).json({ message: "Poll with that name already exists" });
        return;
      }

      const poll = { name, options, votes: Array(options.length).fill(0) };
      await pollsCollection.insertOne(poll);

      res.status(201).json({ message: `Poll with name '${name}' created successfully` });
    } catch (error) {
      console.error("Error creating poll:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "This is a POST-only endpoint" });
  }
};