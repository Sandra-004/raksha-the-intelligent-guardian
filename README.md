<p align="center">
  <img src="./img.png" alt="Raksha Project Banner" width="100%">
</p>

# RAKSHA – The Intelligent Guardian 🎯

## Basic Details

### Team Name: Yatna

### Team Members
- Member 1: Sandra Suresh Panicker - NSS College of Engineering, Palakkad
- Member 2: Kavya S Nair - NSS College of Engineering, Palakkad

### Hosted Project Link
[mention your project hosted link here]

### Project Description
Raksha is a sensor-driven mobile safety application designed to protect women in real-time using just a smartphone. It combines psychological deterrence, instant emergency alerting, and automated location sharing through gesture-based triggers.

Raksha resides on the device the user already protects: her phone.
Raksha transforms a regular phone into an intelligent guardian!

### The Problem Statement
Women frequently share live locations out of fear, not convenience. Existing safety solutions often require unlocking the phone, depend on manual button presses, use unreliable SMS systems, or provide no deterrence/evidence.

In high-stress situations, fine motor skills degrade, making small panic buttons ineffective. There is a need for a fast, discreet, intelligent safety mechanism that works instinctively.

**Prevention is better than Cure; Evidence is better than Hearsay.**

### The Solution
Raksha uses built-in smartphone sensors (Accelerometer + GPS + Audio system) to:
- Detect a panic shake gesture
- Trigger an authoritative deterrent audio
- Automatically generate and send a WhatsApp SOS with live location

Instead of reacting after violence begins, Raksha creates perceived surveillance and immediate response.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- **Languages used:** JavaScript
- **Frameworks used:** React Native (Expo)
- **Libraries used:**
  - `expo-sensors`: For accelerometer-based shake detection.
  - `expo-location`: For retrieving precise GPS coordinates.
  - `expo-av`: For playing the deterrent audio.
  - `expo-haptics`: For tactile feedback during emergency triggers.
  - `expo-file-system`: For managing local recordings.
- **Tools used:** VS Code, Git & GitHub, Expo Go, Android Device for Testing

**For Hardware:**
- None. Raksha is a software-first safety solution that leverages built-in smartphone sensors.

---

## Features

### 1. Guard Mode (Shake-to-Trigger)
A dedicated mode that listens for rapid shake gestures. A double shake instantly activates the emergency protocol, even if the phone is locked (depending on OS restrictions) or the app is in the foreground.

### 2. Fall & Scream Detection
Advanced sensor monitoring to detect sudden falls or loud screams, automatically triggering the SOS sequence if the user is incapacitated.

### 3. "Indian Dad" Deterrence Protocol
Plays a loud, authoritative pre-recorded voice message simulating a live conversation with a guardian ("Where are you? I'm tracking your location!"), creating immediate psychological pressure on potential aggressors.

### 4. WhatsApp SOS with Live Location
Automatically constructs and opens a WhatsApp message with a pre-filled SOS text and a Google Maps link to the user's current location, ready to be sent to emergency contacts.

### 5. Dark Cockpit Panic UI
A high-contrast, minimalist dark interface designed for low-light environments and high-stress usage. Large touch zones and clear visual cues reduce cognitive load during emergencies.

### 6. Emergency Contact Management
Easily add and manage trusted contacts who will receive the SOS alerts.

### 7. Fake Call Simulation
Simulates an incoming call to provide users with a non-confrontational excuse to leave an uncomfortable situation.

---

## Implementation

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/raksha-the-intelligent-guardian.git
cd raksha-the-intelligent-guardian

# Install dependencies
npm install

# Start the application
npx expo start
```

### Running the App
1. Install **Expo Go** on your Android/iOS device.
2. Scan the QR code displayed in the terminal.
3. Grant necessary permissions (Location, Audio, etc.) for full functionality.

---

## Project Documentation

### Screenshots

<!-- 
USER: Please add your screenshots here. 
Format: ![Description](image_url) 
-->

> [!NOTE]
> *Add Screenshot 1: Guard Mode Home Screen*
> ![Guard Mode UI](path/to/screenshot1.png)

> [!NOTE]
> *Add Screenshot 2: SOS Alert & Countdown*
> ![SOS Alert](path/to/screenshot2.png)

> [!NOTE]
> *Add Screenshot 3: Emergency Contacts & History*
> ![Contacts & History](path/to/screenshot3.png)


### Diagrams

**System Architecture:**
User Gesture → Accelerometer Listener → Trigger Engine → Audio Playback → Location Fetch → WhatsApp Deep Link

**Application Workflow:**
User Activates Guard Mode → Shake/Fall/Scream Detected → Deterrence Audio Plays → GPS Captured → SOS Message Drafted → Help Notified.

---

## AI & Development Transparency

At Team Yatna, we believe in the power of human creativity augmented by modern tools.

**Originality & Design:**
- The core concept, "Dark Cockpit" UI design, psychological deterrence strategy ("Indian Dad Protocol"), and safety logic workflows were entirely conceived and designed by our team members.
- The decision to focus on *prevention* rather than just *reporting* is the unique value proposition we brought to the table.

**AI as a Coding Assistant:**
- We utilized AI tools (like ChatGPT/Gemini) primarily as an intelligent coding assistant to accelerate development.
- **Role of AI:** Generating boilerplate code, debugging complex React Native errors, optimizing sensor data processing algorithms, and helping with syntax for specific libraries.
- **Human Control:** Every line of code was reviewed, tested, and integrated by us. The architectural decisions, feature prioritization, and final quality assurance were strictly human-led.

We view AI not as a creator, but as a powerful tool that allowed us to focus more on the *solution* and *user experience* rather than getting bogged down in syntax errors.

---

## Team Contributions

**Sandra Suresh Panicker:**
- Core Sensor Logic (Accelerometer, Gyroscope)
- Fall & Scream Detection Algorithms
- WhatsApp Deep Link Integration
- Project Architecture & Repo Management

**Kavya S Nair:**
- UI/UX Design & Implementation (Dark Mode, Animations)
- Guard Mode State Management
- Audio System Integration (Deterrence Playback)
- User Research & Testing

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Team Yatna
