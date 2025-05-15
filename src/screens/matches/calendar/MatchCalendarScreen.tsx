import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';

const MatchCalendarScreen = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const today = new Date();

  useEffect(() => {
    axios.get('http://10.0.2.2:5275/api/Matches/calendar')
      .then(res => setMatches(res.data))
      .catch(err => console.error('❌ Takvim maçları alınamadı:', err))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Gelecekteki maçları filtrele
  const futureMatches = matches.filter((m: any) => {
    const matchDate = new Date(m.matchDate);
    return matchDate >= today;
  });

  // 🔹 Takvimde işaretlenecek tarihler
  const markedDates = futureMatches.reduce((acc, match) => {
    const dateKey = match.matchDate.split('T')[0];
    acc[dateKey] = {
      marked: true,
      dotColor: '#4CAF50',
      customStyles: {
        container: {
          backgroundColor: '#E8F5E9',
          borderRadius: 10
        },
        text: {
          color: '#2E7D32',
          fontWeight: 'bold'
        }
      }
    };
    return acc;
  }, {} as any);

  // 🔹 Seçilen tarihteki maçlar
  const filteredMatches = futureMatches.filter(
    (m) => m.matchDate.split('T')[0] === selectedDate
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markingType="custom"
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: '#1976D2'
            }
          })
        }}
        theme={{
          todayTextColor: '#4CAF50',
          textDayFontWeight: 'bold'
        }}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} />
      ) : (
        <>
          <Text style={styles.title}>📅 {selectedDate} tarihli maçlar</Text>
          <FlatList
            data={filteredMatches}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.label}>Saha: {item.fieldName}</Text>
                <Text style={styles.label}>
                  Takımlar: {item.team1Name} vs {item.team2Name}
                </Text>
                <Text style={styles.label}>
                  Saat: {new Date(item.matchDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.empty}>Bu tarihte maç yok.</Text>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  card: {
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },
  label: { fontSize: 14 },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic'
  }
});

export default MatchCalendarScreen;
