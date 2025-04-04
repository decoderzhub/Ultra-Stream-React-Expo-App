import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { auth } from '../config/firebase';
import { getVideoFeed } from '../services/videoService';
import { getVpnStatus } from '../services/vpnService';

const ShortVideoScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vpnActive, setVpnActive] = useState(false);
  const flatListRef = useRef(null);
  
  useEffect(() => {
    const loadVideos = async () => {
      try {
        // In a real app, we would fetch short videos from Firestore
        // For now, we'll use mock data
        const videoData = await getVideoFeed(10);
        
        // Transform the data for short videos format
        const shortVideos = videoData.map(video => ({
          id: video.id,
          url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // Sample video from Expo
          user: {
            id: video.user?.id || '1',
            name: video.user?.name || 'Unknown User',
            avatar: video.user?.avatar || 'https://via.placeholder.com/50'
          },
          description: video.description || 'Check out this video! #trending',
          likes: video.likes || '0',
          comments: video.comments || '0',
          shares: '0'
        }));
        
        setVideos(shortVideos);
        
        // Check VPN status
        if (auth.currentUser) {
          const vpnStatus = await getVpnStatus(auth.currentUser.uid);
          setVpnActive(vpnStatus.isVpnActive);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading videos:', error);
        Alert.alert('Error', 'Failed to load videos');
        setLoading(false);
      }
    };
    
    loadVideos();
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item.url }}
          style={styles.video}
          resizeMode="cover"
          shouldPlay={index === currentIndex}
          isLooping
          isMuted={false}
        />
        
        <View style={styles.overlay}>
          {vpnActive && (
            <View style={styles.vpnBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
              <Text style={styles.vpnBadgeText}>VPN Active</Text>
            </View>
          )}
          
          <View style={styles.rightControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => navigation.navigate('Profile', { userId: item.user.id })}
            >
              <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
              <View style={styles.followBadge}>
                <Ionicons name="add" size={12} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="heart" size={32} color="#FFFFFF" />
              <Text style={styles.controlText}>{item.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="chatbubble-ellipses" size={32} color="#FFFFFF" />
              <Text style={styles.controlText}>{item.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="share-social" size={32} color="#FFFFFF" />
              <Text style={styles.controlText}>{item.shares}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomControls}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>@{item.user.name}</Text>
              <Text style={styles.videoDescription}>{item.description}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FFFFFF' }}>Loading videos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shorts</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {videos.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={Dimensions.get('window').height}
          snapToAlignment="start"
          decelerationRate="fast"
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No videos available</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  videoContainer: {
    width: width,
    height: height,
    backgroundColor: '#000000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
  },
  vpnBadge: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vpnBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  rightControls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  followBadge: {
    position: 'absolute',
    bottom: -5,
    backgroundColor: '#9C27B0',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  bottomControls: {
    marginBottom: 24,
  },
  userInfo: {
    
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ShortVideoScreen;
