import clientPromise from "../../lib/db";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("polls");
      const pollsCollection = db.collection("polls");

      const polls = await pollsCollection.find({}).toArray();

      if (polls.length === 0) {
        res.status(200).json({ message: "No polls found", polls: [] });
        return;
      }

      res.status(200).json({ polls });
    } catch (error) {
      console.error("Error fetching polls:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "This is a GET-only endpoint" });
  }
};