import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const facts = [
  'One mature tree can absorb around 22 kg of CO₂ each year.',
  'Small daily actions can create a healthier planet.',
  'Every eco-friendly choice helps our shared future.',
];

type Props = {
  onFinish: () => void;
};

export default function LoadingScreen({ onFinish }: Props) {
  const [progress, setProgress] = useState(10);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const loadingTimer = setInterval(() => {
      setProgress((value) => (value >= 100 ? 100 : value + 5));
    }, 150);

    const factTimer = setInterval(() => {
      setFactIndex((value) => (value + 1) % facts.length);
    }, 5000);

    const pageTimer = setTimeout(onFinish, 3500);

    return () => {
      clearInterval(loadingTimer);
      clearInterval(factTimer);
      clearTimeout(pageTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.wave, styles.topWave]} />
      <View style={[styles.wave, styles.bottomWave]} />

      <View style={styles.content}>
        <View style={styles.logo}>
          <Text style={styles.earth}>🌍</Text>
          <View style={styles.leaf} />
        </View>

        <Text style={styles.title}>EcoSphere</Text>
        <Text style={styles.subtitle}>Together for a greener tomorrow</Text>

        <View style={styles.loadingArea}>
          <View style={styles.factCard}>
            <Text style={styles.factTitle}>PLANET FACT</Text>
            <Text style={styles.fact}>{facts[factIndex]}</Text>
          </View>

          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.loadingText}>
            Growing your experience · {progress}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden', backgroundColor: '#124D78' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  wave: { position: 'absolute', width: '160%', borderRadius: 500, transform: [{ rotate: '-12deg' }] },
  topWave: { height: 300, top: -130, left: -130, backgroundColor: '#3B87B8', opacity: 0.35 },
  bottomWave: { height: 390, bottom: -210, right: -130, backgroundColor: '#083A61', opacity: 0.7 },
  logo: { width: 132, height: 132, borderRadius: 66, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.14)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  earth: { fontSize: 72 },
  leaf: { position: 'absolute', right: 8, top: 14, height: 22, width: 12, borderTopLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#A9ECA1', transform: [{ rotate: '35deg' }] },
  title: { marginTop: 22, color: '#FFFFFF', fontSize: 36, fontWeight: '800' },
  subtitle: { marginTop: 8, color: '#D9F2FF', fontSize: 15 },
  loadingArea: { position: 'absolute', width: '100%', bottom: 65 },
  factCard: { padding: 18, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  factTitle: { color: '#B7F2A8', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  fact: { marginTop: 8, color: '#FFFFFF', fontSize: 15, lineHeight: 21 },
  track: { height: 8, marginTop: 26, borderRadius: 8, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.22)' },
  fill: { height: '100%', borderRadius: 8, backgroundColor: '#A9ECA1' },
  loadingText: { marginTop: 12, color: '#D9F2FF', textAlign: 'center', fontSize: 13, fontWeight: '600' },
});