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

> Simulated “Dad” call in progress. This feature creates a realistic live-call screen with timed audio playback to deter potential threats and create perceived supervision.
> * Screenshot 1: Calling Dad (Fake Call Active)*![calling dad](https://github.com/user-attachments/assets/7de20e26-714a-4c9f-b49b-0286bac5c15f)

> ![Calling Dad (Fake Call Active)]()

> Confirmation alert showing that emergency audio evidence has been successfully recorded and securely stored on the device.

> *Add Screenshot 2:Evidence Saved Popup*
> ![Evidence Saved Popup]![evidence](https://github.com/user-attachments/assets/58a2b615-e648-412b-9e81-3ac09098220b)

> Evidence history panel displaying saved recordings with playback, share, and delete options for secure evidence management.
> *Add Screenshot 3: Recordings History Screen*
> ![Recordings History Screen](path/to/screenshot3.png)

> Scenario selection interface allowing users to choose between “Stalking” or “Cab Safety” modes for context-based deterrent calls.
> *Add Screenshot 4: Fake Call Scenario Selection*
> ![Fake Call Scenario Selection]![fake call options](https://github.com/user-attachments/assets/d27cda80-bf19-4508-a71b-a878ff2e0563)



> Blackout Mode activated — the screen appears nearly off with only a dim clock visible, concealing active safety monitoring from potential attackers.
> *Add Screenshot 5: Blackout Mode (Stealth Screen)*
> ![Blackout Mode (Stealth Screen)]![filter screen](https://github.com/user-attachments/assets/7fb97105-6253-41f0-8b54-2d53c9e13f8e)


> Minimalist dashboard showing core safety controls: Record, Guard Mode, Fake Call, Status, and the One-Swipe SOS slider.
> *Add Screenshot 6: Home Screen (Main Dashboard)*
> ![Home Screen (Main Dashboard)]()
![home](https://github.com/user-attachments/assets/3d02c685-4742-4e92-87ec-071f1985f353)


> Real-time confirmation that stealth audio recording has started immediately after emergency activation.
> *Add Screenshot 7:Recording!
 Started Alert*
> ![Recording Started Alert][recording started](https://github.com/user-attachments/assets/7e7c979f-d1d8-4871-8e35-d254bff24c11)


> Automated WhatsApp emergency message containing live GPS coordinates and confirmation that audio evidence recording is in progress.
> *Add Screenshot 8: WhatsApp Emergency Alert*
> ![WhatsApp Emergency Alert]
![watsapp alert](https://github.com/user-attachments/assets/845f324e-5726-43da-8ffd-3bb29cea18e5)

**working video drive link:** https://drive.google.com/file/d/1hw9K_o964dtnUCXr6Nh-vkWLvTjiRPgU/view?usp=sharing

### Diagrams

**System Architecture:**<img width="1024" height="1536" alt="architecture" src="https://github.com/user-attachments/assets/aff95aff-9fe5-42d7-b6bb-747f6ba474ad" />

User Gesture → Accelerometer Listener → Trigger Engine → Audio Playback → Location Fetch → WhatsApp Deep Link

**Application Workflow:**<img width="1536" height="1024" alt="workflow" src="https://github.com/user-attachments/assets/74fc80ee-8a1c-4e3a-8b77-f35de7fdac4a" />

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

##RELEASE-MOBILE APP
**Android APK Release:**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Team Yatna
