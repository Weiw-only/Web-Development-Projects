import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext'; //used external online tool to debug for the path
import BadgerBudSummary from './BadgerBudSummary.jsx';
import React, { useContext , useEffect, useState} from 'react';
import { Col, Row } from "react-bootstrap"

export default function BadgerBudsBasket(props) {

    const budsData = useContext(BadgerBudsDataContext);
    const [savedCats, setSavedCats] = useState([]);

    useEffect(() =>{
        const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds')) || [];
        setSavedCats(budsData.filter(b => savedCatIds.includes(b.id)));
    }, [budsData]);

    const unselectBuddy = (buddy) =>{

        let savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds')) || [];
        savedCatIds = savedCatIds.filter(id => id !== buddy.id);
        sessionStorage.setItem('savedCatIds', JSON.stringify(savedCatIds));
        setSavedCats(prev => prev.filter(b => b.id !== buddy.id));
    }

    const adoptBuddy = (id) => {

        let adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds')) || [];
        let savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds')) || [];
        if(!adoptedCatIds.includes(id)){
            adoptedCatIds.push(id)
            sessionStorage.setItem('adoptedCatIds', JSON.stringify(adoptedCatIds));
        }

        savedCatIds = savedCatIds.filter(savedId => savedId !== id);
        sessionStorage.setItem('savedCatIds', JSON.stringify(savedCatIds));

        setSavedCats(prev => prev.filter(b => b.id !== id));
    }

    return <div>
        <Row>
            <h1>Badger Buds Basket</h1>
            {savedCats.length > 0 ? (
                <p>These cute cats could be all yours!</p>
            ):(
                <p>You have no buds in your basket!</p>
            )}
            {
                savedCats.map(buddy => {
                    return <Col
                    xs={12} md ={6} xl={4}
                    key={buddy.id}
                    >
                        <BadgerBudSummary 
                        buddy={buddy}
                        pageType = "Basket"
                        unSelect={unselectBuddy}
                        adopted={adoptBuddy}
                        />
                    </Col>
                })
            }
        </Row>

    </div>
}

