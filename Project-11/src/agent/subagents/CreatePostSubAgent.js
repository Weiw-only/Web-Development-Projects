import { isLoggedIn, ofRandom } from "../Util"

const createPostSubAgent = (end) => {

    const CS571_WITAI_ACCESS_TOKEN = "CSP2UJI67V4YZLKGN4QJY35JPLFHJNHU";

    let stage;
    let chatroomName, title, content, confirm;

    const handleInitialize = async (promptData) => {
        if (await isLoggedIn()) {
            stage = "FOLLOWUP_CHATROOM";
            return ofRandom([
                "Which chatroom would you like to post in?",
                "Please tell me the chatroom you want to make a post in.",
                "Please specify a chatroom to create a post."
            ]);
        } else {
            return end(ofRandom([
                "You must be signed in to create a post.",
                "Please sign in before creating a post."
            ]));
        }
    }

    const handleReceive = async (prompt) => {
        switch(stage) {
            case "FOLLOWUP_CHATROOM": return await handleFollowupChatroom(prompt);
            case "FOLLOWUP_TITLE": return await handleFollowupTitle(prompt);
            case "FOLLOWUP_CONTENT": return await handleFollowupContent(prompt);
            case "FOLLOWUP_CONFIRM": return await handleFollowupConfirm(prompt);
        }
    }

    const handleFollowupChatroom = async (prompt) => {
        chatroomName = prompt;
        if (chatroomName) {
            stage = 'FOLLOWUP_TITLE';
            return ofRandom([
                "Great! What would you like the title of your post to be?",
                "Sounds good! What would be the title of your post?",
                "Sure! What would you like yout title to be?"
            ]);
        } else {
            return "Please provide the chatroom name where you want to post.";
        }
    }

    const handleFollowupTitle = async (prompt) => {
        title = prompt;
        stage = 'FOLLOWUP_CONTENT';
        return ofRandom([
            "Alright, what should be the content of your post?",
            "Sure! And what should be the content of your post?"
        ]);
    }

    const handleFollowupContent = async (prompt) => {
        content = prompt;
        stage = 'FOLLOWUP_CONFIRM';
        return ofRandom([
            `Got it! Are you ready to publish your post, titled '${title}' in ${chatroomName}?`,
            `Understood. Are you ready to publish your post, which titled '${title}' in ${chatroomName}?`,
            `Excellent! To confirm, you want to create this post titled '${title}' in ${chatroomName}?`
        ]);
    }

    const handleFollowupConfirm = async (prompt) => {
        confirm = prompt;
        const resp = await fetch(`https://api.wit.ai/message?v=20240426&q=${encodeURIComponent(prompt)}`, {
            headers: {
                "Authorization": `Bearer ${CS571_WITAI_ACCESS_TOKEN}`
            }
        })
        const data = await resp.json();
        if (data.intents.length > 0 && data.intents[0].name === `wit$confirmation`) {
            await fetch(`https://cs571.org/api/s24/hw11/messages?chatroom=${chatroomName}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatroomName: chatroomName, 
                    title: title, 
                    content: content
                })
            })
            return end(ofRandom([
                "Your post has been successfully created!",
                "Congrats, your post has been successfully created!"
            ]));
        } else {
            return end(ofRandom([
                "No worries, if you want to create a post again, just ask!",
                "That's alright, if you would like to create a comment again, just ask!",
                "No problem. If you change your mind, just ask me to create a post again!"
            ]))
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createPostSubAgent;

