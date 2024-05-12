import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  button: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '80%'
  }
});
