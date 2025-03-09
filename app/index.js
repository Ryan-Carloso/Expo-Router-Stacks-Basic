import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready, shooting, scored, missed
  const [ballPosition] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [keeperPosition] = useState(new Animated.Value(0));
  const [shotDirection, setShotDirection] = useState({ x: 0, y: 0 });
  const [ballScale] = useState(new Animated.Value(1));
  const goalPostRef = useRef(null);
  
  // Field dimensions
  const goalWidth = width * 0.8;
  const goalHeight = height * 0.25;
  const keeperWidth = 50;
  const ballSize = 30;
  
  // Reset ball and keeper positions
  const resetPositions = () => {
    ballPosition.setValue({ x: 0, y: 0 });
    keeperPosition.setValue(0);
    ballScale.setValue(1);
  };
  
  // Handle shoot button press
  const handleShoot = () => {
    if (gameState !== 'ready') return;
    
    // Random shot direction (left/right/center and top/middle/bottom)
    const xDir = Math.random() * (goalWidth - 40) - (goalWidth / 2 - 20);
    const yDir = -(height * 0.3) - Math.random() * 50;
    setShotDirection({ x: xDir, y: yDir });
    
    // Random keeper move (doesn't always match shot direction)
    const keeperMove = (Math.random() - 0.5) * (goalWidth - keeperWidth - 20);
    
    setGameState('shooting');
    
    // Animate goalkeeper - jumps to a position
    Animated.timing(keeperPosition, {
      toValue: keeperMove,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1)),
    }).start();
    
    // Create ball animation sequence
    const ballAnimations = [
      // First shrink ball slightly as "wind up"
      Animated.timing(ballScale, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      // Then animate ball toward goal with scaling for perspective
      Animated.parallel([
        Animated.timing(ballPosition, {
          toValue: { x: xDir, y: yDir },
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(ballScale, {
          toValue: 0.5, // Ball gets smaller as it moves away
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ];
    
    // Run the sequence
    Animated.sequence(ballAnimations).start(() => {
      // Determine if it's a goal or miss
      // Calculate if the ball is inside the goal
      const ballFinalX = xDir;
      
      // Check if keeper caught the ball (intersection of keeper and ball positions)
      const keeperLeft = keeperMove - (keeperWidth / 2);
      const keeperRight = keeperMove + (keeperWidth / 2);
      
      const isBlocked = 
        ballFinalX > keeperLeft - ballSize/2 && 
        ballFinalX < keeperRight + ballSize/2;
      
      // Check if ball is inside goal posts
      const isInGoal = 
        Math.abs(ballFinalX) < (goalWidth/2 - 15);
      
      const isGoal = isInGoal && !isBlocked;
      
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
        {/* Field */}
        <View style={styles.field} />
        
        {/* Goal */}
        <View 
          ref={goalPostRef}
          style={[
            styles.goalPost,
            { width: goalWidth, height: goalHeight }
          ]}
        >
          <View style={styles.crossbar} />
          <View style={styles.leftPost} />
          <View style={styles.rightPost} />
          <View style={styles.netVertical} />
          <View style={styles.netHorizontal} />
        </View>
        
        {/* Goalkeeper */}
        <Animated.View 
          style={[
            styles.goalkeeper,
            { width: keeperWidth },
            {
              transform: [
                { translateX: keeperPosition }
              ]
            }
          ]}
        >
          <View style={styles.keeperHead} />
          <View style={styles.keeperBody} />
          <View style={styles.keeperLeftArm} />
          <View style={styles.keeperRightArm} />
        </Animated.View>
        
        {/* Ball */}
        <Animated.View 
          style={[
            styles.ball,
            { width: ballSize, height: ballSize },
            {
              transform: [
                { translateX: ballPosition.x },
                { translateY: ballPosition.y },
                { scale: ballScale }
              ]
            }
          ]}
        >
          <View style={styles.ballPattern} />
          <View style={[styles.ballPattern, { transform: [{ rotate: '90deg' }] }]} />
        </Animated.View>
      </View>
      
      {gameState === 'scored' && (
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { color: 'gold' }]}>GOAL!</Text>
        </View>
      )}
      
      {gameState === 'missed' && (
        <View style={styles.messageContainer}>
          <Text style={[styles.messageText, { color: 'red' }]}>SAVED!</Text>
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
  field: {
    position: 'absolute',
    width: '100%',
    height: '70%',
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
  goalPost: {
    borderWidth: 8,
    borderColor: 'white',
    position: 'absolute',
    top: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
  },
  crossbar: {
    width: '100%',
    height: 8,
    backgroundColor: 'white',
    position: 'absolute',
    top: -8,
    borderRadius: 4,
  },
  leftPost: {
    width: 8,
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    left: -8,
    borderRadius: 4,
  },
  rightPost: {
    width: 8,
    height: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    right: -8,
    borderRadius: 4,
  },
  netVertical: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  netHorizontal: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
  },
  goalkeeper: {
    height: 90,
    position: 'absolute',
    top: 150,
    alignItems: 'center',
  },
  keeperHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    position: 'absolute',
    top: -10,
  },
  keeperBody: {
    width: '100%',
    height: 70,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  keeperLeftArm: {
    width: 40,
    height: 10,
    backgroundColor: 'red',
    position: 'absolute',
    top: 15,
    left: -35,
    borderRadius: 5,
    transform: [{ rotate: '30deg' }],
  },
  keeperRightArm: {
    width: 40,
    height: 10,
    backgroundColor: 'red',
    position: 'absolute',
    top: 15,
    right: -35,
    borderRadius: 5,
    transform: [{ rotate: '-30deg' }],
  },
  ball: {
    borderRadius: 15,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 100,
    borderWidth: 1,
    borderColor: 'black',
    overflow: 'hidden',
  },
  ballPattern: {
    position: 'absolute',
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    top: '50%',
    marginTop: -5,
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
    backgroundColor: '#999',
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