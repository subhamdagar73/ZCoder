import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faChevronDown, faChevronUp, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Problemset = () => {
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [expandedRatings, setExpandedRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      console.log('Fetching questions...');
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view problems');
        setLoading(false);
        return;
      }

      console.log('Token found:', token ? 'Yes' : 'No');

      // Fetch problems
      const response = await axios.get('http://localhost:3000/api/v1/problem/bulk');
      console.log('Problems fetched:', response.data.length);
      const questions = response.data;

      if (!questions || questions.length === 0) {
        setError('No problems found in database');
        setLoading(false);
        return;
      }

      // Fix token format - remove "Bearer " if it already exists
      const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
      console.log('Clean token:', cleanToken ? cleanToken.substring(0, 50) + '...' : 'null');
      console.log('Authorization header will be:', `Bearer ${cleanToken}`);

      // Fetch user details with proper Authorization header
      let solvedProblems = [];
      let bookmarkedProblems = [];
      
      try {
        const userResponse = await axios.get('http://localhost:3000/api/v1/user/details', {
          headers: {
            Authorization: `Bearer ${cleanToken}`
          }
        });
        
        console.log('User details fetched successfully');
        console.log('User data:', userResponse.data);
        
        // Make sure to access the correct properties
        const userData = userResponse.data.user || userResponse.data;
        solvedProblems = userData.solvedProblems || [];
        bookmarkedProblems = userData.bookmarkedProblems || [];
        
        console.log('Solved problems:', solvedProblems);
        console.log('Bookmarked problems:', bookmarkedProblems);
        
      } catch (userError) {
        console.error('User details error details:');
        console.error('Status:', userError.response?.status);
        console.error('Data:', userError.response?.data);
        console.error('Headers sent:', userError.config?.headers);
        
        // Don't continue if user data fetch fails - this is important for functionality
        if (userError.response?.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token'); // Clear invalid token
          setLoading(false);
          return;
        } else if (userError.response?.status === 403) {
          setError('Access denied. Please check your permissions.');
          setLoading(false);
          return;
        } else {
          console.log('Continuing with empty user data due to error...');
          // Only continue with empty arrays if it's a non-auth related error
        }
      }

      // Group questions by rating
      const grouped = questions.reduce((acc, question) => {
        const { rating } = question;
        if (rating) {
          if (!acc[rating]) acc[rating] = [];
          if (acc[rating].length < 5) acc[rating].push({
            id: question._id,
            name: question.name,
            tags: question.tags || [],
            rating: question.rating,
            contestId: question.contestId,
            index: question.index,
            solved: solvedProblems.includes(question._id),
            bookmarked: bookmarkedProblems.includes(question._id),
          });
        }
        return acc;
      }, {});

      console.log('Grouped questions:', Object.keys(grouped).length, 'ratings');
      console.log('Sample question with solved/bookmarked status:', grouped[Object.keys(grouped)[0]]?.[0]);
      
      setGroupedQuestions(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error.response?.data || error.message);
      console.error('Full error object:', error);
      console.error('Error status:', error.response?.status);
      setError(`Error: ${error.response?.data?.message || error.message}`);
      setLoading(false);
    }
  };

  fetchQuestions();
}, []);

  const toggleRating = (rating) => {
    setExpandedRatings(prevState => ({
      ...prevState,
      [rating]: !prevState[rating]
    }));
  };

  const toggleSolved = async(rating, id, solved) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in');
    return;
  }

  const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

  // Optimistically update UI
  setGroupedQuestions(prevGroupedQuestions => ({
    ...prevGroupedQuestions,
    [rating]: prevGroupedQuestions[rating].map(question =>
      question.id === id ? { ...question, solved: !question.solved } : question
    )
  }));

  try {
    if(solved){
      await axios.delete(`http://localhost:3000/api/v1/solve/${id}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`
        }
      });
    }
    else{
      await axios.post(`http://localhost:3000/api/v1/solve/`, {
        problemId: id
      }, {
        headers: {
          Authorization: `Bearer ${cleanToken}`
        }
      });
    }
    console.log('Solved status updated successfully');
  } catch (error) {
    console.error('Error updating solved status:', error);
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Revert the change if API call failed
    setGroupedQuestions(prevGroupedQuestions => ({
      ...prevGroupedQuestions,
      [rating]: prevGroupedQuestions[rating].map(question =>
        question.id === id ? { ...question, solved: !question.solved } : question
      )
    }));
    
    // Show user-friendly error message
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
    } else if (error.response?.status === 403) {
      alert('Access denied. Please check your permissions.');
    } else {
      alert('Failed to update solved status. Please try again.');
    }
  }
};

