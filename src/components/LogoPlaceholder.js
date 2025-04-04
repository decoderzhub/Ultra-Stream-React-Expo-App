// Create a placeholder logo for the app
// This will be replaced with the actual logo from the Figma design
// For now, we'll create a simple placeholder

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogoPlaceholder = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>US</Text>
      </View>
      <Text style={styles.appName}>Ultra Stream</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
});

export default LogoPlaceholder;
