import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const impactItems = [
  { icon: '⚡', value: '1,240', label: 'XP earned', color: '#EAF3FF' },
  { icon: '🌿', value: '86', label: 'CO₂ saved (kg)', color: '#E8F8EE' },
  { icon: '🤝', value: '8', label: 'CSR activities', color: '#FFF4E6' },
  { icon: '🏆', value: '5', label: 'Challenges', color: '#F2ECFF' },
];

const quickActions = [
  { icon: '🤝', label: 'Join CSR', color: '#DDF3E3' },
  { icon: '🎯', label: 'Join challenge', color: '#E1F1FC' },
  { icon: '🎁', label: 'Rewards', color: '#FFF0D8' },
  { icon: '📋', label: 'My activity', color: '#EEE8FF' },
];

const tabs = [
  { icon: '⌂', label: 'Home' },
  { icon: '♻', label: 'Activities' },
  { icon: '🎁', label: 'Rewards' },
  { icon: '🎯', label: 'Challenges' },
  { icon: '●', label: 'Profile' },
] as const;

type Props = {
  onOpenActivities: () => void;
  onOpenReward: () => void;
  onOpenJoinChallenge: () => void;
  onOpenProfile: () => void;
  onOpenMyActivity: () => void;
};

export default function HomeScreen({
  onOpenActivities,
  onOpenReward,
  onOpenJoinChallenge,
  onOpenProfile,
  onOpenMyActivity,
}: Props) {
  const showComingSoon = (name: string) => {
    Alert.alert(name, `${name} will be available next.`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerWave} />

        <View style={styles.topRow}>
          <Pressable
            style={styles.menuButton}
            onPress={() => showComingSoon('Menu')}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>

          <Text style={styles.logoText}>EcoSphere</Text>

          <Pressable
            style={styles.notificationButton}
            onPress={() =>
              Alert.alert('Notifications', 'You have 2 new updates.')
            }
          >
            <Text style={styles.notificationIcon}>♧</Text>
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>HELLO,</Text>
            <Text style={styles.userName}>Metrix 👋</Text>
          </View>

          <Pressable style={styles.profileOuter} onPress={onOpenProfile}>
            <View style={styles.profilePicture}>
              <Text style={styles.profileInitial}>M</Text>
            </View>
            <View style={styles.onlineDot} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your dashboard</Text>

        <View style={styles.scoreRow}>
          <View style={styles.esgCard}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardIcon}>🌍</Text>
              <Text style={styles.cardLabel}>ESG SCORE</Text>
            </View>

            <Text style={styles.scoreValue}>82%</Text>

            <View style={styles.scoreTrack}>
              <View style={styles.scoreFill} />
            </View>

            <Text style={styles.scoreNote}>Great progress this month</Text>
          </View>

          <View style={styles.rankCard}>
            <Text style={styles.rankIcon}>🏅</Text>
            <Text style={[styles.cardLabel, styles.rankCardLabel]}>
              YOUR RANK
            </Text>
            <Text style={styles.rankValue}>#12</Text>
            <Text style={styles.rankNote}>in your organization</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your impact</Text>

        <View style={styles.impactGrid}>
          {impactItems.map((item) => (
            <View key={item.label} style={styles.impactCard}>
              <View
                style={[
                  styles.impactIconCircle,
                  { backgroundColor: item.color },
                ]}
              >
                <Text style={styles.impactIcon}>{item.icon}</Text>
              </View>

              <Text style={styles.impactValue}>{item.value}</Text>
              <Text style={styles.impactLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Quick actions</Text>

        <View style={styles.actionGrid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              style={styles.actionCard}
              onPress={() => {
                if (action.label === 'Join CSR') {
                  onOpenActivities();
                  return;
                }

                if (action.label === 'Join challenge') {
                  onOpenJoinChallenge();
                  return;
                }

                if (action.label === 'Rewards') {
                  onOpenReward();
                  return;
                }

                if (action.label === 'My activity') {
                  onOpenMyActivity();
                  return;
                }

                showComingSoon(action.label);
              }}
            >
              <View
                style={[
                  styles.actionIconCircle,
                  { backgroundColor: action.color },
                ]}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
              </View>

              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>

          <View style={styles.tipTextBox}>
            <Text style={styles.tipTitle}>Today’s eco tip</Text>
            <Text style={styles.tipText}>
              Carry a reusable bottle to reduce single-use plastic waste.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.label}
            style={styles.navItem}
            onPress={() => {
              if (tab.label === 'Activities') {
                onOpenActivities();
                return;
              }

              if (tab.label === 'Rewards') {
                onOpenReward();
                return;
              }

              if (tab.label === 'Challenges') {
                onOpenJoinChallenge();
                return;
              }

              if (tab.label === 'Profile') {
                onOpenProfile();
                return;
              }

              if (tab.label !== 'Home') {
                showComingSoon(tab.label);
              }
            }}
          >
            <Text
              style={[
                styles.navIcon,
                tab.label === 'Home' && styles.navIconActive,
              ]}
            >
              {tab.icon}
            </Text>

            <Text
              style={[
                styles.navLabel,
                tab.label === 'Home' && styles.navLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAFC',
  },
  header: {
    height: 240,
    paddingTop: 55,
    paddingHorizontal: 24,
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
  menuButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  notificationButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  notificationIcon: {
    color: '#FFFFFF',
    fontSize: 23,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A9ECA1',
    borderWidth: 1,
    borderColor: '#124D78',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  greeting: {
    color: '#D9F2FF',
    fontSize: 15,
  },
  userName: {
    marginTop: 3,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  profileOuter: {
    position: 'relative',
  },
  profilePicture: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: '#9CD6EE',
  },
  profileInitial: {
    color: '#124D78',
    fontSize: 25,
    fontWeight: '800',
  },
  onlineDot: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#124D78',
    backgroundColor: '#A9ECA1',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 100,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#183B54',
    fontSize: 20,
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  esgCard: {
    flex: 1.25,
    marginRight: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#124D78',
  },
  rankCard: {
    flex: 0.85,
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1EAF0',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 7,
    fontSize: 15,
  },
  cardLabel: {
    color: '#BBDDEF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  rankCardLabel: {
    marginTop: 5,
    color: '#658095',
  },
  scoreValue: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '800',
  },
  scoreTrack: {
    height: 6,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  scoreFill: {
    width: '82%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#A9ECA1',
  },
  scoreNote: {
    marginTop: 9,
    color: '#D9F2FF',
    fontSize: 10,
  },
  rankIcon: {
    fontSize: 27,
  },
  rankValue: {
    marginTop: 9,
    color: '#124D78',
    fontSize: 29,
    fontWeight: '800',
  },
  rankNote: {
    marginTop: 5,
    color: '#718A9C',
    fontSize: 10,
    textAlign: 'center',
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 29,
  },
  impactCard: {
    width: '48%',
    marginBottom: 13,
    padding: 15,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF3',
  },
  impactIconCircle: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  impactIcon: {
    fontSize: 19,
  },
  impactValue: {
    marginTop: 12,
    color: '#183B54',
    fontSize: 21,
    fontWeight: '800',
  },
  impactLabel: {
    marginTop: 4,
    color: '#70899A',
    fontSize: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 13,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF3',
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionLabel: {
    flex: 1,
    marginLeft: 9,
    color: '#294B62',
    fontSize: 12,
    fontWeight: '700',
  },
  actionArrow: {
    color: '#4D87AA',
    fontSize: 25,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#E7F6EA',
  },
  tipEmoji: {
    marginRight: 13,
    fontSize: 28,
  },
  tipTextBox: {
    flex: 1,
  },
  tipTitle: {
    color: '#256540',
    fontSize: 13,
    fontWeight: '800',
  },
  tipText: {
    marginTop: 4,
    color: '#47745A',
    fontSize: 12,
    lineHeight: 17,
  },
  bottomNav: {
    height: 76,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 9,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4EDF2',
  },
  navItem: {
    width: 66,
    alignItems: 'center',
  },
  navIcon: {
    color: '#8AA0B1',
    fontSize: 22,
  },
  navIconActive: {
    color: '#124D78',
  },
  navLabel: {
    marginTop: 3,
    color: '#8AA0B1',
    fontSize: 10,
  },
  navLabelActive: {
    color: '#124D78',
    fontWeight: '800',
  },
});