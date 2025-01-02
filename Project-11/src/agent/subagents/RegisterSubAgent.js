import { isLoggedIn, ofRandom } from "../Util"

const createRegisterSubAgent = (end) => {

    let stage;
    let username, password;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            return end(ofRandom([
                "You are already logged in, try logging out first.",
                "You are already signed in, try signing out first."
            ]))
        } else {
            stage = "FOLLOWUP_USERNAME";
            return ofRandom([ // referenced from online external tool
                "Great! What username would you like to use?",
                "Sure! Provide a username for your new account.",
                "Got it! Please provide a username for registration."
            ])
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_USERNAME": return await handleFollowupUsername(prompt);
            case "FOLLOWUP_PASSWORD": return await handleFollowupPassword(prompt);
            case "CONFIRM_PASSWORD": return await handleConfirmPassword(prompt);
        }
    }

    const handleFollowupUsername = async (prompt) => {
        username = prompt;
        stage = "FOLLOWUP_PASSWORD";
        return {
            msg: ofRandom([ // referenced from online external tool
                "Thanks! Now, what password would you like to use?",
                "Got it! Please enter a password for your new account.",
                "Understood! Enter a password for your account."
            ]),
            nextIsSensitive: true   
        }
    }

    const handleFollowupPassword = async (prompt) => {
        password = prompt;
        stage = "CONFIRM_PASSWORD";
        return {
            msg: "Please confirm your password by entering it again.",
            nextIsSensitive: true
        };
    }

    const handleConfirmPassword = async (prompt) => {
        if (prompt !== password) {
            // incorrect password
            stage = "FOLLOWUP_USERNAME"; // restart stage
            return {
                msg: ofRandom([
                    "The passwords didn't match. Please try again.",
                    "Oops, the passwords you entered do not match. Please try again."
                ]),
                nextIsSensitive: false
            };
        }
    
        // Passwords match, attempt to register the user
        const resp = await fetch("https://cs571.org/api/s24/hw11/register", {
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
        });
    
        if (resp.status === 200) {
            end();
            return {
                msg: `Registration successful! Welcome ${username}!`,
                nextIsSensitive: false
            };
        } else if (resp.status === 409) {
            // Username already taken, prompt for a new username.
            end();
            return {
                msg: "That username is already taken. Please choose a different username.",
                nextIsSensitive: false
            };
        } else {
            end();
            return {
                msg: "There was a problem with registration. Please try again later.",
                nextIsSensitive: false
            };
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createRegisterSubAgent;

