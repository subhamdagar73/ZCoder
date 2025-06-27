import { BottomWarning } from "../../components/BottomWarning"
import { Button } from "../../components/Button"
import { Heading } from "../../components/Heading"
import { InputBox } from "../../components/InputBox"
import { SubHeading } from "../../components/SubHeading"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios";

export const Signin = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nav, setNav] = useState(false);
    const [count, setCount] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {
          setNav(true);
        }
    }, []);

    if(nav){
      setInterval(() => {
          setCount(count - 1);
      }, 1000);

      setTimeout(() => {
          navigate("/homepage");
      }, 5000);

      return <div className="text-center">
      <h1>Credentials found</h1>
      <h5>Redirecting in {count} seconds...</h5>
  </div>
    }

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={(e) => {
          setEmail(e.target.value);
        }} placeholder="chinaar@gmail.com" label={"Email"} />
        <InputBox onChange={(e) => {
          setPassword(e.target.value);
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={async () => {
            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
              password,
              email
            });
            localStorage.setItem("token", "Bearer "+response.data.token)
            navigate("/homepage")
          }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}