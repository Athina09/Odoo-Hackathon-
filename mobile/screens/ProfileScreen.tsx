import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const stats = [
  { label: 'XP earned', value: '1,240' },
  { label: 'CSR activities', value: '8' },
  { label: 'Challenges', value: '5' },
];

const menuItems = ['Edit profile', 'Notification settings', 'Privacy', 'Help & support'];

type Props = {
  onBack: () => void;
  onLogout?: () => void;
};

export default function ProfileScreen({ onBack, onLogout }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerWave} />

        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.logoText}>Profile</Text>

          <View style={styles.backButton} />
        </View>

        <View style={styles.profileRow}>
          <View style={styles.profilePicture}>
            <Text style={styles.profileInitial}>M</Text>
          </View>

          <Text style={styles.userName}>Metrix</Text>
          <Text style={styles.userEmail}>metrix@ecosphere.app</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item}
              style={[
                styles.menuRow,
                index !== menuItems.length - 1 && styles.menuRowBorder,
              ]}
            >
              <Text style={styles.menuLabel}>{item}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        {onLogout && (
          <Pressable style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
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
    paddingBottom: 28,
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
  profileRow: {
    alignItems: 'center',
    marginTop: 22,
  },
  profilePicture: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: '#9CD6EE',
  },
  profileInitial: {
    color: '#124D78',
    fontSize: 27,
    fontWeight: '800',
  },
  userName: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userEmail: {
    marginTop: 3,
    color: '#D9F2FF',
    fontSize: 12,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 29,
  },
  statBox: {
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF3',
  },
  statValue: {
    color: '#183B54',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    marginTop: 4,
    color: '#70899A',
    fontSize: 11,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#183B54',
    fontSize: 20,
    fontWeight: '800',
  },
  menuCard: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6EEF3',
    marginBottom: 24,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF3F6',
  },
  menuLabel: {
    color: '#294B62',
    fontSize: 13,
    fontWeight: '600',
  },
  menuArrow: {
    color: '#8AA0B1',
    fontSize: 20,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E88A8A',
  },
  logoutText: {
    color: '#C64B4B',
    fontSize: 13,
    fontWeight: '800',
  },
});