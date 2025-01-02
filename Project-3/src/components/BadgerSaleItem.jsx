import { useState } from "react";

export default function BadgerSaleItem(props) {

    const [quantity, setQuantity] = useState(0);
    
    function incQuan() {
        setQuantity(quantity + 1);
    }

    function decQuan() {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    }

    const featured_style = {
        backgroundColor: props.featured ? 'red' : 'white'
    };

    return <div style = {featured_style}>
        <h2>{props.name}</h2>
        <p>{props.description}</p>
        <p>{props.price}</p>
        <div>
            <button 
            className="inline"
            onClick={decQuan}
            disabled={ quantity <= 0}
            >-</button>
            <p className="inline">{quantity}</p>
            <button 
            className="inline"
            onClick={incQuan}
            >+</button>

        </div>
    </div>
}