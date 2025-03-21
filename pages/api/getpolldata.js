import clientPromise from "../../lib/db";

export default async (req, res) => {
  if (req.method === "GET") {
    const { name } = req.query;

    if (!name) {
      res.status(400).json({ message: "Missing 'name' query parameter" });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("polls");
      const pollsCollection = db.collection("polls");

      const poll = await pollsCollection.findOne({ name });
      if (!poll) {
        res.status(404).json({ message: "No such poll found" });
        return;
      }

      res.status(200).json(poll);
    } catch (error) {
      console.error("Error fetching poll data:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "This is a GET-only endpoint" });
  }
};