// Raksha — SOS Button
// Big circular emergency button (alternative to slider)

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Vibration, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, TYPOGRAPHY, SPACING } from '../config/constants';

const HOLD_DURATION = 2000; // 2 seconds to activate

export default function SOSButton({ onActivate, disabled = false }) {
    const [holding, setHolding] = useState(false);
    const progress = useRef(new Animated.Value(0)).current;
    const holdTimer = useRef(null);
    const animRef = useRef(null);

    const onPressIn = useCallback(() => {
        if (disabled) return;
        setHolding(true);

        animRef.current = Animated.timing(progress, {
            toValue: 1,
            duration: HOLD_DURATION,
            useNativeDriver: false, // for interpolated styles
        });
        animRef.current.start();

        holdTimer.current = setTimeout(() => {
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            if (onActivate) onActivate();
            // Reset
            setHolding(false);
            progress.setValue(0);
        }, HOLD_DURATION);
    }, [disabled, onActivate, progress]);

    const onPressOut = useCallback(() => {
        if (holdTimer.current) {
            clearTimeout(holdTimer.current);
            holdTimer.current = null;
        }
        if (animRef.current) {
            animRef.current.stop();
        }
        progress.setValue(0);
        setHolding(false);
    }, [progress]);

    const borderColor = progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [COLORS.DANGER, '#FF4444', '#FF0000'],
    });

    const scale = progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.05, 1.1],
    });

    const ringOpacity = progress.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [0, 0.3, 0.6],
    });

    return (
        <View style={styles.wrapper}>
            <TouchableWithoutFeedback
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={disabled}
            >
                <View style={styles.center}>
                    {/* Outer pulse ring */}
                    <Animated.View
                        style={[
                            styles.ring,
                            { opacity: ringOpacity, transform: [{ scale: Animated.add(scale, 0.2) }] },
                        ]}
                    />

                    {/* Main button */}
                    <Animated.View
                        style={[
                            styles.button,
                            { borderColor, transform: [{ scale }] },
                            disabled && styles.buttonDisabled,
                        ]}
                    >
                        <Ionicons
                            name="alert-circle"
                            size={40}
                            color={holding ? '#FF0000' : COLORS.DANGER}
                        />
                        <Text style={[styles.sosText, holding && styles.sosTextActive]}>SOS</Text>
                        <Text style={styles.holdText}>
                            {holding ? 'Keep holding...' : 'Hold for 2s'}
                        </Text>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingBottom: 30,
        paddingTop: 10,
        alignItems: 'center',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: COLORS.DANGER,
    },
    button: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: COLORS.SURFACE,
        borderWidth: 3,
        borderColor: COLORS.DANGER,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.3,
    },
    sosText: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.DANGER,
        marginTop: 4,
        letterSpacing: 4,
    },
    sosTextActive: {
        color: '#FF0000',
    },
    holdText: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.MICRO,
        color: COLORS.TEXT_MUTED,
        marginTop: 4,
    },
});
