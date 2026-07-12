import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Tab = 'All' | 'Upcoming' | 'Joined' | 'Completed';

const activities = [
  {
    id: 1,
    icon: '🌳',
    title: 'Tree Plantation Drive',
    date: '21 July 2026 · 8:00 AM',
    location: 'Cubbon Park, Bengaluru',
    xp: 50,
    organiser: 'Ananya Rao',
    contact: '+91 98765 43210',
    status: 'Upcoming',
  },
  {
    id: 2,
    icon: '🏖️',
    title: 'Beach Cleanup',
    date: '27 July 2026 · 7:00 AM',
    location: 'Juhu Beach, Mumbai',
    xp: 70,
    organiser: 'Rohan Mehta',
    contact: '+91 98220 45110',
    status: 'Upcoming',
  },
  {
    id: 3,
    icon: '🩸',
    title: 'Blood Donation Camp',
    date: '03 August 2026 · 9:30 AM',
    location: 'KEM Hospital, Mumbai',
    xp: 100,
    organiser: 'Priya Nair',
    contact: '+91 98700 22211',
    status: 'Upcoming',
  },
  {
    id: 4,
    icon: '♻️',
    title: 'E-waste Collection Drive',
    date: '12 July 2026 · 10:00 AM',
    location: 'Cyber City, Gurugram',
    xp: 40,
    organiser: 'Vikram Shah',
    contact: '+91 98111 29876',
    status: 'Completed',
  },
];

const tabs: Tab[] = ['All', 'Upcoming', 'Joined', 'Completed'];

type Props = {
  onBack: () => void;
};

