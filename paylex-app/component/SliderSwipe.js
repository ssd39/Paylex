import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import Wave, { HEIGHT, MARGIN_WIDTH, WIDTH } from "./Wave";
import { PanGestureHandler } from "react-native-gesture-handler";
import { snapPoint, useVector } from "react-native-redash";
import { MIN_LEDGE } from './Wave';

const PREV = WIDTH;
const NEXT = 0;

const SliderSwipe = ({
  index,
  children: current,
  prev,
  next,
  setIndex,
  setConfirm
}) => {
  const hasPrev = !!prev;
  const hasNext = !!next;
  const activeSide = useSharedValue(2);
  const zIndex = useSharedValue(0);
  const isTransitioningLeft = useSharedValue(false);
  const isTransitioningRight = useSharedValue(false);
  const left = useVector(0, HEIGHT / 2);
  const right = useVector(0, HEIGHT / 2);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: ({ x }) => {
      if (x < MARGIN_WIDTH && hasPrev) {
        activeSide.value = 0;
        zIndex.value = 100;
      } else if (x > WIDTH - MARGIN_WIDTH && hasNext) {
        activeSide.value = 1;
      } else {
        activeSide.value = 2;
      }
    },
    onActive: ({ x, y }) => {
      if (activeSide.value === 0) {
        left.x.value = Math.max(x, MARGIN_WIDTH);
        left.y.value = y;
      } else if (activeSide.value === 1) {
        right.x.value = Math.max(WIDTH - x, MARGIN_WIDTH);
        right.y.value = y;
      }
    },
    onEnd: ({ x, velocityX, velocityY }) => {
      if (activeSide.value === 0) {
        const snapPoints = [MIN_LEDGE, WIDTH];
        const dest = snapPoint(x, velocityX, snapPoints);
        isTransitioningLeft.value = dest === WIDTH;
        left.y.value = withSpring(HEIGHT / 2, { velocity: velocityY })
        left.x.value = withSpring(
          dest,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningLeft.value ? true : false,
            restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningLeft.value) {
              runOnJS(setIndex)(index - 1);
            } else {
              activeSide.value = 2
            }
          }
        );
      } else if (activeSide.value === 1) {
        const snapPoints = [WIDTH - MIN_LEDGE, 0];
        const dest = snapPoint(x, velocityX, snapPoints);
        isTransitioningRight.value = dest === 0;
        right.y.value = withSpring(HEIGHT / 2, {velocity: velocityY})
        right.x.value = withSpring(
          WIDTH - dest,
          { 
            velocity: velocityX,
            overshootClamping: isTransitioningRight.value ? true : false,
            restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningRight.value) {
              runOnJS(setIndex)(1);
              runOnJS(setConfirm)(true)
            }
          }
        );
      }
    },
  });

  useEffect(() => {
    left.x.value = withSpring(MIN_LEDGE);
    right.x.value = withSpring(MIN_LEDGE);
  }, []);

  const leftStyle = useAnimatedStyle(() => ({
    zIndex: zIndex.value,
  }));
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={StyleSheet.absoluteFill}>
        {current}
        {prev && (
          <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
            <Wave side={0} position={left} isTransitioning={isTransitioningLeft}>
              {prev}
            </Wave>
          </Animated.View>
        )}
        {next && (
          <Animated.View style={StyleSheet.absoluteFill}>
            <Wave side={1} position={right} isTransitioning={isTransitioningRight}>
              {next}
            </Wave>
          </Animated.View>
        )}
      </Animated.View>
    </PanGestureHandler>
  );
};

export default SliderSwipe;