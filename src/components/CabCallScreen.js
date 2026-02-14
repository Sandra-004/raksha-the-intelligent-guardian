// Raksha — Cab Call Screen
// Active call with timed subtitle display

import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../config/constants';
import { FAKE_CALL_CONFIG } from '../config/constants';

export default function CabCallScreen({ visible, dialogueData = [], onEndCall }) {
    const [callDuration, setCallDuration] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gapCountdown, setGapCountdown] = useState(0);
    const [totalGapSeconds, setTotalGapSeconds] = useState(0);
    const timerRef = useRef(null);
    const dialogueTimerRef = useRef(null);
    const gapTimerRef = useRef(null);

    useEffect(() => {
        if (!visible) {
            setCallDuration(0);
            setCurrentIndex(0);
            setGapCountdown(0);
            setTotalGapSeconds(0);
            return;
        }

        timerRef.current = setInterval(() => setCallDuration(p => p + 1), 1000);

        if (dialogueData.length > 0) {
            startDialogueAt(0);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
            if (gapTimerRef.current) clearInterval(gapTimerRef.current);
        };
    }, [visible]);

    const startDialogueAt = (index) => {
        if (index >= dialogueData.length) {
            setCurrentIndex(index); // Show "script complete"
            return;
        }

        // Clear previous timers
        if (gapTimerRef.current) clearInterval(gapTimerRef.current);
        if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);

        setCurrentIndex(index);
        const item = dialogueData[index];
        const gapSeconds = Math.ceil(item.gapMs / 1000);
        setTotalGapSeconds(gapSeconds);
        setGapCountdown(gapSeconds);

        let remaining = gapSeconds;
        gapTimerRef.current = setInterval(() => {
            remaining -= 1;
            setGapCountdown(remaining);
            if (remaining <= 0) {
                clearInterval(gapTimerRef.current);
                gapTimerRef.current = null;
            }
        }, 1000);

        dialogueTimerRef.current = setTimeout(() => {
            startDialogueAt(index + 1);
        }, item.gapMs);
    };

    if (!visible) return null;

    const m = Math.floor(callDuration / 60).toString().padStart(2, '0');
    const s = (callDuration % 60).toString().padStart(2, '0');
    const currentDialogue = dialogueData[currentIndex];
    const nextDialogue = dialogueData[currentIndex + 1];
    const progressPercent = totalGapSeconds > 0 ? (gapCountdown / totalGapSeconds) * 100 : 0;

    return (
        <View style={styles.container}>
            {/* Call Info */}
            <View style={styles.infoSection}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={28} color={COLORS.TEXT_SECONDARY} />
                </View>
                <Text style={styles.callerName}>{FAKE_CALL_CONFIG.CALLER_NAME_CAB}</Text>
                <Text style={styles.timer}>{m}:{s}</Text>
            </View>

            {/* Subtitle Area */}
            <View style={styles.subtitleArea}>
                {currentDialogue && currentIndex < dialogueData.length && (
                    <View style={styles.currentCard}>
                        <Text style={styles.cardLabel}>They say:</Text>
                        <Text style={styles.cardText}>"{currentDialogue.dialogue}"</Text>
                    </View>
                )}

                {gapCountdown > 0 && currentIndex < dialogueData.length && (
                    <View style={styles.gapWrap}>
                        <Text style={styles.gapText}>Your turn — {gapCountdown}s</Text>
                        <View style={styles.gapBar}>
                            <View
                                style={[styles.gapBarFill, { width: `${progressPercent}%` }]}
                            />
                        </View>
                    </View>
                )}

                {nextDialogue && (
                    <View style={styles.nextCard}>
                        <Text style={styles.nextLabel}>Next:</Text>
                        <Text style={styles.nextText}>"{nextDialogue.dialogue}"</Text>
                    </View>
                )}

                {currentIndex >= dialogueData.length && dialogueData.length > 0 && (
                    <Text style={styles.endText}>Script complete</Text>
                )}
            </View>

            {/* End Call */}
            <TouchableOpacity style={styles.endCall} onPress={onEndCall} activeOpacity={0.7}>
                <Ionicons name="call" size={28} color={COLORS.WHITE} style={{ transform: [{ rotate: '135deg' }] }} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.BG,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
        zIndex: 2000,
    },
    infoSection: {
        alignItems: 'center',
        marginTop: 30,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.SURFACE,
        borderWidth: 1,
        borderColor: COLORS.BORDER_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.SM,
    },
    callerName: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.TITLE,
        color: COLORS.TEXT,
        fontWeight: '500',
    },
    timer: {
        fontFamily: TYPOGRAPHY.MONO,
        fontSize: TYPOGRAPHY.CAPTION,
        color: COLORS.TEXT_MUTED,
        marginTop: 4,
        letterSpacing: 2,
    },
    subtitleArea: {
        flex: 1,
        width: '100%',
        paddingHorizontal: SPACING.LG,
        justifyContent: 'center',
    },
    currentCard: {
        backgroundColor: COLORS.SURFACE,
        borderRadius: RADIUS.MD,
        padding: SPACING.LG,
        marginBottom: SPACING.MD,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
    },
    cardLabel: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.TINY,
        color: COLORS.TEXT_MUTED,
        letterSpacing: 1,
        marginBottom: SPACING.SM,
        textTransform: 'uppercase',
    },
    cardText: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.HEADING,
        color: COLORS.TEXT,
        lineHeight: 26,
        fontStyle: 'italic',
    },
    gapWrap: {
        marginBottom: SPACING.MD,
        alignItems: 'center',
    },
    gapText: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.CAPTION,
        color: COLORS.TEXT_SECONDARY,
        marginBottom: SPACING.SM,
    },
    gapBar: {
        width: '100%',
        height: 3,
        backgroundColor: COLORS.BORDER,
        borderRadius: 2,
    },
    gapBarFill: {
        height: 3,
        backgroundColor: COLORS.ACCENT,
        borderRadius: 2,
    },
    nextCard: {
        backgroundColor: COLORS.ELEVATED,
        borderRadius: RADIUS.MD,
        padding: SPACING.MD,
        opacity: 0.6,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
    },
    nextLabel: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.TINY,
        color: COLORS.TEXT_MUTED,
        letterSpacing: 1,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    nextText: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.BODY,
        color: COLORS.TEXT_SECONDARY,
        fontStyle: 'italic',
    },
    endText: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.CAPTION,
        color: COLORS.TEXT_MUTED,
        textAlign: 'center',
    },
    endCall: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: COLORS.DANGER,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
});
