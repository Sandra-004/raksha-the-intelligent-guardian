// Audio Utilities for Raksha (Deterrent & Evidence)

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { EMERGENCY_CONFIG, FEATURE_FLAGS } from '../config/constants';
import { generateEvidenceFilename } from './sensorUtils';

let recordingInstance = null;
let soundInstance = null;

/**
 * Request Audio Permissions
 */
export const requestAudioPermission = async () => {
  try {
    const { status } = await Audio.requestPermissionsAsync();

    if (status !== 'granted') {
      console.warn('Audio permission denied');
      return false;
    }

    // Configure audio mode for recording and playback
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    return true;
  } catch (error) {
    console.error('Audio permission error:', error);
    return false;
  }
};

/**
 * Play "Indian Dad" Deterrent Audio
 * Uses Text-to-Speech simulation (in production, use pre-recorded audio)
 */
export const playDeterrentAudio = async () => {
  try {
    // Stop any existing sound
    if (soundInstance) {
      await soundInstance.unloadAsync();
    }

    // In a real implementation, you would load a pre-recorded audio file:
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../assets/deterrent_audio.mp3'),
    //   { shouldPlay: true, volume: 1.0 }
    // );

    // For demo purposes, we'll simulate with a system sound
    // In production, replace this with actual pre-recorded audio
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://www.soundjay.com/phone/sounds/telephone-ring-01a.mp3' },
      {
        shouldPlay: true,
        volume: 1.0,
        isLooping: false,
      }
    );

    soundInstance = sound;

    // Play for 3 seconds then speak the script
    setTimeout(async () => {
      await sound.stopAsync();
      await sound.unloadAsync();

      // In production, play the actual voice script here
      console.log('🎙️ Playing Deterrent Script:', EMERGENCY_CONFIG.DETERRENT_AUDIO_SCRIPT);
    }, 3000);

    return true;
  } catch (error) {
    console.error('Deterrent audio error:', error);
    return false;
  }
};

/**
 * Start Stealth Evidence Recording
 */
export const startEvidenceRecording = async () => {
  if (!FEATURE_FLAGS.ENABLE_AUDIO_RECORDING) {
    console.log('Audio recording disabled in config');
    return null;
  }

  try {
    // Stop any existing recording
    if (recordingInstance) {
      await recordingInstance.stopAndUnloadAsync();
    }

    // Create new recording
    const recording = new Audio.Recording();

    await recording.prepareToRecordAsync({
      android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
      },
    });

    await recording.startAsync();
    recordingInstance = recording;

    console.log('🎙️ Evidence recording started successfully');
    console.log('🎙️ Recording URI:', recording.getURI());

    return {
      recording,
      startTime: Date.now(),
    };
  } catch (error) {
    console.error('Recording start error:', error);
    return null;
  }
};

/**
 * Stop Recording and Save Evidence
 */
export const stopEvidenceRecording = async () => {
  if (!recordingInstance) {
    console.log('No active recording to stop');
    return null;
  }

  try {
    await recordingInstance.stopAndUnloadAsync();
    const uri = recordingInstance.getURI();

    // Generate evidence filename
    const filename = generateEvidenceFilename('audio');
    const newPath = `${FileSystem.documentDirectory}${filename}`;

    // Move file to permanent storage
    if (uri) {
      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      console.log('💾 Evidence saved successfully:', filename);
      console.log('💾 Full path:', newPath);

      const info = await FileSystem.getInfoAsync(newPath);

      recordingInstance = null;

      return {
        filename,
        path: newPath,
        size: info.size,
        timestamp: Date.now(),
      };
    }

    return null;
  } catch (error) {
    console.error('Recording stop error:', error);
    console.error('Stack trace:', error.stack);
    return null;
  }
};

/**
 * Get Recording Status
 */
export const getRecordingStatus = async () => {
  if (!recordingInstance) {
    return { isRecording: false };
  }

  try {
    const status = await recordingInstance.getStatusAsync();
    return {
      isRecording: status.isRecording,
      duration: status.durationMillis,
      canRecord: status.canRecord,
    };
  } catch (error) {
    return { isRecording: false };
  }
};

/**
 * Cleanup audio resources
 */
export const cleanupAudio = async () => {
  try {
    if (recordingInstance) {
      await recordingInstance.stopAndUnloadAsync();
      recordingInstance = null;
    }

    if (soundInstance) {
      await soundInstance.unloadAsync();
      soundInstance = null;
    }
  } catch (error) {
    console.error('Audio cleanup error:', error);
  }
};