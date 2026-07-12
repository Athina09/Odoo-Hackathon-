import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const rewards = [
  { id: 'r1', title: '10% off next purchase', points: 200, color: '#EAF3FF', icon: '🎟' },
  { id: 'r2', title: 'Free reusable bottle', points: 350, color: '#E8F8EE', icon: '🧴' },
  { id: 'r3', title: 'Eco champion badge', points: 500, color: '#F2ECFF', icon: '🏅' },
  { id: 'r4', title: 'Extra streak freeze', points: 150, color: '#FFF4E6', icon: '❄️' },
];

type Props = {
  onBack: () => void;
};

export default function RewardScreen({ onBack }: Props) {
  const totalPoints = 420;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerWave} />

        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.logoText}>Rewards</Text>

          <View style={styles.backButton} />
        </View>

        <View style={styles.pointsRow}>
          <Text style={styles.pointsLabel}>YOUR BALANCE</Text>
          <Text style={styles.pointsValue}>{totalPoints} pts</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Available rewards</Text>

        {rewards.map((reward) => {
          const canClaim = totalPoints >= reward.points;
          return (
            <View key={reward.id} style={styles.card}>
              <View style={[styles.iconCircle, { backgroundColor: reward.color }]}>
                <Text style={styles.icon}>{reward.icon}</Text>
              </View>

              <View style={styles.cardTextBox}>
                <Text style={styles.cardTitle}>{reward.title}</Text>
                <Text style={styles.cardPoints}>{reward.points} pts</Text>
              </View>

              <Pressable
                style={[styles.claimButton, !canClaim && styles.claimButtonDisabled]}
                disabled={!canClaim}
              >
                <Text
                  style={[
                    styles.claimButtonText,
                    !canClaim && styles.claimButtonTextDisabled,
                  ]}
                >
                  Claim
                </Text>
              </Pressable>
            </View>
          );
        })}
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
  pointsRow: {
    marginTop: 30,
  },
  pointsLabel: {
    color: '#BBDDEF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pointsValue: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
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
  cardPoints: {
    marginTop: 3,
    color: '#70899A',
    fontSize: 11,
  },
  claimButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#124D78',
  },
  claimButtonDisabled: {
    backgroundColor: '#E1EAF0',
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  claimButtonTextDisabled: {
    color: '#9AB0BF',
  },
});