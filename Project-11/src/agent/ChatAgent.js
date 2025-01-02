import createChatDelegator from "./ChatDelegator";
import { getLoggedInUsername, isLoggedIn, ofRandom } from "./Util"

const createChatAgent = () => {
    const CS571_WITAI_ACCESS_TOKEN = "CSP2UJI67V4YZLKGN4QJY35JPLFHJNHU"; // Put your CLIENT access token here.

    const delegator = createChatDelegator();

    let chatrooms = [];
    let message = [];

    const handleInitialize = async () => {
        const resp = await fetch("https://cs571.org/api/s24/hw11/chatrooms", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        const data = await resp.json();
        chatrooms = data;

        return "Welcome to BadgerChat! My name is Bucki, how can I help you?";
    }

    const handleReceive = async (prompt) => {
        if (delegator.hasDelegate()) { return delegator.handleDelegation(prompt); }
        const resp = await fetch(`https://api.wit.ai/message?v=20240426&q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0) {
            switch (data.intents[0].name) {
                case "get_help": return handleGetHelp();
                case "get_chatrooms": return handleGetChatrooms();
                case "get_messages": return handleGetMessages(data);
                case "login": return handleLogin();
                case "register": return handleRegister();
                case "create_message": return handleCreateMessage(data);
                case "logout": return handleLogout();
                case "whoami": return handleWhoAmI();
            }
        }
        return "Sorry, I didn't get that. Type 'help' to see what you can do!";
    }

    const handleTranscription = async (rawSound, contentType) => {
        const resp = await fetch(`https://api.wit.ai/dictation`, {
            method: "POST",
            headers: {
                "Content-Type": contentType,
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            },
            body: rawSound
        })
        const data = await resp.text();
        const transcription = data
            .split(/\r?\n{/g)
            .map((t, i) => i === 0 ? t : `{${t}`)  // Turn the response text into nice JS objects
            .map(s => JSON.parse(s))
            .filter(chunk => chunk.is_final)       // Only keep the final transcriptions
            .map(chunk => chunk.text)
            .join(" ");                            // And conjoin them!
        return transcription;
    }

    const handleSynthesis = async (txt) => {
        if (txt.length > 280) {
            return undefined;
        } else {
            const resp = await fetch(`https://api.wit.ai/synthesize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "audio/wav",
                    "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    q: txt,
                    voice: "Rebecca",
                    style: "soft"
                })
            })
            const audioBlob = await resp.blob()
            return URL.createObjectURL(audioBlob);
        }
    }

    const handleGetHelp = async () => {
        return ofRandom([
            "Try asking 'tell me the latest 3 messages', or ask for more help!",
            "Try asking 'register for an account', or ask for more help!",
            "Try asking 'give me a list of chatrooms', or ask for more help!",
        ]);
    }

    const handleGetChatrooms = async () => {
        if(chatrooms.length === 0){
            return "There are currently no chatrooms available.";
        }
        const chatroomNames = chatrooms.map(chatroom => chatroom).join(', ');
        return `Of course, there are ${chatrooms.length} chatrooms: ${chatroomNames}`;
    }

    const handleGetMessages = async (data) => {
        const hasSpecifiedChatroom = data.entities["chatrooms_list:chatrooms_list"]? true : false;
        const chatroomName = hasSpecifiedChatroom ? data.entities["chatrooms_list:chatrooms_list"][0].value : null;
        const hasSpecifiedNumber = data.entities["wit$number:number"] ? true : false;
        const numMessages = hasSpecifiedNumber ? Math.min(Math.max(parseInt(data.entities["wit$number:number"][0].value), 1), 10) : 1; // used online external tool

        const resp = await fetch(`https://cs571.org/api/s24/hw11/messages${chatroomName ? `?chatroom=${encodeURIComponent(chatroomName)}&num=${numMessages}` : `?num=${numMessages}`}`, {// fetch link format referenced from online external tool
            method: "GET",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        });
        const mdata = await resp.json()
        console.log(mdata);

        if(chatroomName === null){
            message = mdata.messages.map(m => `${m.poster} created a post titled '${m.title}' in ${m.chatroom} saying '${m.content}'`);
        }else{
            message = mdata.messages.map(m => `In ${m.chatroom}, ${m.poster} created a post titled '${m.title}' saying '${m.content}'`);
        }

        return message;

    }

    const handleLogin = async () => {
        return await delegator.beginDelegation("LOGIN");
    }

    const handleRegister = async () => {
        return await delegator.beginDelegation("REGISTER");
    }

    const handleCreateMessage = async (data) => {
        return await delegator.beginDelegation("CREATE");
    }

    const handleLogout = async () => {
        const accountName = await getLoggedInUsername();
        if (accountName) {
            // User is logged in, perform the logout
            const resp = await fetch("https://cs571.org/api/s24/hw11/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId()
                }
            });
            if (resp.status === 200) {
                return "You have been logged out.";
            } else {
                return "There was an issue logging you out. Please try again.";
            }
        } else {
            // User is not logged in
            return "You need to be logged in before logging out.";
        }
    }

    const handleWhoAmI = async () => {
        const loggedIn = await isLoggedIn();
        if (loggedIn) {
            const accountName = await getLoggedInUsername();
            return `You are currently logged in as ${accountName}`;
        } else {
            return "You are not logged in.";
        }
    }

    return {
        handleInitialize,
        handleReceive,
        handleTranscription,
        handleSynthesis
    }
}

export default createChatAgent;