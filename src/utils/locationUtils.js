// Raksha — Location Utilities
// GPS acquisition, emergency alert dispatch via WhatsApp / SMS

import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';
import { EMERGENCY_CONFIG } from '../config/constants';

/**
 * Request foreground location permission.
 * @returns {Promise<boolean>}
 */
export async function requestLocationPermission() {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        console.error('[Location] Permission error:', error);
        return false;
    }
}

/**
 * Get current GPS coordinates with high accuracy.
 * Falls back to last known position on failure.
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number} | null>}
 */
export async function getCurrentLocation() {
    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 0,
        });
        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
        };
    } catch (error) {
        console.warn('[Location] High-accuracy failed, trying last known:', error);
        try {
            const lastLocation = await Location.getLastKnownPositionAsync();
            if (lastLocation) {
                return {
                    latitude: lastLocation.coords.latitude,
                    longitude: lastLocation.coords.longitude,
                    accuracy: lastLocation.coords.accuracy,
                };
            }
        } catch (fallbackError) {
            console.error('[Location] Fallback failed:', fallbackError);
        }
        return null;
    }
}

/**
 * Create a Google Maps URL from coordinates.
 */
export function createGoogleMapsURL(location) {
    if (!location) return 'Location unavailable';
    return `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
}

/**
 * Send an emergency alert via WhatsApp deep link, with SMS fallback.
 * @returns {Promise<{success: boolean, method: string}>}
 */
export async function sendEmergencyAlert() {
    try {
        const location = await getCurrentLocation();
        const mapsURL = createGoogleMapsURL(location);
        const message = EMERGENCY_CONFIG.SOS_MESSAGE_TEMPLATE(mapsURL);
        const encodedMessage = encodeURIComponent(message);
        const phone = EMERGENCY_CONFIG.EMERGENCY_PHONE;

        // Try WhatsApp first
        const whatsappURL = `whatsapp://send?text=${encodedMessage}&phone=91${phone}`;
        const canOpenWA = await Linking.canOpenURL(whatsappURL);

        if (canOpenWA) {
            await Linking.openURL(whatsappURL);
            return { success: true, method: 'WhatsApp' };
        }

        // Fallback to SMS
        const smsURL = Platform.select({
            ios: `sms:${phone}&body=${encodedMessage}`,
            android: `sms:${phone}?body=${encodedMessage}`,
            default: `sms:${phone}?body=${encodedMessage}`,
        });

        await Linking.openURL(smsURL);
        return { success: true, method: 'SMS' };
    } catch (error) {
        console.error('[Emergency] Alert failed:', error);
        return { success: false, method: 'none' };
    }
}

/**
 * Send a silent SOS (no opening WhatsApp/SMS UI) — used by auto-SOS after fall.
 * In a real production app this would use a backend API.
 * For now, we log it and the blackout screen handles the stealth.
 */
export async function sendSilentSOS() {
    try {
        const location = await getCurrentLocation();
        const mapsURL = createGoogleMapsURL(location);
        console.log('🚨 SILENT SOS DISPATCHED:', mapsURL);
        // In production: POST to backend API here
        return { success: true, method: 'silent', location };
    } catch (error) {
        console.error('[Emergency] Silent SOS failed:', error);
        return { success: false, method: 'none' };
    }
}
