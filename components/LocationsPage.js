import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const LocationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addLocation = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedRating = parseInt(rating);

    if (!trimmedName || !trimmedDescription || isNaN(parsedRating)) {
      Alert.alert('All fields are required and rating must be a number!');
      return;
    }

    if (parsedRating < 1 || parsedRating > 5) {
      Alert.alert('Rating must be between 1 and 5.');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        setIsLoading(false);
        return;
      }

      const location = await Location.geocodeAsync(trimmedName);

      if (location.length > 0) {
        const { latitude, longitude } = location[0];

        const newLocation = {
          name: trimmedName,
          description: trimmedDescription,
          rating: parsedRating,
          latitude,
          longitude,
        };

        let locations = [];
        try {
          const storedLocations = await AsyncStorage.getItem('locations');
          locations = storedLocations ? JSON.parse(storedLocations) : [];
        } catch (e) {
          console.warn('Error reading locations:', e);
        }

        locations.push(newLocation);

        await AsyncStorage.setItem('locations', JSON.stringify(locations));

        navigation.setParams({ updatedLocations: locations });
        navigation.goBack();
      } else {
        Alert.alert('Location not found!', 'Please enter a valid location name.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was an issue adding the location.');
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Location Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      <Button
        title={isLoading ? 'Adding...' : 'Add Location'}
        onPress={addLocation}
        disabled={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#CEC2C2',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    backgroundColor: 'white'
  },
});

export default LocationScreen;
