import React , { useState, useContext}from 'react';
import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'; 
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";


export default function BadgerRegister() {

    // TODO Create the register component.

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    const [isRegisted, setIsRegisted] = useState(false);

    function handleRegisterSubmit(e) {
        e?.preventDefault();

        fetch("https://cs571.org/api/s24/hw6/register", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => {
            if (res.status === 200) {
                setIsRegisted(true)
                setLoginStatus({ isLoggedIn: true, username: username });
                alert("Successfully authenticated.")
                navigate("/");
            } else if (res.status === 400) {
                alert("A request must contain a 'username' and 'password'")
            } else if (res.status === 409) {
                alert("The user already exists!")
            } else if (res.status === 413) {
                alert("'username' must be 64 characters or fewer and 'password' must be 128 characters or fewer")
            } else if (passwordRef !== repeatedPasswordRef){
                alert('Your passwords do not match!');
            } else{
                return;
            }
        })
    }

    
    return <>
        <h1>Register</h1>

        <Form onSubmit={handleRegisterSubmit}>
        <Form.Label htmlFor="usernameInput">Username</Form.Label>
        <Form.Control id="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)}></Form.Control>
        <Form.Label htmlFor="passwordInput">Password</Form.Label>
        <Form.Control id="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
        <Form.Label htmlFor="passwordInput">Repeat Password</Form.Label>
        <Form.Control id="repeatedPasswordInput" type="password" value={repeatedPassword} onChange={(e) => setRepeatedPassword(e.target.value)}></Form.Control>
        <br/>
        <Button type="submit" onClick={handleRegisterSubmit}>Register</Button>
        </Form>
    </>
};