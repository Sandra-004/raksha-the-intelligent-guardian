// Raksha — Audio Utilities
// Evidence recording, playback, scream detection
// Scream detection uses a SEPARATE recording instance

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { SCREAM_DETECTION } from '../config/constants';

let evidenceRecording = null;
let screamRecording = null;
let currentSound = null;
let screamInterval = null;

// ─── RECORDINGS DIRECTORY ───────────────────────────────

const RECORDINGS_DIR = FileSystem.documentDirectory + 'recordings/';

async function ensureRecordingsDir() {
    const dirInfo = await FileSystem.getInfoAsync(RECORDINGS_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(RECORDINGS_DIR, { intermediates: true });
        console.log('[Audio] Created recordings directory');
    }
}

// ─── PERMISSIONS ────────────────────────────────────────

export async function requestAudioPermission() {
    try {
        const { status } = await Audio.requestPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('[Audio] Permission error:', error);
        return false;
    }
}

// ─── EVIDENCE RECORDING ─────────────────────────────────

export function isEvidenceRecording() {
    return evidenceRecording !== null;
}

export async function startEvidenceRecording() {
    try {
        // Stop scream detection first to free the recording slot
        await stopScreamDetection();

        if (evidenceRecording) {
            console.log('[Audio] Evidence recording already active');
            return null;
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        await recording.startAsync();

        evidenceRecording = recording;

        const startTime = Date.now();
        const timestamp = new Date()
            .toISOString()
            .replace(/[:.T]/g, '-')
            .slice(0, 19);
        const filename = `evidence_${timestamp}.m4a`;

        console.log(`[Audio] Evidence recording started: ${filename}`);
        return { recording, startTime, filename };
    } catch (error) {
        console.error('[Audio] Start recording failed:', error);
        return null;
    }
}

export async function stopEvidenceRecording() {
    try {
        if (!evidenceRecording) {
            console.log('[Audio] No evidence recording to stop');
            return null;
        }

        await evidenceRecording.stopAndUnloadAsync();
        const tempUri = evidenceRecording.getURI();
        evidenceRecording = null;

        console.log('[Audio] Evidence recording stopped, temp URI:', tempUri);

        if (!tempUri) return null;

        // Copy to permanent recordings directory
        await ensureRecordingsDir();
        const timestamp = new Date()
            .toISOString()
            .replace(/[:.T]/g, '-')
            .slice(0, 19);
        const filename = `evidence_${timestamp}.m4a`;
        const permanentUri = RECORDINGS_DIR + filename;

        try {
            await FileSystem.copyAsync({ from: tempUri, to: permanentUri });
            console.log('[Audio] Recording saved to:', permanentUri);
        } catch (copyErr) {
            console.error('[Audio] Copy failed, using temp URI:', copyErr);
            return { uri: tempUri, filename: tempUri.split('/').pop() || 'evidence.m4a', size: 0 };
        }

        // Get file info
        const info = await FileSystem.getInfoAsync(permanentUri);
        console.log('[Audio] Saved file size:', info.size, 'bytes');

        return { uri: permanentUri, filename, size: info.size || 0 };
    } catch (error) {
        console.error('[Audio] Stop recording failed:', error);
        evidenceRecording = null;
        return null;
    }
}

// ─── RECORDED FILES HISTORY ─────────────────────────────

export async function getRecordedFiles() {
    try {
        await ensureRecordingsDir();
        const files = [];

        // Scan the dedicated recordings directory
        const dirFiles = await FileSystem.readDirectoryAsync(RECORDINGS_DIR);
        console.log('[Audio] Files in recordings dir:', dirFiles);

        for (const file of dirFiles) {
            const ext = file.toLowerCase();
            if (ext.endsWith('.m4a') || ext.endsWith('.mp4') ||
                ext.endsWith('.caf') || ext.endsWith('.wav') ||
                ext.endsWith('.3gp') || ext.endsWith('.aac')) {
                const fullUri = RECORDINGS_DIR + file;
                const info = await FileSystem.getInfoAsync(fullUri);
                files.push({
                    name: file,
                    uri: fullUri,
                    size: info.size || 0,
                    modificationTime: info.modificationTime || 0,
                });
            }
        }

        files.sort((a, b) => b.modificationTime - a.modificationTime);
        console.log('[Audio] Total recordings found:', files.length);
        return files;
    } catch (error) {
        console.error('[Audio] Get recorded files failed:', error);
        return [];
    }
}

export async function deleteRecordedFile(uri) {
    try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
        console.log('[Audio] Deleted:', uri);
        return true;
    } catch (error) {
        console.error('[Audio] Delete file failed:', error);
        return false;
    }
}

