import React, {useEffect, useState, useContext} from "react";
import {StyleSheet, Text, View} from "react-native";
import {SocketContext} from '../contexts/socket.context';
import Board from "../components/board/board.component";
import Recap from "../components/recap/recap.component";

export default function OnlineGameController({navigation}) {
    const socket = useContext(SocketContext);
    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [inRecap, setInRecap] = useState(false);
    const [idOpponent, setIdOpponent] = useState(null);
    const navigateTO = (path) => {
        navigation.navigate(path);
    }
    useEffect(() => {
        console.log('[emit][queue.join]:', socket.id);
        socket.emit('queue.join');
        setInQueue(false);
        setInGame(false);
        socket.on('queue.added', (data) => {
            console.log('[listen][queue.added]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
        });
        socket.on('game.start', (data) => {
            console.log('[listen][game.start]:', data);
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setIdOpponent(data['idOpponent']);
        });
        socket.on('game.end', (data) => {
            console.log('[listen][game.ending]:', data);
            setInRecap(true);
            setInGame(false);
            setInQueue(false);
            socket.emit('game.ended');
        });
        socket.on('queue.leave', () => {
        });
    }, []);
    const quitGame = (socket) => {
        socket.emit('queue.leave');
        navigation.navigate('HomeScreen')
    }
    return (
        <View style={styles.container}>
            {!inQueue && !inGame && !inRecap && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text> </>
            )}
            {inQueue && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for another player...
                    </Text> </>
            )}
            {inGame && (
                <>
                    <Board/>
                </>
            )}
            {inRecap && (
                <>
                    <Recap navigateFonction={navigateTO}/>
                </>
            )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%',
    },
    paragraph: {
        fontSize: 16,
    }
});