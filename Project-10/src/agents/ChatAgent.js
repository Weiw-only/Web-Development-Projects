
const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = "KJZOTQA2NSYDN4WISUULHJER35ZHZGPH"; // Put your CLIENT access token here.

    let availableItems = [];

    let cart = [];

    const handleInitialize = async () => {
        // lec demo
        const res = await fetch('https://cs571.org/api/s24/hw10/items', {
            method:"GET",
            headers: {
                'X-CS571-ID':'bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278',
                "Content-Type": "application/json",
            }
        });
        if (res.status === 200) {
            const data = await res.json();
            availableItems = data;
            return "Welcome to BadgerMart Voice! :) Type your question, or ask for help if you are lost!";
        } else {
            console.error("Fail to fetch items: " + res.status);
        }
    }

    const handleReceive = async (prompt) => {

        // lec demo
        const res = await fetch("https://api.wit.ai/message?v=20240420&q=" + encodeURIComponent(prompt), {
            headers: {
                "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN,
            }
        });

        const data = await res.json();

        if (data.intents.length > 0) {
            switch(data.intents[0].name) {
                case "get_help": return getHelp();
                case "get_Items": return getItems();
                case "get_price": return getPrice(data);
                case "add_item": return addItems(data);
                case "remove_item": return removeItems(data);
                case "view_cart": return viewCart();
                case "check_out": return checkout();
            }
        }
        return "Sorry, I didn't get that. Type 'help' ro see what you can do!"
    }

    const getHelp = async () =>{
        return "In BadgerMart Voice, you can get the list of items, the price of an item, add or remove an item from your cart, and checkout!"
    }

    const getItems = async () =>{
        return "We have apple, bagel, coconut, donut, and egg for sale!"
    }

    const getPrice = async (promptdata) =>{
        // lec demo
        const hasSpecifiedType = promptdata.entities["item_type:item_type"] ? true : false;
        const itemType = hasSpecifiedType ? promptdata.entities["item_type:item_type"][0].value : null;
        const itemInfo = availableItems.find(i => i.name.toLowerCase() === itemType.toLowerCase());
        if(itemInfo){
            return `${itemType}s cost $${itemInfo.price} each.`;
        }else{
            return `Sorry, ${itemType} is not in stock.`;
        }
    }
    
    const addItems = async(promptdata) =>{
        const hasSpecifiedType = promptdata.entities["item_type:item_type"] ? true : false;
        const hasSpecifiedNumber = promptdata.entities["wit$number:number"] ? true : false;
        const itemType = hasSpecifiedType ? promptdata.entities["item_type:item_type"][0].value : "none";
        const itemInfo = availableItems.find(i => i.name.toLowerCase() === itemType.toLowerCase());
        const itemQuantity = hasSpecifiedNumber ? Math.floor(Number(promptdata.entities["wit$number:number"][0].value)) : 1;
        const itemIndex = cart.findIndex(i => i.name.toLowerCase() === itemType.toLowerCase());

        //check whether the item is for sale
        if(!itemInfo){
            return `Sorry, we don't have that item in stock.`;
        }
        
        //check whether the quantity of the item is valid
        if(itemQuantity <= 0){
            return "The quantity you entered is invalid. The quantity of an item must be greater than 0.";
        }

        //add item
        if(itemIndex >= 0){
            cart[itemIndex].quantity += itemQuantity;
        }else{
            cart.push({name: itemType, quantity: itemQuantity});
        }

        return `Sure, adding ${itemQuantity} ${itemType}(s) to your cart.`;

    }
    
    const removeItems = async(promptdata) =>{
        const hasSpecifiedType = promptdata.entities["item_type:item_type"] ? true : false;
        const hasSpecifiedNumber = promptdata.entities["wit$number:number"] ? true : false;
        const itemType = hasSpecifiedType ? promptdata.entities["item_type:item_type"][0].value : null;
        const itemQuantity = hasSpecifiedNumber ? Math.floor(promptdata.entities["wit$number:number"][0].value) : 1;
        const cartItemNum = cart.findIndex(i => i.name.toLowerCase() === itemType.toLowerCase());

        //check whether the item is for sale
        if (!itemType || !availableItems.some(i => i.name.toLowerCase() === itemType.toLowerCase())) {
            return `Sorry, ${itemType || "the item"} is not in stock.`;
        }

        //check whether the quantity of the item is valid
        if(itemQuantity <= 0){
            return `I cannot remove that number of ${itemType} from your cart.`;
        }

        // if the item is in the cart, change the quantity and remove it
        if (cartItemNum >= 0) {
            let cartItem = 0;
            if (cart[cartItemNum].quantity <= itemQuantity) {
                cartItem += cart[cartItemNum].quantity;
                cart.splice(cartItemNum, 1);
                return `Removed ${cartItem} ${itemType}(s) from your cart as that's all you had!`;
            } else if(cart[cartItemNum].quantity === itemQuantity){
                cart.splice(cartItemNum, 1); // Remove the item if trying to remove more than in cart
                return `Sure, removing all ${itemType}(s) from your cart.`;
            }else {
                cart[cartItemNum].quantity -= itemQuantity;
                return `Sure, removing ${itemQuantity} ${itemType}(s) from your cart.`;
            }
        } else {
            return `You don't have any ${itemType}(s) in your cart to remove.`;
        }

    }

    const viewCart = () =>{
        if(cart.length === 0){
            return "You have nothing in your cart, totaling $0.00."
        }else{
            let cartDetail = "You have ";
            let total = 0;

            cart.forEach((item, index) =>{
                const itemInfo = availableItems.find(availableItem => availableItem.name.toLowerCase() === item.name.toLowerCase());
                if(itemInfo){
                    total += item.quantity * itemInfo.price;
                    cartDetail += `${item.quantity} ${item.name}${item.quantity > 1 ? 's' : ''}`; // used online external tool
                    if (index < cart.length - 2){
                        cartDetail += ", ";
                    }else if (index == cart.length - 2){
                        cartDetail += " and ";
                    }
                }
            })

            cartDetail += ` in your cart, totaling $${total.toFixed(2)}`;

            return cartDetail;
        }
    }

    const checkout = async() =>{
        if(cart.length === 0){
            return "You don't have any items in your cart to purchase!"
        }else{
            // used online external tool
            const checkoutData = availableItems.reduce((body, item)=> {
                body[item.name] = cart.find(cartItem => cartItem.name.toLowerCase() === item.name.toLowerCase())?.quantity || 0;
                return body;
            }, {});

            try{
                const checkoutRes = await fetch('https://cs571.org/api/s24/hw10/checkout', {
                    method: "POST",
                    headers: {
                        'X-CS571-ID':'bid_67c09ec177d1952ae99856de7709b1ba5709d6ed2514a7385f0f91bf264fc278',
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(checkoutData),
                });

                if (checkoutRes.status === 200) {
                    const data = await checkoutRes.json();
                    cart = []; // Empty the cart
                    return `Success! Your confirmation ID is ${data.confirmationId}`;
                } else {
                    // Handle any errors
                    return "An error occurred during checkout. Please try again.";
                }
            }catch{
                console.error("Checkout Error:", error);
            }
        }
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;