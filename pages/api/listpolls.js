import clientPromise from "../../lib/db";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("polls"); // Use the "polls" database
      const pollsCollection = db.collection("polls"); // Use the "polls" collection

      const polls = await pollsCollection.find({}).toArray();

      res.status(200).json({ polls });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "This is a GET-only endpoint" });
  }
};