import {StyleSheet, Text, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {SocketContext} from "../../../contexts/socket.context";

const PlayerScore = () => {
    const socket = useContext(SocketContext);
    const [playerScore, setPlayerScore] = useState(0);
    useEffect(() => {
        socket.on("game.score", (data) => {
            setPlayerScore(data['playerScore'])
        });
    }, []);
    return (
        <View style={styles.playerTimerContainer}>
            <Text>Score: {playerScore}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    playerScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
    },
});
export default PlayerScore;