import { polls } from "..";
import { Vote } from "../../lib/Vote";

export default (req, res) => {
    if (req.method === "POST") {
        let { username, parent, choice } = req.body;
        if (!(username && parent && choice)) {
            res.status(400).json({ message: "Missing fields" }); // Send 400 (bad request) if missing fields
            return;
        }

        for (let i = 0; i < polls.length; i++) {
            if (polls[i].name === parent) {
                let poll = polls[i];
                if (poll.votes.find(vote => vote.username === username)) {
                    res.status(400).json({ message: "User has already voted" }); // Send 400 (bad request) if user has already voted
                    return;
                } else {
                    if (!poll.options.includes(choice)) {
                        res.status(400).json({ message: "Invalid choice" }); // Send 400 (bad request) if choice is invalid
                        return;
                    }
                    poll.add_vote(new Vote(username,parent ,choice));
                    res.status(200).json({ message: "Vote recorded successfully" }); // Send 200 (OK) if vote is recorded
                    return;
                }
            }
        }

        // If no matching poll is found, send a 404 (not found) response
        res.status(404).json({ message: "Poll not found" });
    } else {
        res.status(400).json({ message: "This is a POST-only endpoint" }); // Send 400 (bad request) if wrong method
    }
};