export async function shareRecordedFile(uri) {
    try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(uri);
            return true;
        }
        console.log('[Audio] Sharing not available on this platform');
        return false;
    } catch (error) {
        console.error('[Audio] Share file failed:', error);
        return false;
    }
}

// ─── AUDIO PLAYBACK ─────────────────────────────────────

export async function playAudioFile(audioSource, options = {}) {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
            shouldDuckAndroid: false,
        });

        if (currentSound) {
            await currentSound.unloadAsync();
            currentSound = null;
        }

        const { sound } = await Audio.Sound.createAsync(audioSource, {
            shouldPlay: true,
            isLooping: options.loop || false,
            volume: options.volume !== undefined ? options.volume : 1.0,
        });

        currentSound = sound;

        if (options.onFinish) {
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish && !status.isLooping) {
                    options.onFinish();
                }
            });
        }

        return sound;
    } catch (error) {
        console.error('[Audio] Playback failed:', error);
        return null;
    }
}

export async function stopAudioPlayback() {
    try {
        if (currentSound) {
            await currentSound.stopAsync();
            await currentSound.unloadAsync();
            currentSound = null;
        }
    } catch (error) {
        console.error('[Audio] Stop playback failed:', error);
        currentSound = null;
    }
}

// ─── SCREAM DETECTION ───────────────────────────────────

export async function startScreamDetection(onScreamDetected) {
    try {
        if (evidenceRecording) {
            console.log('[Audio] Skipping scream detection — evidence recording active');
            return;
        }

        // Clean up existing scream detection
        if (screamRecording || screamInterval) {
            await stopScreamDetection();
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
        });

        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync({
            ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
            isMeteringEnabled: true,
        });
        await recording.startAsync();

        let sustainedLoudCount = 0;
        const requiredSustainedSamples = Math.ceil(
            SCREAM_DETECTION.SUSTAINED_DURATION_MS / SCREAM_DETECTION.SAMPLE_INTERVAL_MS
        );

        screamInterval = setInterval(async () => {
            try {
                if (!screamRecording) return;
                const status = await recording.getStatusAsync();
                if (status.isRecording && status.metering !== undefined) {
                    if (status.metering > SCREAM_DETECTION.AMPLITUDE_THRESHOLD) {
                        sustainedLoudCount++;
                        if (sustainedLoudCount >= requiredSustainedSamples) {
                            console.log('[Audio] SCREAM DETECTED — metering:', status.metering);
                            sustainedLoudCount = 0;
                            if (onScreamDetected) onScreamDetected();
                        }
                    } else {
                        sustainedLoudCount = 0;
                    }
                }
            } catch (e) { /* ignore metering errors */ }
        }, SCREAM_DETECTION.SAMPLE_INTERVAL_MS);

        screamRecording = recording;
        console.log('[Audio] Scream detection started');
    } catch (error) {
        console.error('[Audio] Scream detection start failed:', error);
        screamRecording = null;
        screamInterval = null;
    }
}

export async function stopScreamDetection() {
    try {
        if (screamInterval) {
            clearInterval(screamInterval);
            screamInterval = null;
        }
        if (screamRecording) {
            try { await screamRecording.stopAndUnloadAsync(); } catch (e) { }
            screamRecording = null;
        }
        console.log('[Audio] Scream detection stopped');
    } catch (error) {
        console.error('[Audio] Scream detection stop failed:', error);
        screamRecording = null;
        screamInterval = null;
    }
}

// ─── CLEANUP ────────────────────────────────────────────

export async function cleanupAudio() {
    await stopAudioPlayback();
    await stopScreamDetection();
    if (evidenceRecording) {
        try { await evidenceRecording.stopAndUnloadAsync(); } catch (e) { }
        evidenceRecording = null;
    }
}
