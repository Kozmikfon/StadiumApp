import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/props/types';  // az önce oluşturduğumuz tipi import ediyoruz

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>🏟️ StadyumApp</Text>
      <Button
        title="Oyuncuları Listele"
        onPress={() => navigation.navigate('PlayerList')}
      />
    </View>
  );
};

export default HomeScreen;
