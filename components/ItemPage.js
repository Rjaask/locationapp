import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TodoItem = ({ text, rating, description, onPress }) => {
  return (
    <TouchableOpacity style={styles.locationBox} onPress={onPress}>
      <Text style={styles.locationTitle}>{text}</Text>
      <Text style={styles.locationDescription}>{description}</Text>
      <Text style={styles.locationRating}>Rating: {rating}</Text>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  locationBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    height: 100, 
    width: '100%',  
    justifyContent: 'space-between',  
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationDescription: {
    fontSize: 15,
    color: '#666',
  },
  locationRating: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff9800', 
  },
});

export default TodoItem;