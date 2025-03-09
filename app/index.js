import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, Easing } from 'react-native';

export default function App() {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready, shooting, scored, missed
  const [ballPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [keeperPosition] = useState(new Animated.Value(0));
  const [shotDirection, setShotDirection] = useState({ x: 0, y: 0 });
  
  // Reset ball and keeper positions
  const resetPositions = () => {
    ballPosition.setValue({ x: 0, y: 0 });
    keeperPosition.setValue(0);
  };
  
  // Handle shoot button press
  const handleShoot = () => {
    if (gameState !== 'ready') return;
    
    // Random shot direction (left/right/center and top/middle/bottom)
    const xDir = Math.random() * 300 - 150;
    const yDir = -100 - Math.random() * 100;
    setShotDirection({ x: xDir, y: yDir });
    
    // Random keeper move (doesn't always match shot direction)
    const keeperMove = Math.random() * 200 - 100;
    
    setGameState('shooting');
    
    // Animate goalkeeper
    Animated.timing(keeperPosition, {
      toValue: keeperMove,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
    
    // Animate ball
    Animated.timing(ballPosition, {
      toValue: { x: xDir, y: yDir },
      duration: 1000,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      // Determine if it's a goal or miss
      const isGoal = Math.abs(keeperMove - xDir) > 80 && Math.abs(xDir) < 150;
      
      setGameState(isGoal ? 'scored' : 'missed');
      
      if (isGoal) {
        setScore(prevScore => prevScore + 1);
      }
      
      // Reset after delay
      setTimeout(() => {
        resetPositions();
        setGameState('ready');
      }, 1500);
    });
  };
  
  useEffect(() => {
    // Initialize game
    resetPositions();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      
      <View style={styles.gameArea}>
        {/* Goal */}
        <View style={styles.goalPost}>
          <View style={styles.crossbar} />
          <View style={styles.leftPost} />
          <View style={styles.rightPost} />
          <View style={styles.net} />
        </View>
        
        {/* Goalkeeper */}
        <Animated.View 
          style={[
            styles.goalkeeper,
            {
              transform: [
                { translateX: keeperPosition }
              ]
            }
          ]}
        />
        
        {/* Ball */}
        <Animated.View 
          style={[
            styles.ball,
            {
              transform: [
                { translateX: ballPosition.x },
                { translateY: ballPosition.y }
              ]
            }
          ]}
        />
      </View>
      
      {gameState === 'scored' && (
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { color: 'gold' }]}>GOAL!</Text>
        </View>
      )}
      
      {gameState === 'missed' && (
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { color: 'red' }]}>MISSED!</Text>
        </View>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Tap SHOOT to take a penalty!
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.shootButton, gameState !== 'ready' && styles.disabledButton]}
        onPress={handleShoot}
        disabled={gameState !== 'ready'}
      >
        <Text style={styles.shootButtonText}>
          {gameState === 'ready' ? 'SHOOT!' : '...'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  scoreContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalPost: {
    width: 300,
    height: 200,
    borderWidth: 5,
    borderColor: 'white',
    position: 'absolute',
    top: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  crossbar: {
    width: 300,
    height: 5,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
  },
  leftPost: {
    width: 5,
    height: 200,
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
  },
  rightPost: {
    width: 5,
    height: 200,
    backgroundColor: 'white',
    position: 'absolute',
    right: 0,
  },
  net: {
    width: 290,
    height: 195,
    position: 'absolute',
    top: 5,
    left: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  goalkeeper: {
    width: 60,
    height: 90,
    backgroundColor: 'red',
    position: 'absolute',
    top: 150,
    borderRadius: 10,
  },
  ball: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 100,
    borderWidth: 1,
    borderColor: 'black',
  },
  shootButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#FF4136',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  shootButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 10,
  },
  messageText: {
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 8,
  },
  infoText: {
    textAlign: 'center',
    color: '#333',
  },
});