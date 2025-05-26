import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavbar from '../components/BottomNavbar';

interface LayoutWithNavbarProps {
  children: ReactNode;
  routeName: string;
}

const LayoutWithNavbar = ({ children, routeName }: LayoutWithNavbarProps) => {
  return (
    <View style={styles.container}>
      {children}
      <BottomNavbar activeRoute={routeName} />
    </View>
  );
};

export default LayoutWithNavbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
