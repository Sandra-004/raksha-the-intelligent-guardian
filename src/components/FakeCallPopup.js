// Raksha — Fake Call Popup
// Scenario selector: Stalking or Cab

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../config/constants';

export default function FakeCallPopup({ visible, onSelectStalking, onSelectCab, onClose }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Choose Scenario</Text>

                    <TouchableOpacity style={styles.option} onPress={onSelectStalking} activeOpacity={0.7}>
                        <View style={[styles.iconWrap, { backgroundColor: COLORS.DANGER_DIM }]}>
                            <Ionicons name="eye-outline" size={22} color={COLORS.DANGER} />
                        </View>
                        <View style={styles.optionInfo}>
                            <Text style={styles.optionLabel}>Stalking</Text>
                            <Text style={styles.optionDesc}>Deterrent call from Dad</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={COLORS.TEXT_MUTED} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={onSelectCab} activeOpacity={0.7}>
                        <View style={[styles.iconWrap, { backgroundColor: COLORS.ACCENT_DIM }]}>
                            <Ionicons name="car-outline" size={22} color={COLORS.ACCENT} />
                        </View>
                        <View style={styles.optionInfo}>
                            <Text style={styles.optionLabel}>Cab Safety</Text>
                            <Text style={styles.optionDesc}>Guided call with Dad</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={COLORS.TEXT_MUTED} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
        padding: SPACING.MD,
        paddingBottom: SPACING.XXL,
    },
    container: {
        backgroundColor: COLORS.SURFACE,
        borderRadius: RADIUS.XL,
        padding: SPACING.LG,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
    },
    title: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.HEADING,
        color: COLORS.TEXT,
        fontWeight: '600',
        marginBottom: SPACING.LG,
        textAlign: 'center',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.ELEVATED,
        borderRadius: RADIUS.MD,
        padding: SPACING.MD,
        marginBottom: SPACING.SM,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.SM,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.MD,
    },
    optionInfo: {
        flex: 1,
    },
    optionLabel: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.BODY,
        color: COLORS.TEXT,
        fontWeight: '500',
    },
    optionDesc: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.TINY,
        color: COLORS.TEXT_MUTED,
        marginTop: 2,
    },
    cancelBtn: {
        alignItems: 'center',
        paddingVertical: SPACING.MD,
        marginTop: SPACING.SM,
    },
    cancelText: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.BODY,
        color: COLORS.TEXT_MUTED,
    },
});
