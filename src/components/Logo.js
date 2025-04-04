import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Logo = ({ size = 'medium', style }) => {
  const logoSize = size === 'small' ? 60 : size === 'medium' ? 100 : 150;
  
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../assets/logo.png')}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
      <Text style={styles.appName}>Ultra Stream</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
});

export default Logo;
