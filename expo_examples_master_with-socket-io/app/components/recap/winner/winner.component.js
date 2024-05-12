import {StyleSheet, Text, View,Button } from "react-native";
import {useContext, useEffect, useState} from "react";
import {SocketContext} from "../../../contexts/socket.context";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from "react-confetti";

const Winner = ({ navigation }) => {
    const socket = useContext(SocketContext);
    const { width, height } = useWindowSize()
    const [playerWinner, setPlayerWinner] = useState(false);
    const quitGame = () => {
        socket.emit("game.delete");
        navigation('HomeScreen');
    }
    useEffect(() => {
        socket.on("game.over", (data) => {
            console.log('game.over', data)
            setPlayerWinner(data['playerWinner'])
        });
    }, []);
    return (

        <View style={styles.container}>
            { playerWinner && (
                <View style={styles.playerWinnerContainer}>
                    <Confetti
                        width={width}
                        height={height}
                    />
                    <Text>YOU WIN</Text>

                </View>
            )
            }
            { !playerWinner && (
                <View style={styles.playerLoserContainer}>
                    <Text>YOU LOSE</Text>
                </View>
            )
        }
            <Button
                title="Retour au menu"
                onPress={() => quitGame()}
            />
        </View>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    playerWinnerContainer: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "lightgreen"
    },
    playerLoserContainer: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "red"
    },
});
export default Winner;