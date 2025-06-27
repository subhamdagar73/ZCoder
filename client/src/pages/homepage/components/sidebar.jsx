import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = () => {
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        const data = response.data;

        if (data.status === 'OK') {
          const upcomingContests = data.result
            .filter(contest => contest.phase === 'BEFORE')
            .map(contest => ({
              name: contest.name,
              start: new Date(contest.startTimeSeconds * 1000),
              url: `https://codeforces.com/contest/${contest.id}`
            }));

          upcomingContests.sort((a, b) => a.start - b.start);
          setContests(upcomingContests.slice(0, 3));
        } else {
          console.error('Error fetching contests:', data.comment);
        }
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchContests();
  }, []);

  const styles = {
    sidebar: {
      height: '100vh', 
      width: '250px',
      padding: '20px',
      backgroundColor: '#343a40', 
      color: 'white', 
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '0px',
      position: 'fixed',
      top: '100px', 
      left: 0
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white', 
      marginBottom: '20px'
    },
    contestList: {
      listStyleType: 'none',
      padding: 0,
      marginTop: '10px'
    },
    contestItem: {
      marginBottom: '10px'
    },
    contestLink: {
      color: '#007bff', 
      textDecoration: 'none',
      fontSize: '16px'
    },
    contestTime: {
      fontSize: '14px',
      color: '#6c757d' 
    }
  };

  return (
    <div style={styles.sidebar}>
      <h4 style={styles.header}>Upcoming Contests</h4>
      <ul style={styles.contestList}>
        {contests.map((contest, index) => (
          <li key={index} style={styles.contestItem}>
            <a href={contest.url} style={styles.contestLink} target="_blank" rel="noopener noreferrer">
              {contest.name}
            </a>
            <br />
            <span style={styles.contestTime}>{contest.start.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