const toggleBookmarked = async(rating, id, bookmarked) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in');
    return;
  }

  const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;

  // Optimistically update UI
  setGroupedQuestions(prevGroupedQuestions => ({
    ...prevGroupedQuestions,
    [rating]: prevGroupedQuestions[rating].map(question =>
      question.id === id ? { ...question, bookmarked: !question.bookmarked } : question
    )
  }));

  try {
    if(bookmarked){
      await axios.delete(`http://localhost:3000/api/v1/bookmark/${id}`, {
        headers: {
          Authorization: `Bearer ${cleanToken}`
        }
      });
    }
    else{
      await axios.post(`http://localhost:3000/api/v1/bookmark/`, {
        problemId: id
      }, {
        headers: {
          Authorization: `Bearer ${cleanToken}`
        }
      });
    }
    console.log('Bookmark status updated successfully');
  } catch (error) {
    console.error('Error updating bookmark status:', error);
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Revert the change if API call failed
    setGroupedQuestions(prevGroupedQuestions => ({
      ...prevGroupedQuestions,
      [rating]: prevGroupedQuestions[rating].map(question =>
        question.id === id ? { ...question, bookmarked: !question.bookmarked } : question
      )
    }));
    
    // Show user-friendly error message
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
    } else if (error.response?.status === 403) {
      alert('Access denied. Please check your permissions.');
    } else {
      alert('Failed to update bookmark status. Please try again.');
    }
  }
};

  const styles = {
    container: {
      paddingLeft: '0px',
      paddingRight: '20px',
      width: '100%', 
      display: 'flex',
      flexDirection: 'column',
      marginTop: '50px' // Reduced from 150px
    },
    group: {
      marginBottom: '40px'
    },
    groupHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      padding: '10px 0'
    },
    groupTitle: {
      fontSize: '1.8em',
      marginBottom: '20px',
      color: '#333'
    },
    card: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease-in-out',
      display: 'flex',
      flexDirection: 'column'
    },
    cardTitle: {
      margin: 0,
      fontSize: '1.5em',
      color: '#333'
    },
    cardDetails: {
      margin: '4px 0',
      color: '#666'
    },
    cardDetailsBold: {
      fontWeight: 'bold'
    },
    buttonsRow: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    solvedButton: {
      backgroundColor: 'green',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '5px 10px',
      cursor: 'pointer'
    },
    unsolvedButton: {
      backgroundColor: 'white',
      color: 'black',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '5px 10px',
      cursor: 'pointer'
    },
    link: {
      marginRight: 'auto',
      color: '#007bff',
      textDecoration: 'none'
    },
    bookmarkButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#007bff'
    },
    errorMessage: {
      color: 'red',
      textAlign: 'center',
      padding: '20px',
      fontSize: '1.2em'
    },
    loadingMessage: {
      textAlign: 'center',
      padding: '20px',
      fontSize: '1.2em'
    }
  };

  if (loading) {
    return <div style={styles.loadingMessage}>Loading problems...</div>;
  }

  if (error) {
    return <div style={styles.errorMessage}>{error}</div>;
  }

  if (Object.keys(groupedQuestions).length === 0) {
    return <div style={styles.errorMessage}>No problems found</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={{ marginLeft: '20px', marginBottom: '20px' }}>Codeforces Problemset</h2>
      {Object.entries(groupedQuestions).map(([rating, questions]) => (
        <div key={rating} style={styles.group}>
          <div style={styles.groupHeader} onClick={() => toggleRating(rating)}>
            <h3 style={styles.groupTitle}>Rating: {rating}</h3>
            <FontAwesomeIcon icon={expandedRatings[rating] ? faChevronUp : faChevronDown} />
          </div>
          {expandedRatings[rating] && questions.map(question => (
            <div key={question.id} style={styles.card} className="problem-card">
              <div className="problem-info">
                <h3 style={styles.cardTitle}>{question.name}</h3>
                <div className="problem-details">
                  <p style={styles.cardDetailsBold}>Rating: {question.rating}</p>
                  <p style={styles.cardDetails}>Tags: {question.tags.join(', ')}</p>
                </div>
                <div style={styles.buttonsRow}>
                  <button
                    style={question.solved ? styles.solvedButton : styles.unsolvedButton}
                    onClick={() => toggleSolved(rating, question.id, question.solved)}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </button>
                  <a
                    href={`https://codeforces.com/contest/${question.contestId}/problem/${question.index}`}
                    style={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Problem
                  </a>
                  <button
                    className="btn btn-outline-primary"
                    style={question.bookmarked ? { ...styles.bookmarkButton, color: 'red' } : styles.bookmarkButton}
                    onClick={() => toggleBookmarked(rating, question.id, question.bookmarked)}
                  >
                    <FontAwesomeIcon icon={faBookmark} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Problemset;