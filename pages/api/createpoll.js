import { polls } from "..";
import { Poll } from "../../utils/Poll";


export default (req, res) => {
    // Method check
    if (req.method === "POST") {
        
        let {name, options} = req.body; // get the JSON params
        if (!(name && options)) {
            res.status(400).json({ message: "Missing Params"}); // Send 400 (bad request) if missing params
        } else {
            if (polls.find(poll => poll.name === name)) {
                res.status(400).json({ message: "Poll with that name already exists"}); // Send 400 (bad request) if poll with that name already exists
                return;
            }
            let poll = new Poll(name, options); 
            polls.push(poll); // Push the new poll to the polls list in ../index.js
            res.status(201).json({ message: `Poll with name ${poll.name} created`}); // 201 created if request OK

        }

    } else {
        res.status(400).json({ message: "This is a POST-only endpoint"}); //  Send 400 (bad request) if any method other than POST is sent
    }
}