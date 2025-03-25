import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import clientPromise from "../lib/db";

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db("polls");
  const pollsCollection = db.collection("polls");
  const polls = await pollsCollection.find({}).toArray();

  return {
    props: {
      polls: JSON.parse(JSON.stringify(polls)),
    },
  };
}

export default function Home({ polls }) {
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newPollName, setNewPollName] = useState("");
  const [newPollOptions, setNewPollOptions] = useState("");

  const handleVote = async () => {
    if (!selectedPoll || !selectedOption) {
      setMessage("Please select an option.");
      return;
    }

    const optionIndex = selectedPoll.options.indexOf(selectedOption);

    if (optionIndex === -1) {
      setMessage("Invalid option selected.");
      return;
    }

    setLoading(true);
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optionIndex: optionIndex,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Vote submitted successfully!");
    } else {
      setMessage("Failed to submit vote.");
    }
  };

  const handleCreatePoll = async () => {
    if (!newPollName || !newPollOptions) {
      setMessage("Please fill out all fields.");
      return;
    }

    setLoading(true);
    const res = await fetch('/api/createpoll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newPollName,
        options: newPollOptions.split(',').map(opt => opt.trim()),
      }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Poll created successfully!");
      setNewPollName("");
      setNewPollOptions("");
    } else {
      setMessage("Failed to create poll.");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>MyPoll</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>MyPoll</h1>
        <p className={styles.subtitle}>Anonymous Voting</p>
      </header>

      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.mainContent}>
        <div className={styles.pollList}>
          <h3>Available Polls</h3>
          <ul>
            {polls.map((poll) => (
              <li key={poll._id} className={styles.pollItem}>
                <strong>{poll.question}</strong>
                <p>Options:</p>
                <ul className={styles.optionListInner}>
                  {poll.options.map((option, index) => (
                    <li key={index}>
                      {option} - Votes: {poll.votes && poll.votes[index] ? poll.votes[index] : 0}
                    </li>
                  ))}
                </ul>
                <button className={styles.voteButton} onClick={() => setSelectedPoll(poll)}>
                  Vote
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.voteBox}>
          {selectedPoll ? (
            <div>
              <h2>{selectedPoll.question}</h2>
              <div className={styles.optionList}>
                {selectedPoll.options.map((option) => (
                  <label key={option} className={styles.optionLabel}>
                    <input
                      type="radio"
                      name="poll"
                      value={option}
                      onChange={() => setSelectedOption(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              <button
                className={styles.voteSubmitButton}
                onClick={handleVote}
                disabled={loading || !selectedOption}
              >
                {loading ? 'Submitting...' : 'Vote'}
              </button>
              <button className={styles.backButton} onClick={() => setSelectedPoll(null)}>
                Back
              </button>
            </div>
          ) : (
            <p>Select a poll to vote</p>
          )}
        </div>
      </div>

      <div className={styles.createPollBox}>
        <h3>Create a Poll</h3>
        <input
          type="text"
          className={styles.input}
          placeholder="Poll Question"
          value={newPollName}
          onChange={(e) => setNewPollName(e.target.value)}
        />
        <input
          type="text"
          className={styles.input}
          placeholder="Options (comma-separated)"
          value={newPollOptions}
          onChange={(e) => setNewPollOptions(e.target.value)}
        />
        <button
          className={styles.createPollButton}
          onClick={handleCreatePoll}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Poll'}
        </button>
      </div>

      <Analytics />
      <SpeedInsights />
    </div>
  );
}