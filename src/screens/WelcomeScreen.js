import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import Button from '../components/Button';
import LogoPlaceholder from '../components/LogoPlaceholder';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LogoPlaceholder />
        
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeTitle}>Welcome to Ultra Stream</Text>
          <Text style={styles.welcomeSubtitle}>
            Stream your favorite content securely and privately
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Get Started" 
            onPress={() => navigation.navigate('SignUp')} 
            style={styles.button}
          />
          <Button 
            title="Login" 
            onPress={() => navigation.navigate('Login')} 
            primary={false}
            style={styles.button}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  welcomeTextContainer: {
    marginTop: 40,
    marginBottom: 60,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;
