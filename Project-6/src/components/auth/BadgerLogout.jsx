import React, { useEffect, useContext, useState } from 'react';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerLogout() {

    const[isLoggedOut, setIsLoggedOut] = useState(false);
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    useEffect(() => {
        fetch('https://cs571.org/api/s24/hw6/logout', {
            method: 'POST',
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            },
            credentials: "include"
        }).then(res =>{
            if (res.status === 200) {
                setIsLoggedOut(true)
                setLoginStatus({ isLoggedIn: false});
                sessionStorage.removeItem('isLoggedIn');
                alert("You have been logged out! Goodbye.")
                navigate("/");
            }
        })
    }, [setLoginStatus]);

    return <>
        <h1>Logout</h1>
        <p>You have been successfully logged out.</p>
    </>
}

