import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 'one',
    title: 'Welcome to the App',
    text: 'Discover amazing features and possibilities.',
    backgroundColor: '#4A90E2',
    icon: 'rocket',
  },
  {
    key: 'two',
    title: 'Learn More',
    text: 'Explore our extensive knowledge base and tutorials.',
    backgroundColor: '#F39C12',
    icon: 'book-open',
  },
  {
    key: 'three',
    title: 'Get Started',
    text: 'Begin your journey with us today!',
    backgroundColor: '#1ABC9C',
    icon: 'flag-usa',
  }
];

export default function Onboarding() {
  const router = useRouter();

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <FontAwesome5 name={item.icon} size={100} color="white" style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const onDone = () => {
    router.push('/home');
  };

  const renderButton = (label) => {
    return (
      <View style={styles.button}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>
    );
  };

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
      renderDoneButton={() => renderButton('Get Started')}
      renderNextButton={() => renderButton('Next')}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    minWidth: 100,
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20,
    height: 8,
    borderRadius: 4,
  },
});

