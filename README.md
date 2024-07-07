# Welcome to MediaSFU

<p align="center">
  <img src="https://www.mediasfu.com/logo192.png" width="100" alt="MediaSFU Logo">
</p>

<p align="center">
  <a href="https://twitter.com/media_sfu">
    <img src="https://img.icons8.com/color/48/000000/twitter--v1.png" alt="Twitter" style="margin-right: 10px;">
  </a>
  <a href="https://www.mediasfu.com/forums">
    <img src="https://img.icons8.com/color/48/000000/communication--v1.png" alt="Community Forum" style="margin-right: 10px;">
  </a>
  <a href="https://github.com/MediaSFU">
    <img src="https://img.icons8.com/fluent/48/000000/github.png" alt="Github" style="margin-right: 10px;">
  </a>
  <a href="https://www.mediasfu.com/">
    <img src="https://img.icons8.com/color/48/000000/domain--v1.png" alt="Website" style="margin-right: 10px;">
  </a>
  <a href="https://www.youtube.com/channel/UCELghZRPKMgjih5qrmXLtqw">
    <img src="https://img.icons8.com/color/48/000000/youtube--v1.png" alt="Youtube" style="margin-right: 10px;">
  </a>
</p>


MediaSFU offers a cutting-edge streaming experience that empowers users to customize their recordings and engage their audience with high-quality streams. Whether you're a content creator, educator, or business professional, MediaSFU provides the tools you need to elevate your streaming game.

---

## 🚀 About MediaSFU

[MediaSFU](https://www.mediasfu.com) is a comprehensive streaming platform designed to revolutionize your streaming experience. With advanced features like unlimited pausing and resuming and lightning-fast 300ms latency, MediaSFU ensures a seamless and immersive viewing experience for both creators and viewers.

## 📱 MediaSFU Project (React Native)

If you're here for the MediaSFU React Native project, you're in the right place. Follow the instructions below to get started with the project (For detailed documentation, refer to the [React SDK documentation](https://github.com/MediaSFU/MediaSFU-ReactJS)):

### 🛠️ Getting Started

1. **Adding the Project as a Dependency:**
    In your React Native project, add MediaSFU as a dependency by adding the following line to your `package.json` file:
    ```bash
    "dependencies": {
        "mediasfu": "github:MediaSFU/MediaSFU"
    }
    ```

2. **Installing the Dependency:**

    Install the MediaSFU dependency by running the following command:

    ```bash
    npm install
    ```

3. **Import the relevant components:**

    Follow the [React SDK documentation](https://github.com/MediaSFU/MediaSFU-ReactJS) to import the necessary components and set up your project.

    For example, to import the `MediasfuGeneric` and `PreJoinPage` components, use the following code:
    
    ```javascript
    import {MediasfuGeneric} from 'mediasfu';
    import { PreJoinPage } from 'mediasfu';

    const credentials = {apiUserName: "your_api_username", apiKey: "your_api_key"};

    export default function App() {
    return (
    <MediasfuGeneric PrejoinPage={PreJoinPage} credentials={credentials} />
        
    );
    }
    export default App;
    ```

4. **Running the Project:**
    
      Run your project using the following command:
  
      ```javascript
      npm start
      ```

## ❓ Need Help?

If you require assistance or have questions specific to the MediaSFU React Native project, you can refer to our [Developer Documentation](https://www.mediasfu.com/developers) or visit our [Community Forums](https://www.mediasfu.com/forums).

For detailed documentation, refer to the [ReactJS SDK documentation](https://github.com/MediaSFU/MediaSFU-ReactJS).

## 📄 License

This project is licensed under the [MIT License](LICENSE).

The MediaSFU project has configurations for web, iOS, and Android. We've addressed compatibility issues, including different React Native WebRTC support for web and mobile platforms.

---

## 🌟 What Sets Us Apart

### 🌐 Highly Scalable Rooms

MediaSFU boasts unparalleled scalability, supporting meetings with up to 3000 participants, each with video and audio enabled. Whether you're hosting a large-scale conference or a virtual event, MediaSFU ensures a smooth and seamless experience for all attendees.

### 📽️ Advanced Recording Capabilities

Experience advanced recording capabilities with MediaSFU's support for recomposing single recorded media for both landscape and portrait views. With MediaSFU, you can easily customize your recordings to suit different viewing preferences and platforms, ensuring maximum flexibility and accessibility. The pause and resume functionality allows you to have complete control over your recordings, enabling you to seamlessly pause and resume recording sessions as needed.

### 🎥 WebRTC Recorder

MediaSFU's WebRTC recorder offers unmatched flexibility and convenience. Easily send your media from anywhere, and MediaSFU will handle the recording process for you. Additionally, the recorder provides options to capture and return real-time image and audio buffers, allowing for seamless integration into your applications and workflows.

### 🛠️ CPaaS Oriented Platform

As a CPaaS (Communication Platform as a Service) oriented platform, MediaSFU empowers users and organizations to create and manage their own streaming solutions. From hosting virtual events to providing interactive live streaming experiences, MediaSFU offers a wide range of tools and features to meet your communication needs.

---

## 🛠️ MediaSFU SDKs

At MediaSFU, we provide a range of SDKs tailored to different platforms, allowing developers to seamlessly integrate our streaming capabilities into their applications. Our SDKs are full-fledged applications written in various languages, making it easy to incorporate MediaSFU functionalities into your projects.

### 📱 [React Native SDK](https://github.com/MediaSFU/MediaSFU)
Our React Native SDK enables developers to integrate MediaSFU streaming features into their mobile applications with ease. Build immersive streaming experiences for iOS and Android platforms effortlessly.

### 🌟 [Flutter SDK](https://github.com/MediaSFU/MediaSFU_SDK_Flutter)
Developers can leverage our Flutter SDK to create high-performance streaming applications with rich user interfaces. Build stunning cross-platform streaming apps with ease using Flutter and MediaSFU.

### 🌐 [React JS SDK](https://github.com/MediaSFU/MediaSFU-ReactJS)
Integrate MediaSFU's powerful streaming capabilities into your web applications using our React JS SDK. Create engaging live streaming experiences for your web users seamlessly.

### 🔜 Vue and Angular SDKs (Coming Soon)

Scheduled for release in June 2024, our Vue and Angular SDKs will expand our support for web developers, offering seamless integration of MediaSFU streaming features into Vue.js and Angular applications.

---

## 🖼️ Embedding MediaSFU Prebuilt UI

Developers can easily embed our main Prebuilt UI (pure JS) into their applications, regardless of the platform they're developing for. Our Prebuilt UI is unbranded and can be seamlessly integrated into existing apps by following the guide on [Embedding MediaSFU Prebuilt UI](https://www.mediasfu.com/prebuilt).

### Getting Started

1. **Follow the Guide:**

    Visit [Embedding MediaSFU Prebuilt UI](https://www.mediasfu.com/prebuilt) and follow the comprehensive guide to embed our Prebuilt UI into your application.

2. **Customize as Needed:**

    Customize the appearance and functionality of the Prebuilt UI to align with your application's design and requirements.

3. **Enjoy Seamless Integration:**

    Seamlessly integrate MediaSFU streaming capabilities into your app and provide users with an immersive streaming experience.

### Benefits

- **Effortless Integration:** Easily embed MediaSFU Prebuilt UI into your existing applications.
- **Unbranded Experience:** Our Prebuilt UI is unbranded, ensuring a seamless and cohesive user experience within your app.
- **Cross-Platform Support:** Works across various platforms, allowing developers to extend MediaSFU functionalities to their applications effortlessly.

---


