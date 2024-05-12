import {StyleSheet, Text, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {SocketContext} from "../../../contexts/socket.context";

const PlayerTimer = () => {
    const socket = useContext(SocketContext);
    const [playerTimer, setPlayerTimer] = useState(0);
    useEffect(() => {
        socket.on("game.timer", (data) => {
            setPlayerTimer(data['playerTimer'])
        });
    }, []);
    return (
        <View style={styles.playerTimerContainer}>
            <Text>Temps: {playerTimer}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    playerTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgrey"
    },
    });
export default PlayerTimer;