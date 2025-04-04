import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { firestore } from '../config/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Upload video to Firebase Storage
export const uploadVideo = async (uri, fileName, metadata = {}) => {
  try {
    // Create a reference to the file location
    const storageRef = ref(storage, `videos/${fileName}`);
    
    // Fetch the file
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, blob, metadata);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      fileName,
      downloadURL,
      fullPath: snapshot.ref.fullPath,
      contentType: metadata.contentType || 'video/mp4'
    };
  } catch (error) {
    throw error;
  }
};

// Save video metadata to Firestore
export const saveVideoMetadata = async (videoData, userId) => {
  try {
    const videoDoc = await addDoc(collection(firestore, 'videos'), {
      ...videoData,
      userId,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: 0
    });
    
    return videoDoc.id;
  } catch (error) {
    throw error;
  }
};

// Get videos for home feed
export const getVideoFeed = async (limit = 10) => {
  try {
    const videosQuery = query(
      collection(firestore, 'videos'),
      orderBy('createdAt', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(videosQuery);
    const videos = [];
    
    querySnapshot.forEach((doc) => {
      videos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return videos;
  } catch (error) {
    throw error;
  }
};

// Get user videos
export const getUserVideos = async (userId) => {
  try {
    const videosQuery = query(
      collection(firestore, 'videos'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(videosQuery);
    const videos = [];
    
    querySnapshot.forEach((doc) => {
      videos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return videos;
  } catch (error) {
    throw error;
  }
};

// Update video metadata
export const updateVideoMetadata = async (videoId, data) => {
  try {
    await updateDoc(doc(firestore, 'videos', videoId), {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Delete video
export const deleteVideo = async (videoId, storagePath) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(firestore, 'videos', videoId));
    
    // Delete from Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    return true;
  } catch (error) {
    throw error;
  }
};

// Increment video views
export const incrementVideoViews = async (videoId) => {
  try {
    const videoRef = doc(firestore, 'videos', videoId);
    await updateDoc(videoRef, {
      views: increment(1)
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};
