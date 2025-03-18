import { polls } from "..";

export default (req, res) => {

    // Method check
    if (req.method === "GET") {
        let {name} = req.query;
        if (!name) {
            res.status(400).json({message: "Missing Params"}); // Send 400 (bad request) if missing params
        } else {
            for (let i = 0; i < polls.length; i++) {
                if (polls[i].name === name) {
                    res.status(200).json({name: polls[i].name, options: polls[i].options, votes: polls[i].votes, closed: polls[i].closed}); // If poll present in polls list, returns poll data 
                    
                } 
            }

            res.status(400).json({message: "No such poll"}); // If no such poll, simply sends 400 (bad request) 
        }
        
    } else {
        res.status(400).json({message: "This is a GET-only endpoint"}); // Send 400 (bad request) if wrong method

    }
}