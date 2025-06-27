import { useNavigate } from "react-router-dom"
import { useState } from "react"

export const Logout = () => {
    const navigate = useNavigate();
    localStorage.removeItem("token");
    
    const [count, setCount] = useState(5);

    setInterval(() => {
        setCount(count - 1);
    }, 1000);

    setTimeout(() => {
        navigate("/signin");
    }, 5000);
    
    return <div className="text-center">
            <h1>You are now logged out</h1>
            <h5>Redirecting in {count} seconds...</h5>
        </div>
}