import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { navigate } from '../navigation/RootNavigation'; // 

interface BottomNavProps {
  activeRoute: string;
}

const BottomNavbar: React.FC<BottomNavProps> = ({ activeRoute }) => {
  const isActive = (route: string) => route === activeRoute;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigate('Home')}>
        <Text style={[styles.navIcon, isActive('Home') && styles.activeNav]}>🏠</Text>
        <Text style={[styles.navText, isActive('Home') && styles.activeNav]}>Ana Sayfa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigate('TeamList')}>
        <Text style={[styles.navIcon, isActive('TeamList') && styles.activeNav]}>🏆</Text>
        <Text style={[styles.navText, isActive('TeamList') && styles.activeNav]}>Takımlar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigate('PlayerList')}>
        <Text style={[styles.navIcon, isActive('PlayerList') && styles.activeNav]}>👥</Text>
        <Text style={[styles.navText, isActive('PlayerList') && styles.activeNav]}>Oyuncular</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigate('MatchList')}>
        <Text style={[styles.navIcon, isActive('MatchList') && styles.activeNav]}>⚽</Text>
        <Text style={[styles.navText, isActive('MatchList') && styles.activeNav]}>Maçlar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#666',
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  activeNav: {
    color: '#004d40',
  },
});

export default BottomNavbar;
