// Raksha — History Screen
// Recorded audio files with play, share, and delete

import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../config/constants';
import {
    getRecordedFiles,
    deleteRecordedFile,
    shareRecordedFile,
} from '../utils/audioUtils';

export default function HistoryScreen({ visible, onClose }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [playingUri, setPlayingUri] = useState(null);
    const soundRef = useRef(null);

    useEffect(() => {
        if (visible) loadFiles();
        return () => stopPlayback();
    }, [visible]);

    const loadFiles = async () => {
        setLoading(true);
        const result = await getRecordedFiles();
        setFiles(result);
        setLoading(false);
    };

    const stopPlayback = async () => {
        if (soundRef.current) {
            try {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
            } catch (e) { }
            soundRef.current = null;
            setPlayingUri(null);
        }
    };

    const handlePlay = async (uri) => {
        // If already playing this file, stop it
        if (playingUri === uri) {
            await stopPlayback();
            return;
        }

        // Stop any current playback
        await stopPlayback();

        try {
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
            });

            const { sound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true }
            );

            soundRef.current = sound;
            setPlayingUri(uri);

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setPlayingUri(null);
                    soundRef.current = null;
                }
            });
        } catch (error) {
            console.error('[History] Playback failed:', error);
            setPlayingUri(null);
        }
    };

    const handleDelete = async (uri) => {
        if (playingUri === uri) await stopPlayback();
        const success = await deleteRecordedFile(uri);
        if (success) setFiles(prev => prev.filter(f => f.uri !== uri));
    };

    const handleShare = async (uri) => {
        await shareRecordedFile(uri);
    };

    const handleClose = async () => {
        await stopPlayback();
        onClose();
    };

    const formatSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDate = (ts) => {
        if (!ts) return '';
        return new Date(ts * 1000).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
        });
    };

    const renderItem = ({ item }) => {
        const isPlaying = playingUri === item.uri;
        return (
            <View style={styles.fileRow}>
                {/* Play button */}
                <TouchableOpacity
                    style={[styles.playBtn, isPlaying && styles.playBtnActive]}
                    onPress={() => handlePlay(item.uri)}
                >
                    <Ionicons
                        name={isPlaying ? 'stop' : 'play'}
                        size={16}
                        color={isPlaying ? COLORS.DANGER : COLORS.ACCENT}
                    />
                </TouchableOpacity>

                <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.fileMeta}>
                        {formatSize(item.size)}  {formatDate(item.modificationTime)}
                    </Text>
                </View>

                <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item.uri)}>
                    <Ionicons name="share-outline" size={18} color={COLORS.TEXT_SECONDARY} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.uri)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.DANGER} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Recordings</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={22} color={COLORS.TEXT_SECONDARY} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <Text style={styles.emptyText}>Loading...</Text>
                    ) : files.length === 0 ? (
                        <View style={styles.emptyWrap}>
                            <Ionicons name="mic-off-outline" size={40} color={COLORS.TEXT_MUTED} />
                            <Text style={styles.emptyText}>No recordings yet</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={files}
                            keyExtractor={item => item.uri}
                            renderItem={renderItem}
                            style={styles.list}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        paddingTop: 60,
    },
    container: {
        flex: 1,
        marginHorizontal: SPACING.MD,
        backgroundColor: COLORS.SURFACE,
        borderTopLeftRadius: RADIUS.XL,
        borderTopRightRadius: RADIUS.XL,
        borderWidth: 1,
        borderColor: COLORS.BORDER,
        borderBottomWidth: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.LG,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    title: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.TITLE,
        color: COLORS.TEXT,
        fontWeight: '600',
    },
    closeBtn: {
        padding: SPACING.SM,
    },
    list: {
        flex: 1,
    },
    fileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.LG,
        paddingVertical: SPACING.MD,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.BORDER,
    },
    playBtn: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.SM,
        backgroundColor: COLORS.ACCENT_DIM,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.MD,
    },
    playBtnActive: {
        backgroundColor: COLORS.DANGER_DIM,
    },
    fileInfo: {
        flex: 1,
        marginRight: SPACING.SM,
    },
    fileName: {
        fontFamily: TYPOGRAPHY.MONO,
        fontSize: TYPOGRAPHY.TINY,
        color: COLORS.TEXT,
    },
    fileMeta: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.MICRO,
        color: COLORS.TEXT_MUTED,
        marginTop: 2,
    },
    actionBtn: {
        padding: SPACING.SM,
        marginLeft: SPACING.XS,
    },
    emptyWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.MD,
    },
    emptyText: {
        fontFamily: TYPOGRAPHY.FONT_FAMILY,
        fontSize: TYPOGRAPHY.BODY,
        color: COLORS.TEXT_MUTED,
    },
});
