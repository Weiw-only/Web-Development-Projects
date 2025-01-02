import React, { useEffect, useState, useRef, useContext } from "react"
import {Row, Col, Pagination, Form, Button} from 'react-bootstrap';
import BadgerMessage from './BadgerMessage';
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const titleRef = useRef();
    const contentRef = useRef();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const loadMessages = (i) => {
        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}&page=${i}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.

    useEffect(() => {
        loadMessages(activePage); // Load messages based on the active page
    }, [props, activePage]);

    const handlePost = (e) => {
        e?.preventDefault(); 

        if (!titleRef.current.value || !contentRef.current.value) {
            alert("You must provide both a title and content!");
            return;
        }

        fetch(`https://cs571.org/api/s24/hw6/messages?chatroom=${props.name}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: titleRef.current.value,
                content: contentRef.current.value
            })
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully posted message!");
                loadMessages(activePage);
            } else if (res.status === 400) {
                alert("A request must contain a 'title' and 'content'")
            } else if (res.status === 401) {
                alert("You must be logged in to do that!")
            } else if (res.status === 404){
                alert("The specified chatroom does not exist. Chatroom names are case-sensitive.")
            }else if (res.status === 413){
                alert("'title' must be 128 characters or fewer and 'content' must be 1024 characters or fewer")
            }else {
                return;
            }
        })
    };

    const handleDelete = (id) =>{
         fetch(`https://cs571.org/api/s24/hw6/messages?id=${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
            }
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully deleted message!")
            } else if (res.status === 401){
                alert("You must be logged in to do that!") || alert("You may not delete another user's post!")
            } else if (res.status === 404){
                alert("That message does not exist!")
            }
        })
    }

    //hw4
    const buildPaginator = (() => {
        let pages = [];
        
        for(let i = 1; i <= 4; i++) {
            pages.push(
                <Pagination.Item 
                    key={i}
                    active={activePage === i}
                    onClick={() => setActivePage(i)}
                >
                    {i}
                </Pagination.Item>
            )
        }

        return pages;

    })


    return <>
        <h1>{props.name} Chatroom</h1>
        {
            /* TODO: Allow an authenticated user to create a post. */
            loginStatus.isLoggedIn ? (
                <Form onSubmit={handlePost}>
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control type="text" ref={titleRef}/>
                    <Form.Label>Post Content</Form.Label>
                    <Form.Control type="text" ref={contentRef}/>
                <Button variant="primary" type="submit">Create Post</Button>
                </Form>
            ) : (
                alert("You must be logged in to post!")
            )
        }
        <hr/>
        {
            messages.length > 0 ?
            (
                <Row>
                    {messages.slice(activePage).map(m => (
                        <Col xs={12} md={6} lg={4} key={m.id}>
                            <BadgerMessage
                                title={m.title}
                                poster={m.poster}
                                content={m.content}
                                created={new Date(m.created).toLocaleString()}   //used external online tool
                                //used external online tool
                                showDeleteButton={loginStatus.username === m.poster}
                                onDelete={() => handleDelete(m.id)}
                                onDeleteSuccess={() => {
                                    alert("Successfully deleted the post!");
                                    loadMessages(activePage);
                                }}
                            />
                        </Col>
                    ))}
                </Row>
            ):(
                <p>There are no messages on this page yet!</p>
            )
        }
        <Pagination className="page-contents">
            {buildPaginator()}
        </Pagination>
    </>
}
