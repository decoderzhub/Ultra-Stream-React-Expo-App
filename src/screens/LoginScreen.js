import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import LogoPlaceholder from '../components/LogoPlaceholder';
import { loginUser, resetPassword } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await loginUser(email, password);
      setLoading(false);
      // Navigation will be handled by the AppNavigator based on auth state
    } catch (error) {
      setLoading(false);
      setError(error.message);
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to reset your password');
      return;
    }
    
    try {
      await resetPassword(email);
      Alert.alert('Password Reset', 'Check your email for password reset instructions');
    } catch (error) {
      Alert.alert('Reset Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <LogoPlaceholder />
          
          <Text style={styles.title}>Login</Text>
          
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />
            
            <View style={styles.socialLoginContainer}>
              <Text style={styles.orText}>Or login with</Text>
              <View style={styles.socialButtons}>
                {/* Social login buttons would go here */}
              </View>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 24,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#9C27B0',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  socialLoginContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  orText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#757575',
  },
  footerLink: {
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '600',
  },
});

export default LoginScreen;
