import { useState, useEffect } from "react"
import { BottomWarning } from "../../components/BottomWarning"
import { Button } from "../../components/Button"
import { Heading } from "../../components/Heading"
import { InputBox } from "../../components/InputBox"
import { SubHeading } from "../../components/SubHeading"
import axios from "axios";
import { useNavigate } from "react-router-dom"

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [codeforcesHandle, setCodeforcesHandle] = useState("");
    const [githubHandle, setGithubHandle] = useState("");
    const [linkedInHandle, setLinkedInHandle] = useState("");
    const [nav, setNav] = useState(false);
    const [count, setCount] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
          setNav(true);
        }
    }, []);

    if (nav) {
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/homepage");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);
      return <div className="text-center">
      <h1>Credentials found</h1>
      <h5>Redirecting in {count} seconds...</h5>
  </div>
    }

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your information to create an account"} />
        <InputBox onChange={(e) => {
          setUsername(e.target.value);
        }} placeholder="John" label={"Username"} />
        <InputBox onChange={(e) => {
            setEmail(e.target.value);
        }} placeholder="abc@gmail.com" label={"Email"} />
        <InputBox onChange={(e) => {
            setPassword(e.target.value)
        }} placeholder="123456" label={"Password"} />
        <InputBox onChange={(e) => {
          setCodeforcesHandle(e.target.value);
        }} placeholder="abc_012" label={"Codforces Handle"} />
        <InputBox onChange={(e) => {
          setGithubHandle(e.target.value);
        }} placeholder="John" label={"Github Handle"} isImportant={false} />
        <InputBox onChange={(e) => {
          setLinkedInHandle(e.target.value);
        }} placeholder="John" label={"LinkedIn Handle"} isImportant={false} />
        <div className="pt-4">
          <Button onClick={async () => {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
              username,
              password,
              email,
              codeforcesHandle,
              githubHandle,
              linkedInHandle
            });
            localStorage.setItem("token", "Bearer "+response.data.token)
            navigate("/homepage")
          }} label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}