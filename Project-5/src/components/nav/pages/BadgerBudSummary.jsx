import React, {useState} from 'react';
import { Card,Button, Carousel } from "react-bootstrap";
import '../../../../src/App.css';

// referenced from lecture slides
const BadgerBudSummary = ({buddy, pageType, toSave, unSelect, adopted}) => {

    const imageLink = `https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${buddy.imgIds[0]}`
    const [showMore, setShowMore] =useState(false);
    const hasMultipleImages = buddy.imgIds.length > 1;

    return <Card style={{padding: "0.5rem", margin: "0.1rem"}}>
    <div key={buddy.id}>
    
        {hasMultipleImages ? (
            <Carousel>
                {buddy.imgIds.map(imgId => (
                    <Carousel.Item key={imgId}>
                        <img
                            className ="catImgs"
                            src={`https://raw.githubusercontent.com/CS571-S24/hw5-api-static-content/main/cats/${imgId}`}
                            alt={`pictures of ${buddy.name}`}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        ) : (
            <img
                className ="catImgs"
                src={imageLink}
                alt={`A picture of ${buddy.name}`}
            />
        )}

        <h2>{buddy.name}</h2>

        {showMore && (
            <div key="showMoreContents">
                <p>{buddy.gender}</p>
                <p>{buddy.breed}</p>
                <p>{buddy.age}</p>
                {buddy.description && <p>{buddy.description}</p>}
            </div>
        )}

        {/* used external online tool to set different buttons for different pages */}
        {pageType === "Adopt" && (
            <div key="adoptablePage">
                <Button onClick={() => setShowMore(!showMore)}>{showMore ? 'Show Less' : 'Show More'}</Button>
                <Button onClick={() => {
                    alert(`${buddy.name} has been added to your basket!`);
                    toSave(buddy);}}>Save</Button>
            </div>
        )}
        {pageType === "Basket" && (
            <div key="basketPage">
                 <Button onClick={() => {
                    alert(`${buddy.name} has been removed from your basket!`);
                    unSelect(buddy);}}>Unselect</Button>
                <Button onClick={() => {
                    alert(`${buddy.name} has been adopted!`);
                    adopted(buddy.id)}}>Adopt</Button>
            </div>
        )}
    </div>
    </Card>
}
    export default BadgerBudSummary;


