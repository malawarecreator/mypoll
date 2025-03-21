import clientPromise from "../../lib/db";

export default async (req, res) => {
  if (req.method === "POST") {
    const { name, options, optionIndex } = req.body;

    if (!name) {
      res.status(400).json({ message: "Missing 'name' parameter" });
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

      // If `options` is provided, update the options and reset votes
      if (options && Array.isArray(options)) {
        const updatedVotes = Array(options.length).fill(0);
        await pollsCollection.updateOne(
          { name },
          { $set: { options, votes: updatedVotes } }
        );
        res.status(200).json({ message: "Poll options updated successfully" });
        return;
      }

      // If `optionIndex` is provided, update the votes
      if (typeof optionIndex === "number") {
        if (!Array.isArray(poll.votes) || poll.votes.length !== poll.options.length) {
          res.status(500).json({ message: "Poll data is corrupted" });
          return;
        }

        if (optionIndex < 0 || optionIndex >= poll.options.length) {
          res.status(400).json({ message: "Invalid option index" });
          return;
        }

        const updatedVotes = [...poll.votes];
        updatedVotes[optionIndex] += 1;

        await pollsCollection.updateOne(
          { name },
          { $set: { votes: updatedVotes } }
        );

        res.status(200).json({ message: "Vote recorded successfully" });
        return;
      }

      res.status(400).json({ message: "Missing 'options' or 'optionIndex' parameter" });
    } catch (error) {
      console.error("Error updating poll votes:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(400).json({ message: "This is a POST-only endpoint" });
  }
};