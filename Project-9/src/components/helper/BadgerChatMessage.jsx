import { Text, TouchableOpacity, StyleSheet} from "react-native";
import BadgerCard from "./BadgerCard"

function BadgerChatMessage(props) {

    const dt = new Date(props.created);
    const isCurrentUser = props.currentUser === props.poster;

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text>{props.content}</Text>
        {isCurrentUser && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => props.handleDelete(props.id)}>
                <Text style={styles.deleteButtonText}>DELETE POST</Text>
            </TouchableOpacity>
        )}
    </BadgerCard>
}

const styles = StyleSheet.create({
    deleteButton: {
        marginTop: 12,
        backgroundColor: 'crimson',
        padding: 12,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButtonText: {
        color: 'white',
    }
});

export default BadgerChatMessage;

