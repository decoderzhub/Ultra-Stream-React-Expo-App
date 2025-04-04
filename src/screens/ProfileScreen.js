import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { getUserProfile, updateUserProfile } from '../services/authService';
import { toggleVpnConnection, getVpnStatus, VPN_STATUS } from '../services/vpnService';
import { getUserVideos } from '../services/videoService';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    photoURL: null,
    followers: 0,
    following: 0,
    likes: 0,
    bio: '',
    isVpnActive: false
  });
  
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (auth.currentUser) {
          const userData = await getUserProfile(auth.currentUser.uid);
          const vpnStatus = await getVpnStatus(auth.currentUser.uid);
          
          setUser({
            id: auth.currentUser.uid,
            name: auth.currentUser.displayName || '',
            email: auth.currentUser.email || '',
            photoURL: auth.currentUser.photoURL || 'https://via.placeholder.com/150',
            followers: userData?.followers || 0,
            following: userData?.following || 0,
            likes: userData?.likes || 0,
            bio: userData?.bio || '',
            isVpnActive: vpnStatus.isVpnActive
          });
          
          const userVideos = await getUserVideos(auth.currentUser.uid);
          setVideos(userVideos);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const toggleVpn = async () => {
    try {
      if (!auth.currentUser) return;
      
      const result = await toggleVpnConnection(auth.currentUser.uid, !user.isVpnActive);
      
      setUser(prevUser => ({
        ...prevUser,
        isVpnActive: result.isVpnActive
      }));
      
      Alert.alert(
        'VPN Status',
        `VPN is now ${result.isVpnActive ? 'active' : 'inactive'}`
      );
    } catch (error) {
      console.error('Error toggling VPN:', error);
      Alert.alert('Error', 'Failed to toggle VPN connection');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#212121" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading profile...</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.username}>@{user.email.split('@')[0]}</Text>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.likes}</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
              </View>
              
              <Text style={styles.bio}>{user.bio || 'No bio yet'}</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.vpnButton, 
                    user.isVpnActive ? styles.vpnActiveButton : styles.vpnInactiveButton
                  ]}
                  onPress={toggleVpn}
                >
                  <Ionicons 
                    name={user.isVpnActive ? "shield-checkmark" : "shield-outline"} 
                    size={18} 
                    color={user.isVpnActive ? "#FFFFFF" : "#9C27B0"} 
                  />
                  <Text 
                    style={[
                      styles.vpnButtonText,
                      user.isVpnActive ? styles.vpnActiveText : styles.vpnInactiveText
                    ]}
                  >
                    {user.isVpnActive ? "VPN Active" : "VPN Inactive"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.tabsContainer}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Ionicons name="grid-outline" size={24} color="#9C27B0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Ionicons name="heart-outline" size={24} color="#757575" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Ionicons name="bookmark-outline" size={24} color="#757575" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.videosGrid}>
              {videos.length > 0 ? (
                videos.map(video => (
                  <TouchableOpacity 
                    key={video.id} 
                    style={styles.videoItem}
                    onPress={() => navigation.navigate('VideoPlayer', { videoId: video.id })}
                  >
                    <Image source={{ uri: video.thumbnail || 'https://via.placeholder.com/150' }} style={styles.videoThumbnail} />
                    <View style={styles.videoOverlay}>
                      <Text style={styles.videoViews}>
                        <Ionicons name="eye-outline" size={14} color="#FFFFFF" /> {video.views}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noVideosContainer}>
                  <Text style={styles.noVideosText}>No videos yet</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="compass-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('ShortVideo')}
        >
          <Ionicons name="play-circle-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Shorts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="person" size={24} color="#9C27B0" />
          <Text style={[styles.navText, styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  content: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  bio: {
    fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9C27B0',
    marginRight: 12,
  },
  editButtonText: {
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '500',
  },
  vpnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  vpnActiveButton: {
    backgroundColor: '#9C27B0',
    borderColor: '#9C27B0',
  },
  vpnInactiveButton: {
    backgroundColor: 'transparent',
    borderColor: '#9C27B0',
  },
  vpnButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  vpnActiveText: {
    color: '#FFFFFF',
  },
  vpnInactiveText: {
    color: '#9C27B0',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#9C27B0',
  },
  videosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  videoItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 2,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoViews: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  noVideosContainer: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
  },
  noVideosText: {
    fontSize: 16,
    color: '#757575',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    alignItems: 'center',
  },
  activeNavItem: {
    
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#757575',
  },
  activeNavText: {
    color: '#9C27B0',
  },
});

export default ProfileScreen;
