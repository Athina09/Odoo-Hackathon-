import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

type ActivityItem = {
  id: string;
  title: string;
  type: 'Challenge' | 'CSR';
  status: 'Ongoing' | 'Completed';
  icon: string;
  color: string;
  meta: string;
};

const activities: ActivityItem[] = [
  {
    id: 'a1',
    title: '30-Day Step Streak',
    type: 'Challenge',
    status: 'Ongoing',
    icon: '🚶',
    color: '#DDF3E3',
    meta: 'Day 12 of 30',
  },
  {
    id: 'a2',
    title: 'Beach Cleanup Drive',
    type: 'CSR',
    status: 'Ongoing',
    icon: '🏖',
    color: '#E1F1FC',
    meta: 'Ends in 3 days',
  },
  {
    id: 'a3',
    title: 'No Single-Use Plastic',
    type: 'Challenge',
    status: 'Completed',
    icon: '🌿',
    color: '#FFF0D8',
    meta: 'Finished · +150 XP',
  },
  {
    id: 'a4',
    title: 'Tree Planting Day',
    type: 'CSR',
    status: 'Completed',
    icon: '🌳',
    color: '#F2ECFF',
    meta: 'Finished · +200 XP',
  },
  {
    id: 'a5',
    title: 'Bike to Work',
    type: 'Challenge',
    status: 'Completed',
    icon: '🚲',
    color: '#EAF3FF',
    meta: 'Finished · +120 XP',
  },
];

type Props = {
  onBack: () => void;
};

export default function MyActivityScreen({ onBack }: Props) {
  const ongoing = activities.filter((a) => a.status === 'Ongoing');
  const completed = activities.filter((a) => a.status === 'Completed');

  const renderItem = (item: ActivityItem) => (
    <View key={item.id} style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>

      <View style={styles.cardTextBox}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardMeta}>{item.meta}</Text>
      </View>

      <View style={styles.typeTag}>
        <Text style={styles.typeTagText}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerWave} />

        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.logoText}>My Activity</Text>

          <View style={styles.backButton} />
        </View>

        <View style={styles.subRow}>
          <Text style={styles.subLabel}>
            {ongoing.length} ongoing · {completed.length} completed
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Ongoing</Text>
        {ongoing.length > 0 ? (
          ongoing.map(renderItem)
        ) : (
          <Text style={styles.emptyText}>Nothing in progress right now.</Text>
        )}

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Completed
        </Text>
        {completed.length > 0 ? (
          completed.map(renderItem)
        ) : (
          <Text style={styles.emptyText}>No completed activity yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAFC',
  },
  header: {
    paddingTop: 55,
    paddingHorizontal: 24,
    paddingBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#124D78',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  headerWave: {
    position: 'absolute',
    width: 430,
    height: 250,
    right: -165,
    top: -90,
    borderRadius: 200,
    backgroundColor: '#3B87B8',
    opacity: 0.45,
    transform: [{ rotate: '-20deg' }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  subRow: {
    marginTop: 30,
  },
  subLabel: {
    color: '#D9F2FF',
    fontSize: 13,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#183B54',
    fontSize: 20,
    fontWeight: '800',
  },
  sectionTitleSpaced: {
    marginTop: 10,
  },
  emptyText: {
    marginBottom: 15,
    color: '#8AA0B1',
    fontSize: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 13,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF3',
  },
  iconCircle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  icon: {
    fontSize: 20,
  },
  cardTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    color: '#294B62',
    fontSize: 13,
    fontWeight: '700',
  },
  cardMeta: {
    marginTop: 3,
    color: '#70899A',
    fontSize: 11,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#F0F5F8',
  },
  typeTagText: {
    color: '#5A7389',
    fontSize: 10,
    fontWeight: '700',
  },
});