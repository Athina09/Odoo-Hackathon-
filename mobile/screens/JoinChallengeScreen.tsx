import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const challenges = [
  {
    id: 'c1',
    title: '30-Day Step Streak',
    description: 'Hit 8,000 steps every day for a month.',
    participants: 1240,
    durationDays: 30,
    color: '#DDF3E3',
    icon: '🚶',
  },
  {
    id: 'c2',
    title: 'No Single-Use Plastic',
    description: 'Avoid single-use plastic for 7 days.',
    participants: 512,
    durationDays: 7,
    color: '#E1F1FC',
    icon: '🌿',
  },
  {
    id: 'c3',
    title: 'Bike to Work',
    description: 'Commute by bike five days a week.',
    participants: 328,
    durationDays: 14,
    color: '#FFF0D8',
    icon: '🚲',
  },
];

type Props = {
  onBack: () => void;
};

export default function JoinChallengeScreen({ onBack }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerWave} />

        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.logoText}>Challenges</Text>

          <View style={styles.backButton} />
        </View>

        <View style={styles.subRow}>
          <Text style={styles.subLabel}>Join one and start earning XP</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Open challenges</Text>

        {challenges.map((challenge) => (
          <View key={challenge.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={[styles.iconCircle, { backgroundColor: challenge.color }]}>
                <Text style={styles.icon}>{challenge.icon}</Text>
              </View>

              <View style={styles.cardTextBox}>
                <Text style={styles.cardTitle}>{challenge.title}</Text>
                <Text style={styles.cardDescription}>{challenge.description}</Text>
              </View>
            </View>

            <View style={styles.cardBottomRow}>
              <Text style={styles.metaText}>
                {challenge.participants.toLocaleString()} joined · {challenge.durationDays}d
              </Text>

              <Pressable style={styles.joinButton}>
                <Text style={styles.joinButtonText}>Join</Text>
              </Pressable>
            </View>
          </View>
        ))}
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
  card: {
    padding: 15,
    marginBottom: 13,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF3',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    color: '#183B54',
    fontSize: 14,
    fontWeight: '800',
  },
  cardDescription: {
    marginTop: 4,
    color: '#70899A',
    fontSize: 12,
    lineHeight: 17,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  metaText: {
    color: '#8AA0B1',
    fontSize: 11,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#124D78',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});