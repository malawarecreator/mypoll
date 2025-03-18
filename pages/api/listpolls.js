import { polls } from "../index";

export default (req, res) => {
    if (req.method == "GET") {
        res.status(200).json({polls: polls}); // simply send the polls array

    } else {
        res.status(400).json({message: "This is a GET-only endpoint"}); // Send 400 (bad request) if wrong method
    }
}