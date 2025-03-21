import clientPromise from "../../lib/db";

export default async (req, res) => {
  if (req.method === "GET") {
    const { name } = req.query;

    if (!name) {
      res.status(400).json({ message: "Missing Params" });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("polls"); // Use the "polls" database
      const pollsCollection = db.collection("polls"); // Use the "polls" collection

      const poll = await pollsCollection.findOne({ name });
      if (!poll) {
        res.status(404).json({ message: "No such poll" });
        return;
      }

      res.status(200).json(poll);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "This is a GET-only endpoint" });
  }
};