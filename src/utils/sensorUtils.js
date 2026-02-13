// Raksha — Sensor Utilities
// Fall detection via accelerometer state machine

import { SENSOR_THRESHOLDS } from '../config/constants';

/**
 * Calculates the total acceleration magnitude from x, y, z axes.
 * At rest, this value is ~1.0 (gravity). Values > 2.5 indicate impact.
 */
export function calculateAccelerationMagnitude(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
}

/**
 * FallDetector — State machine for detecting falls.
 *
 * States:
 *   IDLE → IMPACT_DETECTED → MONITORING_STILLNESS → FALL_CONFIRMED
 *
 * A fall is: high impact (>1.8g) followed by extended stillness (~1g ±0.5 for 2s)
 * "Stillness" means the phone is roughly at rest (only gravity, no movement).
 * At rest, magnitude ≈ 1.0g. We check |magnitude - 1.0| < threshold.
 */
export class FallDetector {
    constructor() {
        this.reset();
        this.logCounter = 0;
    }

    reset() {
        this.impactDetected = false;
        this.impactTime = 0;
        this.lastMovementTime = 0;
        this.state = 'IDLE';
    }

    /**
     * Process a new acceleration magnitude reading.
     * @param {number} magnitude - sqrt(x²+y²+z²)
     * @param {number} timestamp - Date.now()
     * @returns {{ phase: string, fallDetected: boolean, stillnessProgress?: number }}
     */
    processAcceleration(magnitude, timestamp) {
        // Log every ~50 readings (~1 second at 20ms interval)
        this.logCounter++;
        if (this.logCounter % 50 === 0) {
            const deviation = Math.abs(magnitude - 1.0);
            console.log(
                `[Fall] state=${this.state} mag=${magnitude.toFixed(3)} dev=${deviation.toFixed(3)} ` +
                `thresh_impact=${SENSOR_THRESHOLDS.FALL_IMPACT_THRESHOLD} thresh_still=${SENSOR_THRESHOLDS.FALL_STILLNESS_THRESHOLD}`
            );
        }

        // Phase 1: Detect high-G impact
        if (
            this.state === 'IDLE' &&
            magnitude > SENSOR_THRESHOLDS.FALL_IMPACT_THRESHOLD
        ) {
            this.impactDetected = true;
            this.impactTime = timestamp;
            this.lastMovementTime = timestamp;
            this.state = 'IMPACT_DETECTED';
            console.log(`[Fall] IMPACT DETECTED — magnitude: ${magnitude.toFixed(3)}g`);
            return { phase: 'impact', fallDetected: false };
        }

        // Phase 2: After impact, monitor for stillness
        // "Still" = deviation from gravity is small (phone at rest on ground)
        if (this.state === 'IMPACT_DETECTED' || this.state === 'MONITORING_STILLNESS') {
            const deviationFromGravity = Math.abs(magnitude - 1.0);
            const isStill = deviationFromGravity < SENSOR_THRESHOLDS.FALL_STILLNESS_THRESHOLD;

            if (isStill) {
                this.state = 'MONITORING_STILLNESS';
                const stillnessTime = timestamp - this.lastMovementTime;

                if (this.logCounter % 10 === 0) {
                    console.log(
                        `[Fall] MONITORING — stillness: ${stillnessTime}ms / ${SENSOR_THRESHOLDS.FALL_STILLNESS_DURATION}ms ` +
                        `(dev=${deviationFromGravity.toFixed(3)})`
                    );
                }

                if (stillnessTime >= SENSOR_THRESHOLDS.FALL_STILLNESS_DURATION) {
                    this.state = 'FALL_CONFIRMED';
                    console.log('[Fall] FALL CONFIRMED — triggering alert');
                    return { phase: 'fall', fallDetected: true };
                }

                return {
                    phase: 'monitoring',
                    fallDetected: false,
                    stillnessProgress: stillnessTime / SENSOR_THRESHOLDS.FALL_STILLNESS_DURATION,
                };
            } else {
                // Movement detected — update last movement time
                this.lastMovementTime = timestamp;
                const timeSinceImpact = timestamp - this.impactTime;

                if (this.logCounter % 10 === 0) {
                    console.log(
                        `[Fall] MOVEMENT after impact — dev=${deviationFromGravity.toFixed(3)} ` +
                        `timeSinceImpact=${timeSinceImpact}ms`
                    );
                }

                // If more than 10 seconds since impact with movement, reset
                if (timeSinceImpact > 10000) {
                    console.log('[Fall] Timeout — resetting to IDLE');
                    this.reset();
                    return { phase: 'idle', fallDetected: false };
                }
            }
        }

        return { phase: 'idle', fallDetected: false };
    }
}
