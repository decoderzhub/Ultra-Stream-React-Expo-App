import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { auth } from '../config/firebase';
import { incrementVideoViews } from '../services/videoService';
import { getVpnStatus } from '../services/vpnService';

const VideoPlayerScreen = ({ navigation, route }) => {
  const { videoId } = route.params || { videoId: '1' };
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vpnActive, setVpnActive] = useState(false);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const loadVideoData = async () => {
      try {
        // In a real app, we would fetch the video data from Firestore
        // For now, we'll use mock data
        setVideo({
          id: videoId,
          title: 'Dance Performance',
          description: 'Check out my latest dance routine! Let me know what you think in the comments below.',
          url: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // Sample video from Expo
          thumbnail: 'https://via.placeholder.com/400x300',
          views: '10.2K',
          likes: '1.5K',
          comments: '245',
          user: {
            id: '1',
            name: 'Jane Doe',
            avatar: 'https://via.placeholder.com/50',
            followers: '125K'
          }
        });

        setComments([
          {
            id: '1',
            user: {
              name: 'John Smith',
              avatar: 'https://via.placeholder.com/40'
            },
            text: 'Amazing performance! Love the energy.',
            time: '2h ago',
            likes: 24
          },
          {
            id: '2',
            user: {
              name: 'Sarah Williams',
              avatar: 'https://via.placeholder.com/40'
            },
            text: 'The choreography is so creative! Would love to see more.',
            time: '3h ago',
            likes: 18
          },
          {
            id: '3',
            user: {
              name: 'Alex Johnson',
              avatar: 'https://via.placeholder.com/40'
            },
            text: 'This is incredible! How long did it take you to learn this routine?',
            time: '5h ago',
            likes: 12
          }
        ]);

        // Increment view count
        if (auth.currentUser) {
          await incrementVideoViews(videoId);
        }

        // Check VPN status
        if (auth.currentUser) {
          const vpnStatus = await getVpnStatus(auth.currentUser.uid);
          setVpnActive(vpnStatus.isVpnActive);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading video data:', error);
        Alert.alert('Error', 'Failed to load video data');
        setLoading(false);
      }
    };

    loadVideoData();
  }, [videoId]);

  const toggleLike = () => {
    setLiked(!liked);
    // In a real app, we would update the like count in Firestore
  };

  const handlePlayPause = async () => {
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  if (loading || !video) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading video...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{video.title}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.videoContainer}>
          {vpnActive && (
            <View style={styles.vpnBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
              <Text style={styles.vpnBadgeText}>VPN Active</Text>
            </View>
          )}
          
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: video.url }}
            useNativeControls
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={status => setStatus(() => status)}
            posterSource={{ uri: video.thumbnail }}
            posterStyle={styles.poster}
            usePoster={true}
          />
          
          <TouchableOpacity 
            style={styles.playPauseOverlay}
            onPress={handlePlayPause}
          >
            {!status.isPlaying && (
              <Ionicons name="play-circle" size={60} color="rgba(255, 255, 255, 0.8)" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <View style={styles.videoStats}>
            <Text style={styles.videoViews}>{video.views} views</Text>
            <View style={styles.videoActions}>
              <TouchableOpacity style={styles.actionButton} onPress={toggleLike}>
                <Ionicons 
                  name={liked ? "heart" : "heart-outline"} 
                  size={24} 
                  color={liked ? "#F44336" : "#757575"} 
                />
                <Text style={styles.actionText}>{video.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={24} color="#757575" />
                <Text style={styles.actionText}>{video.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={24} color="#757575" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.userInfo}>
            <TouchableOpacity 
              style={styles.userContainer}
              onPress={() => navigation.navigate('Profile', { userId: video.user.id })}
            >
              <Image source={{ uri: video.user.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{video.user.name}</Text>
                <Text style={styles.userFollowers}>{video.user.followers} followers</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.videoDescription}>{video.description}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments ({video.comments})</Text>
            <TouchableOpacity>
              <Ionicons name="filter-outline" size={20} color="#757575" />
            </TouchableOpacity>
          </View>
          
          {comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUserName}>{comment.user.name}</Text>
                  <Text style={styles.commentTime}>{comment.time}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity style={styles.commentAction}>
                    <Ionicons name="heart-outline" size={16} color="#757575" />
                    <Text style={styles.commentActionText}>{comment.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentAction}>
                    <Ionicons name="chatbubble-outline" size={16} color="#757575" />
                    <Text style={styles.commentActionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  content: {
    backgroundColor: '#FFFFFF',
  },
  videoContainer: {
    width: width,
    height: width * 9/16, // 16:9 aspect ratio
    backgroundColor: '#000000',
    position: 'relative',
  },
  vpnBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 20,
  },
  vpnBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playPauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  videoViews: {
    fontSize: 14,
    color: '#757575',
  },
  videoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  userFollowers: {
    fontSize: 14,
    color: '#757575',
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#9C27B0',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  videoDescription: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  commentText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
});

export default VideoPlayerScreen;
