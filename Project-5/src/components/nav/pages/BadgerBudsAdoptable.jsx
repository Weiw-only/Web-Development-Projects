import { Col, Row } from "react-bootstrap"
import React, { useContext , useEffect, useState} from 'react';
import BadgerBudsDataContext from '../../../contexts/BadgerBudsDataContext'; //used external online tool to debug for the path
import BadgerBudSummary from './BadgerBudSummary.jsx';


export default function BadgerBudsAdoptable(props) {

    const budsData = useContext(BadgerBudsDataContext);
    const [availableCats, setAvailableCats] = useState([]);

    useEffect(() =>{

        const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds')) || [];
        const adoptedCatIds = JSON.parse(sessionStorage.getItem('adoptedCatIds')) || [];

        const filteredCats = budsData.filter(b => 
            !savedCatIds.includes(b.id) && !adoptedCatIds.includes(b.id)
        );
        
        setAvailableCats(filteredCats);
    }, [budsData]);

    // referenced from external online tool to uderstand the logic
    const saveCats = (buddies) =>{
        const savedCatIds = JSON.parse(sessionStorage.getItem('savedCatIds')) || [];
        if(!savedCatIds.includes(buddies.id)){
            savedCatIds.push(buddies.id)
            sessionStorage.setItem('savedCatIds', JSON.stringify(savedCatIds));
            setAvailableCats(availableCats.filter(b => b.id !== buddies.id))
        }
    }

    return <div>
        <Row>
            <h1>Available Badger Buds</h1>
            {availableCats.length > 0 ? (
                <p>The following cats are looking for a loving home! Could you help?</p>
            ):(
                <p>No buds are available for adoption!</p>
            )}

            {
                availableCats.map(buddy => {
                    return <Col
                    xs={12} md ={6} xl={4}
                    key={buddy.id}
                    >
                        <BadgerBudSummary 
                        buddy={buddy} 
                        pageType = "Adopt"
                        toSave={saveCats} 
                        />
                    </Col>
                })
            }
        </Row>
    </div>
}


