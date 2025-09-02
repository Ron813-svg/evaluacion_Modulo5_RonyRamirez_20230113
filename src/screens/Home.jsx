import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import useUserData from '../hooks/useUserData';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { userData, loading, error, refreshUserData } = useUserData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Solo ejecutar animación cuando los datos estén listos
    if (userData && !loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [userData, loading]);

  // Función para recargar datos con pull-to-refresh
  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshUserData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Función para manejar logout
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Función para navegar a editar perfil
  const handleEditProfile = () => {
    navigation.navigate('EditProfile', {
      userData,
      onProfileUpdated: refreshUserData // Callback para refrescar datos
    });
  };

  // Mostrar loading mientras se cargan los datos iniciales
  if (loading && !userData) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cargando tu perfil...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Mostrar error si hay problemas de conectividad
  if (error && !userData) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="wifi-off" size={48} color="#fff" />
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            onPress={refreshUserData} 
            icon="refresh"
            variant="secondary"
          >
            Reintentar
          </Button>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={['#fff']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.greeting}>¡Hola!</Text>
          <Text style={styles.userName}>
            {userData?.nombre || user?.displayName || 'Usuario'}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.profileCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account" size={60} color="#007bff" />
            </View>
            <Text style={styles.profileTitle}>Mi Perfil</Text>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={24} color="#666" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>
                  {userData?.nombre || 'No disponible'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="email" size={24} color="#666" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Correo</Text>
                <Text style={styles.infoValue}>
                  {userData?.correo || user?.email || 'No disponible'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={24} color="#666" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Edad</Text>
                <Text style={styles.infoValue}>
                  {userData?.edad ? `${userData.edad} años` : 'No disponible'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="school" size={24} color="#666" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Especialidad</Text>
                <Text style={styles.infoValue}>
                  {userData?.especialidad || 'No disponible'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              icon="account-edit"
              onPress={handleEditProfile}
              size="medium"
            >
              Editar Perfil
            </Button>

            <Button
              icon="logout"
              onPress={handleLogout}
              variant="danger"
              size="medium"
            >
              Cerrar Sesión
            </Button>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userName: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileInfo: {
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  buttonContainer: {
    gap: 10,
  },
});