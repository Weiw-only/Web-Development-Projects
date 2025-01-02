const Student = (props) => {
    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        <p><b>{props.major}</b></p>
        <p>{props.name.first} is taking {props.numCredits} credits and is {props.isFromWI ? '' : 'NOT'} from Wisconsin.</p>
        <p>They have {props.interests.length} interests including...</p>
        <ul>
            {props.interests.map(interest => {
                return <li key={interest}>{interest}</li>
            })}
        </ul>
    </div>
}

export default Student;