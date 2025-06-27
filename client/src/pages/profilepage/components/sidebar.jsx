import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faPen, faUniversity } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./sidebar.css";
import { useEffect, useState } from "react";

const BASE = process.env.REACT_APP_API_URL;

function Sidebar() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE}/api/v1/user/details`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="profile-card">
      <div className="edit-icon">
        <FontAwesomeIcon icon={faPen} />
      </div>
      <div className="profile-image"></div>
      <h1>{user.username}</h1>
      <h2>{user.codeforcesHandle}</h2>
      <div className="social-icons">
        <FontAwesomeIcon icon={faGithub} />
        <FontAwesomeIcon icon={faLinkedin} />
        <FontAwesomeIcon icon={faEnvelope} />
      </div>
      <div className="contact-info">
        <div className="info-item">
          <FontAwesomeIcon icon={faEnvelope} />
          <span>{user.email}</span>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faUniversity} />
          <span>INDIAN INSTITUTE OF TECHNOLOGY GUWAHATI</span>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
