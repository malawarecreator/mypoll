

export class Poll {
    constructor(name, options, votes=[], closed=false) {
        this.name = name;
        this.options = options;
        this.votes = votes;
        this.closed = closed;

    }

    close() {
        this.closed = true;
    }
    add_vote(vote) {
        if (!closed) {
            this.votes.push(vote);
            console.log(`Vote from ${vote.username} registered`);
        } else {
            console.log(`Unable to register vote from ${vote.username}: server is closed`);
        }
        

    }
}