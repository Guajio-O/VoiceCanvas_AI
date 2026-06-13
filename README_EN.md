# 🎨 VoiceCanvas AI - Voice-Controlled Drawing Tool

A pure voice-controlled intelligent drawing tool that allows you to create art through voice commands.

[中文](README.md) | English

## ✨ Features

### 🗣️ Voice Control
- **Pure voice operation**: No mouse or keyboard needed, complete drawing through voice commands
- **Chinese support**: Native Chinese speech recognition for natural command understanding
- **Intelligent error correction**: High accuracy command understanding with multiple expression support

### 🎯 Dual Drawing Modes
- **Local Mode**: Uses HTML5 Canvas for basic shapes, fast response
- **AI Mode**: Calls AI drawing APIs to generate high-quality images

### 🎨 Local Drawing Supported Shapes
| Category | Shapes |
|----------|--------|
| Basic | Circle, Rectangle, Triangle, Ellipse, Line, Star, Heart, Cross, Pentagon |
| Animals | Cat, Dog, Bird, Fish, Butterfly, Rabbit, Panda, Bee, Flower |
| Vehicles | Car, Airplane, Boat, Train |
| Nature | Sun, Moon, House, Tree, Rainbow, Cloud, Mountain, River, Lake |
| Others | Diamond, Arrow, Wave, Snowman, Balloon, Gift |

### 🤖 AI Drawing Support
- Supports **Hugging Face** API
- Supports **OpenAI DALL·E** API  
- Supports **Stable Diffusion** local/remote API
- Supports **any compatible drawing API**
- Fully open API configuration, users can fill in their own

### 🔧 Command Capabilities
- **Canvas Control**: Clear, Undo
- **Color Switch**: 12 colors (Red, Orange, Yellow, Green, Cyan, Blue, Purple, Black, White, Brown, Pink, Gray)
- **Line Adjustment**: Thickness adjustment (thicker, thinner)
- **Fill Style**: Solid, Hollow
- **Size Adjustment**: Big, Small, Bigger, Smaller
- **Emoji Variants**: Smile sun, Cry moon
- **Position Relationships**: Left/right/top/bottom/inside directions (e.g., "cat on the left of car", "fish in water")
- **Combined Commands**: Extract multiple keywords from long sentences

## 🚀 Quick Start

### Method 1: Open Directly (Local Mode)
1. Double-click `voicecanvas-ai.html` to open the app
2. Select "Local Drawing Mode"
3. Click "Start Listening" and begin voice drawing

### Method 2: Local Server (AI Mode, Recommended)
1. Ensure [Node.js](https://nodejs.org/) is installed
2. Enter the project directory
3. Run the server:
   ```bash
   node server.js
   ```
4. Visit in browser: `http://localhost:8000`
5. Configure AI API (API URL, API Key)
6. Select "AI Drawing Mode" and start creating

## 📖 Voice Command Examples

### Local Mode
| Command | Effect |
|---------|--------|
| "Draw a circle" | Draws a circle |
| "Draw rectangle" | Draws a rectangle |
| "Use red" | Switch to red color |
| "Thicker" | Increase line thickness |
| "Clear" | Clear canvas |
| "Undo" | Undo last step |
| "Draw a smiley sun" | Draw sun with smiley face |

### AI Mode
| Command | Effect |
|---------|--------|
| "Draw a cute cat" | AI generates cat image |
| "Draw beautiful landscape" | AI generates landscape |
| "Draw sci-fi city" | AI generates sci-fi city scene |

### Position Relationship Commands
| Command | Effect |
|---------|--------|
| "Cat on the left of car" | Car in center, cat on left |
| "Dog on the right of car" | Car in center, dog on right |
| "Fish in water" | Fish drawn inside water/ellipse |
| "Cat left of car, dog right of car" | Multiple position relationships |

### Combined Commands
| Command | Extracted Keywords |
|---------|-------------------|
| "Draw a yellow sun with smiley" | Yellow + smiley sun |
| "Draw a solid big circle" | Solid + big + circle |
| "Draw blue small stars" | Blue + small + stars |

## ⚙️ Configuration

### API Configuration
Configure these options in the settings panel:

| Configuration | Description | Example |
|---------------|-------------|---------|
| API URL | Base URL of drawing API | `https://api-inference.huggingface.co` |
| API Key | Access key for API (not saved in code) | `hf_xxxxx` |
| Model Name | AI model identifier | `stabilityai/stable-diffusion-xl-base-1.0` |

**Note**: API URL, Key, and Model Name all need to be filled to use AI drawing.

### Local Mode Configuration
No configuration needed, ready to use

## 🛠️ Tech Stack

- **Frontend**: HTML5 + CSS3 + JavaScript (No framework dependencies)
- **Speech Recognition**: Web Speech API
- **Speech Synthesis**: Web Speech Synthesis API
- **Drawing**: HTML5 Canvas
- **Server**: Node.js (Only for AI mode CORS proxy)

## 📁 Project Structure

```
voice-paint/
├── voicecanvas-ai.html # Main application file
├── server.js           # Node.js proxy server
├── README.md           # Chinese documentation
└── README_EN.md        # English documentation
```

## ⚠️ Notes

1. **Microphone permission required** for speech recognition, please allow microphone access in browser
2. **Network connection required** for AI mode, and valid API Key needed
3. **Chrome or Edge browser recommended** for better speech recognition support
4. **Local mode works offline**, no server required

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

## 📄 License

MIT License