import { firestore } from '../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

// VPN connection states
export const VPN_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
};

// Toggle VPN connection
export const toggleVpnConnection = async (userId, isActive) => {
  try {
    // In a real implementation, this would interact with a native VPN module
    // For now, we'll just update the user's VPN status in Firestore
    
    await updateDoc(doc(firestore, 'users', userId), {
      isVpnActive: isActive,
      vpnStatus: isActive ? VPN_STATUS.CONNECTED : VPN_STATUS.DISCONNECTED,
      vpnLastUpdated: new Date().toISOString()
    });
    
    return {
      isVpnActive: isActive,
      status: isActive ? VPN_STATUS.CONNECTED : VPN_STATUS.DISCONNECTED
    };
  } catch (error) {
    throw error;
  }
};

// Get VPN connection status
export const getVpnStatus = async (userId) => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        isVpnActive: userData.isVpnActive || false,
        status: userData.vpnStatus || VPN_STATUS.DISCONNECTED,
        lastUpdated: userData.vpnLastUpdated || null
      };
    }
    
    return {
      isVpnActive: false,
      status: VPN_STATUS.DISCONNECTED,
      lastUpdated: null
    };
  } catch (error) {
    throw error;
  }
};

// Connect to VPN
export const connectVpn = async (userId) => {
  try {
    // Update status to connecting
    await updateDoc(doc(firestore, 'users', userId), {
      vpnStatus: VPN_STATUS.CONNECTING,
      vpnLastUpdated: new Date().toISOString()
    });
    
    // In a real implementation, this would interact with a native VPN module
    // For demonstration, we'll simulate a connection after a delay
    
    // After successful connection, update status to connected
    await updateDoc(doc(firestore, 'users', userId), {
      isVpnActive: true,
      vpnStatus: VPN_STATUS.CONNECTED,
      vpnLastUpdated: new Date().toISOString()
    });
    
    return {
      isVpnActive: true,
      status: VPN_STATUS.CONNECTED
    };
  } catch (error) {
    // Update status to error if connection fails
    await updateDoc(doc(firestore, 'users', userId), {
      isVpnActive: false,
      vpnStatus: VPN_STATUS.ERROR,
      vpnLastUpdated: new Date().toISOString(),
      vpnError: error.message
    });
    
    throw error;
  }
};

// Disconnect from VPN
export const disconnectVpn = async (userId) => {
  try {
    // In a real implementation, this would interact with a native VPN module
    
    // Update status to disconnected
    await updateDoc(doc(firestore, 'users', userId), {
      isVpnActive: false,
      vpnStatus: VPN_STATUS.DISCONNECTED,
      vpnLastUpdated: new Date().toISOString()
    });
    
    return {
      isVpnActive: false,
      status: VPN_STATUS.DISCONNECTED
    };
  } catch (error) {
    throw error;
  }
};
