

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
    
}
