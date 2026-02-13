// Raksha — Blackout Screen
// "The phone looks dead" — screen goes 100% black with only a dim clock.
// While active: recording audio, uploading GPS, sending automated messages.

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    StatusBar,
} from 'react-native';
import { COLORS, TYPOGRAPHY, BLACKOUT_CONFIG } from '../config/constants';

/**
 * BlackoutScreen — Full-screen black overlay.
 * Only a very dim clock is visible.
 * Triple-tap on the clock area to exit.
 *
 * @param {boolean} visible
 * @param {function} onExit - called when user triple-taps to exit
 * @param {boolean} isRecording
 */
export default function BlackoutScreen({ visible, onExit, isRecording }) {
    const [currentTime, setCurrentTime] = useState(getTimeString());
    const tapCount = useRef(0);
    const tapTimer = useRef(null);

    useEffect(() => {
        if (!visible) return;

        const interval = setInterval(() => {
            setCurrentTime(getTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, [visible]);

    const handleTap = () => {
        tapCount.current += 1;

        if (tapCount.current >= BLACKOUT_CONFIG.EXIT_TAP_COUNT) {
            tapCount.current = 0;
            if (tapTimer.current) clearTimeout(tapTimer.current);
            if (onExit) onExit();
            return;
        }

        if (tapTimer.current) clearTimeout(tapTimer.current);
        tapTimer.current = setTimeout(() => {
            tapCount.current = 0;
        }, BLACKOUT_CONFIG.EXIT_TAP_WINDOW_MS);
    };

    if (!visible) return null;

    return (
        <TouchableWithoutFeedback onPress={handleTap}>
            <View style={styles.container}>
                <StatusBar hidden />
                <Text style={styles.clock}>{currentTime}</Text>
                {/* Extremely subtle recording indicator — just a faint dot */}
                {isRecording && <View style={styles.recordingDot} />}
            </View>
        </TouchableWithoutFeedback>
    );
}

function getTimeString() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    clock: {
        fontFamily: TYPOGRAPHY.MONO,
        fontSize: 48,
        color: COLORS.WHITE,
        opacity: BLACKOUT_CONFIG.CLOCK_OPACITY,
        letterSpacing: 4,
    },
    recordingDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: COLORS.WHITE,
        opacity: 0.04,
        marginTop: 20,
    },
});
