import React , { useState, useRef, useContext}from 'react';
import { Button,Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'; 
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogin() {

    // TODO Create the login component.
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!usernameRef || !passwordRef) {
        alert("You must provide both a username and password!");
        return;
    }

    function handleLogInSubmit(e) {
        e?.preventDefault();

        fetch("https://cs571.org/api/s24/hw6/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameRef.current.value,
                password: passwordRef.current.value
            })
        })
        .then(res => {
            if (res.status === 200) {
                setIsLoggedIn(true)
                setLoginStatus({ isLoggedIn: true, username: usernameRef.current.value });
                alert("Successfully authenticated.")
                navigate("/");
            } else if (res.status === 400) {
                alert("A request must contain a 'username' and 'password'")
            } else if (res.status === 401) {
                alert("That username or password is incorrect!")
            } else{
                return;
            }
        })
    }
    
    return <>
        <h1>Login</h1>
        
        <Form onSubmit={handleLogInSubmit}>
        <Form.Label htmlFor="usernameInput">Username</Form.Label>
        <Form.Control id="usernameInput" ref={usernameRef}></Form.Control>
        <Form.Label htmlFor="passwordInput">Password</Form.Label>
        <Form.Control id="passwordInput" type="password" ref={passwordRef}></Form.Control>
        <br/>
        <Button type="submit" onClick={handleLogInSubmit}>Login</Button>
        </Form>
    </>

};


