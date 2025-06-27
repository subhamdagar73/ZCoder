import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const styles = {
    navbar: {
      backgroundColor: '#343a40',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%'
    },
    brand: {
      color: '#ffffff',
      fontSize: '24px',
      fontWeight: 'bold',
      textDecoration: 'none'
    },
    profileButton: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 16px',
      cursor: 'pointer',
      marginRight: '10px'
    },
    searchForm: {
      display: 'flex',
      alignItems: 'center'
    },
    searchInput: {
      marginRight: '10px',
      padding: '8px',
      border: '1px solid #ced4da',
      borderRadius: '5px',
      fontSize: '16px'
    },
    searchButton: {
      backgroundColor: '#28a745',
      color: '#ffffff',
      border: 'none',
      borderRadius: '5px',
      padding: '8px 16px',
      cursor: 'pointer'
    }
  };

  const handleProfileClick = () => {
    navigate("/profilepage");
  };
  const handleLogOutClick = () => {
    navigate("/logout");
  };
  return (
    <nav style={styles.navbar}>
      <a href="#" style={styles.brand}>
        <h1>Zcoder</h1>
      </a>
      <form style={styles.searchForm}>
        <button type="button" style={styles.profileButton} onClick={handleProfileClick}>
          <FontAwesomeIcon icon={faUser} /> Profile
        </button>
        <button type="button" style={styles.profileButton} onClick={handleLogOutClick}>
          Logout
        </button>
        <input
          type="text"
          placeholder="Search"
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          Search
        </button>
      </form>
    </nav>
  );
};

export default Navbar;