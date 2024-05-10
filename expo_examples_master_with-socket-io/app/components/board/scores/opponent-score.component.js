import {useContext, useEffect, useState} from "react";
import { View, Text, StyleSheet } from 'react-native';
import {SocketContext} from "../../../contexts/socket.context";

const OpponentScore = () => {
    const socket = useContext(SocketContext);
    const [opponentScore, setOpponentScore] = useState(0);
    useEffect(() => {
        socket.on("game.score", (data) => {
            setOpponentScore(data['opponentScore'])
        });
    }, []); return (
        <View style={styles.opponentTimerContainer}>
            <Text>Score: {opponentScore}</Text>
        </View>
    );
};
const styles = StyleSheet.create({

    opponentScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },});
export default OpponentScore;