export default function ActivitiesScreen({ onBack }: Props) {
  const [selectedTab, setSelectedTab] = useState<Tab>('All');
  const [joinedIds, setJoinedIds] = useState<number[]>([]);

  const joinActivity = (id: number, title: string) => {
    setJoinedIds((current) => [...current, id]);
    setSelectedTab('Joined');
    Alert.alert('You’re in! 🎉', `You joined ${title}.`);
  };

  const visibleActivities = activities.filter((activity) => {
    const joined = joinedIds.includes(activity.id);

    if (selectedTab === 'All') return true;
    if (selectedTab === 'Joined') return joined;
    if (selectedTab === 'Completed') return activity.status === 'Completed';

    return activity.status === 'Upcoming' && !joined;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.headerWave} />

        <View style={styles.topRow}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>CSR Activities</Text>

          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.headerText}>
          Make a difference with your community.
        </Text>
      </View>

      <View style={styles.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.tab,
                selectedTab === tab && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.activityList}
        >
          <Text style={styles.activityCount}>
            {visibleActivities.length} activities found
          </Text>

          {visibleActivities.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyText}>
                Join an upcoming activity to see it here.
              </Text>
            </View>
          ) : (
            visibleActivities.map((activity) => {
              const isJoined = joinedIds.includes(activity.id);
              const isCompleted = activity.status === 'Completed';

              return (
                <View key={activity.id} style={styles.activityCard}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.eventIconCircle}>
                      <Text style={styles.eventIcon}>{activity.icon}</Text>
                    </View>

                    <View style={styles.eventInfo}>
                      <View style={styles.titleRow}>
                        <Text style={styles.eventTitle}>{activity.title}</Text>
                        {isJoined && (
                          <View style={styles.joinedBadge}>
                            <Text style={styles.joinedBadgeText}>JOINED</Text>
                          </View>
                        )}
                        {isCompleted && (
                          <View style={styles.completedBadge}>
                            <Text style={styles.completedBadgeText}>
                              COMPLETED
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.eventDate}>📅 {activity.date}</Text>
                      <Text style={styles.eventLocation}>
                        📍 {activity.location}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.xpRow}>
                    <View style={styles.xpPill}>
                      <Text style={styles.xpText}>⚡ +{activity.xp} XP</Text>
                    </View>

                    <Text style={styles.organiserText}>
                      By {activity.organiser}
                    </Text>
                  </View>

                  <View style={styles.buttonRow}>
                    <Pressable
                      style={styles.contactButton}
                      onPress={() =>
                        Alert.alert(
                          'Contact organiser',
                          `${activity.organiser}\n${activity.contact}`
                        )
                      }
                    >
                      <Text style={styles.contactText}>Contact organiser</Text>
                    </Pressable>

                    {isCompleted ? (
                      <View style={styles.completedButton}>
                        <Text style={styles.completedButtonText}>Completed</Text>
                      </View>
                    ) : isJoined ? (
                      <View style={styles.joinedButton}>
                        <Text style={styles.joinedButtonText}>✓ Joined</Text>
                      </View>
                    ) : (
                      <Pressable
                        style={styles.joinButton}
                        onPress={() =>
                          joinActivity(activity.id, activity.title)
                        }
                      >
                        <Text style={styles.joinButtonText}>Join</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={onBack}>
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navLabel}>Home</Text>
        </Pressable>

        <View style={styles.navItem}>
          <Text style={[styles.navIcon, styles.activeNavIcon]}>♻</Text>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>
            Activities
          </Text>
        </View>

        <Pressable
          style={styles.navItem}
          onPress={() => Alert.alert('Rewards', 'Coming soon!')}
        >
          <Text style={styles.navIcon}>🎁</Text>
          <Text style={styles.navLabel}>Rewards</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => Alert.alert('Leaderboard', 'Coming soon!')}
        >
          <Text style={styles.navIcon}>🏆</Text>
          <Text style={styles.navLabel}>Leaderboard</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => Alert.alert('Profile', 'Coming soon!')}
        >
          <Text style={styles.navIcon}>●</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </Pressable>
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
    height: 185,
    paddingTop: 52,
    paddingHorizontal: 22,
    overflow: 'hidden',
    backgroundColor: '#124D78',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerWave: {
    position: 'absolute',
    width: 330,
    height: 260,
    top: -120,
    right: -100,
    borderRadius: 200,
    backgroundColor: '#3B87B8',
    opacity: 0.45,
    transform: [{ rotate: '-22deg' }],
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
    marginTop: -5,
    color: '#FFFFFF',
    fontSize: 32,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 38,
  },
  headerText: {
    marginTop: 25,
    color: '#D9F2FF',
    fontSize: 15,
  },
  content: {
    flex: 1,
    marginTop: -3,
  },
  tabsRow: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  tab: {
    marginRight: 9,
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: '#EAF1F5',
  },
  activeTab: {
    backgroundColor: '#124D78',
  },
  tabText: {
    color: '#658095',
    fontSize: 13,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  activityList: {
    paddingHorizontal: 20,
    paddingBottom: 95,
  },
  activityCount: {
    marginBottom: 13,
    color: '#70899A',
    fontSize: 13,
  },
  activityCard: {
    marginBottom: 15,
    padding: 16,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2ECF1',
  },
  cardTopRow: {
    flexDirection: 'row',
  },
  eventIconCircle: {
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#E7F6EA',
  },
  eventIcon: {
    fontSize: 34,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 13,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  eventTitle: {
    marginRight: 7,
    color: '#183B54',
    fontSize: 16,
    fontWeight: '800',
  },
  eventDate: {
    marginTop: 7,
    color: '#527287',
    fontSize: 12,
  },
  eventLocation: {
    marginTop: 5,
    color: '#527287',
    fontSize: 12,
  },
  joinedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#DDF3E3',
  },
  joinedBadgeText: {
    color: '#2D7A47',
    fontSize: 8,
    fontWeight: '800',
  },
  completedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#E4EDF2',
  },
  completedBadgeText: {
    color: '#607C90',
    fontSize: 8,
    fontWeight: '800',
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 17,
  },
  xpPill: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFF3D8',
  },
  xpText: {
    color: '#A66B10',
    fontSize: 12,
    fontWeight: '800',
  },
  organiserText: {
    color: '#718A9C',
    fontSize: 11,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  contactButton: {
    flex: 1,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#BFD6E4',
    borderRadius: 12,
  },
  contactText: {
    color: '#286B95',
    fontSize: 12,
    fontWeight: '800',
  },
  joinButton: {
    width: 88,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#124D78',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  joinedButton: {
    width: 88,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#DDF3E3',
  },
  joinedButtonText: {
    color: '#2D7A47',
    fontSize: 12,
    fontWeight: '800',
  },
  completedButton: {
    width: 88,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#E4EDF2',
  },
  completedButtonText: {
    color: '#607C90',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 55,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  emptyEmoji: {
    fontSize: 42,
  },
  emptyTitle: {
    marginTop: 10,
    color: '#183B54',
    fontSize: 17,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 6,
    color: '#70899A',
    fontSize: 13,
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
  activeNavIcon: {
    color: '#124D78',
  },
  navLabel: {
    marginTop: 3,
    color: '#8AA0B1',
    fontSize: 9,
  },
  activeNavLabel: {
    color: '#124D78',
    fontWeight: '800',
  },
});