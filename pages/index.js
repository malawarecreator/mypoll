import axios from 'axios';
import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const [polls, setPolls] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollName, setPollName] = useState('');
  const [voteOption, setVoteOption] = useState(0);
  const [pollData, setPollData] = useState(null);
  const [showVoteOptions, setShowVoteOptions] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState('');

  useEffect(() => {
    async function fetchPolls() {
      try {
        const response = await axios.get("/api/listpolls");
        setPolls(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching polls:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPolls();
  }, []);

  const handleVote = async () => {
    try {
      await axios.post("/api/vote", {
        name: pollName,
        optionIndex: voteOption,
      });
      alert("Vote submitted!");
      fetchPollData();
    } catch (err) {
      console.error("Error voting:", err);
      alert("Error submitting vote.");
    }
  };

  const fetchPollData = async () => {
    try {
      const response = await axios.get(`/api/getpolldata?name=${pollName}`);
      setPollData(response.data);
      setShowVoteOptions(true);
    } catch (err) {
      console.error("Error fetching poll data:", err);
      setPollData(null);
      setShowVoteOptions(false);
      alert('Poll not found');
    }
  };

  const handleSearch = () => {
    fetchPollData();
  };

  const handleCreatePoll = async () => {
    try {
    
      if (!question || !options) {
        alert("Please enter a question and options.");
        return; 
      }
  
      const optionsArray = options.split(',').map((option) => option.trim());
  
      if (optionsArray.length < 2) {
        alert("Please provide at least two options.");
        return; 
      }
  
     
      const postData = {
        name: `${question}`,
        options: optionsArray,
      };
  
      console.log("Sending poll creation data:", postData); 
  
      const response = await fetch("/api/createpoll", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (response.ok) { 
        alert("Poll created successfully!");
  
        try {
          const pollsResponse = await fetch("/api/listpolls");
          if (pollsResponse.ok) {
            const pollsData = await pollsResponse.json();
            setPolls(pollsData);
          } else {
            console.error("Error fetching polls after creation:", pollsResponse.status);
            alert("Poll Created, but error refreshing poll list.");
          }
        } catch (pollsError) {
          console.error("Error fetching polls after creation:", pollsError);
          alert("Poll Created, but error refreshing poll list.");
        }
      } else {
        alert(`Poll creation failed: Server returned status ${response.status}`);
        console.error(`Poll creation failed: Server returned status ${response.status}`, await response.text()); // Log the response body
      }
    } catch (err) {
    
      console.error("Error creating poll:", err);
      alert("An error occurred while creating the poll.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#ffff', color: '#333' }}>
      <Head>
        <title>MyPoll</title>
      </Head>
      <h1 style={{ textAlign: 'center', margin: '20px 0', color: '#007bff' }}>MyPoll</h1>
      <p style={{ fontStyle: 'italic', textAlign: 'center', marginBottom: '30px' }}>Anonymous Voting</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap', padding: '20px' }}>
        <div style={{ width: '300px', minHeight: '300px', borderRadius: '15px', border: '2px solid #007bff', backgroundColor: '#e9f7ff', padding: '20px', fontWeight: 'bolder', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#0056b3' }}>Available Polls</h2>
          <pre id="json" style={{ overflowY: 'auto', maxHeight: '200px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', fontSize: '0.9em', fontFamily: 'monospace', textAlign: 'left', width: '100%', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none' }}>
            <code style={{ whiteSpace: 'pre-wrap' }}>{loading ? "Loading..." : error ? `Error: ${error.message}` : polls ? JSON.stringify(polls, null, 2) : "No polls available."}</code>
          </pre>
        </div>
        <div style={{ width: '300px', minHeight: '300px', borderRadius: '15px', border: '2px solid #28a745', backgroundColor: '#e9ffe9', padding: '20px', fontWeight: 'bolder', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#1e7e34' }}>Voting</h2>
          <input id="name" placeholder='Name of the Poll' value={pollName} onChange={(e) => setPollName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginBottom: '10px' }} />
          <button onClick={handleSearch} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', fontSize: '1em', cursor: 'pointer', marginBottom: '10px' }}>Search</button>
          {showVoteOptions && pollData && (
            <select value={voteOption} onChange={(e) => setVoteOption(parseInt(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginBottom: '10px' }}>
              {pollData.options.map((option, index) => (
                <option key={index} value={index}>{option}</option>
              ))}
            </select>
          )}
          {showVoteOptions && <button onClick={handleVote} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white', fontSize: '1em', cursor: 'pointer' }}>Vote</button>}
          {pollData && (
            <pre style={{ textAlign: "left", width: '100%', overflowY: 'auto', maxHeight: '100px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
              <code>{JSON.stringify(pollData, null, 2)}</code>
            </pre>
          )}
        </div>
        <div style={{ width: '300px', minHeight: '300px', borderRadius: '15px', border: '2px solid #ffc107', backgroundColor: '#fffbe6', padding: '20px', fontWeight: 'bolder', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '15px', color: '#856404' }}>Create Poll</h2>
          <input id="question" placeholder='Enter Question' value={question} onChange={(e) => setQuestion(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginBottom: '10px' }} />
          <input id="options" placeholder='Enter Options (comma-separated)' value={options} onChange={(e) => setOptions(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1em', marginBottom: '10px' }} />
          <button onClick={handleCreatePoll} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', fontSize: '1em', cursor: 'pointer' }}>Create</button>
        </div>
      </div>
    </div>
  );
}