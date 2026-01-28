# Game Systems Documentation

## 🎮 Hệ thống Gameplay Production-Ready

### 1. Sound Manager (`src/game/SoundManager.js`)

Hệ thống quản lý âm thanh toàn diện:

```javascript
import { SoundManager } from '../game/SoundManager';

// Play SFX
SoundManager.playSfx('sfx_hit');

// Play BGM
SoundManager.playBgm('bgm_battle');

// Toggle mute
SoundManager.toggleMute();     // Mute tất cả
SoundManager.toggleBgmMute();  // Mute nhạc nền
SoundManager.toggleSfxMute();  // Mute hiệu ứng

// Volume control
SoundManager.setBgmVolume(0.5);  // 0-1
SoundManager.setSfxVolume(0.7);  // 0-1
```

**Sound files cần đặt trong `/public/assets/sounds/`:**
- `bgm_menu.mp3` - Nhạc menu
- `bgm_battle.mp3` - Nhạc chiến đấu
- `bgm_victory.mp3` - Nhạc chiến thắng
- `sfx_hit.wav` - Tiếng đánh
- `sfx_block.wav` - Tiếng chặn
- `sfx_skill.wav` - Tiếng skill
- `sfx_select.wav` - Tiếng chọn UI
- `sfx_confirm.wav` - Tiếng xác nhận

---

### 2. Character Dialogues (`src/game/CharacterDialogues.js`)

Hệ thống dialogue GenZ Tiếng Việt cho từng nhân vật:

```javascript
import { getDialogue, DIALOGUE_EVENTS } from '../game/CharacterDialogues';

// Get a random dialogue
const text = getDialogue('doge', DIALOGUE_EVENTS.ATTACK);
// Có thể trả về: "BONK!", "Wow!", "Much hurt!"
```

**Events có sẵn:**
- `intro` - Khi bắt đầu trận
- `attack` - Khi tấn công
- `skill` - Khi dùng skill
- `hit` - Khi bị đánh
- `block` - Khi chặn đòn
- `win` - Khi thắng
- `lose` - Khi thua
- `taunt` - Khi khiêu khích

**Mỗi nhân vật có dialogues riêng với style:**
- `doge` - Meme doge cổ điển ("Much hurt", "WOW!")
- `buff_doge` - Absolute unit ("Húp!", "Phang!")
- `pepe` - Feels good/bad man
- `nyan_cat` - Nyan nyan~
- `luffy` - One Piece references
- ... và nhiều hơn!

---

### 3. Game Event System (`src/game/GameEventSystem.js`)

Quản lý flow game chuyên nghiệp:

```javascript
import { GameEventSystem, GAME_STATES } from '../game/GameEventSystem';

const eventSystem = new GameEventSystem({
    onStateChange: (state) => console.log('State:', state),
    onAnnouncement: (ann) => console.log('Announcement:', ann.text)
});

// Start countdown
eventSystem.startCountdown();  // 3... 2... 1... FIGHT!

// Show dialogue bubble
eventSystem.showDialogue('doge', 'attack', x, y, true);

// Draw in game loop
eventSystem.update(deltaTime);
eventSystem.draw(ctx);
```

**Game States:**
- `LOADING` - Đang load
- `COUNTDOWN` - Đếm ngược
- `FIGHTING` - Đang chiến đấu
- `ROUND_END` - Kết thúc round
- `MATCH_END` - Kết thúc trận
- `PAUSED` - Tạm dừng

---

### 4. Sound Control Component (`src/components/SoundControl.jsx`)

UI component để bật/tắt âm thanh:

```jsx
import SoundControl from './components/SoundControl';

<SoundControl className="custom-class" />
```

Hiển thị 3 nút:
- 🔊 Master mute (tất cả âm thanh)
- 🎵 BGM mute (nhạc nền)
- SFX mute (hiệu ứng)

---

## 📁 Structure

```
src/
├── game/
│   ├── CharacterDialogues.js  # Vietnamese GenZ dialogues
│   ├── SoundManager.js        # Audio system
│   ├── GameEventSystem.js     # Game flow management
│   └── ...
├── components/
│   ├── BattleScreen.jsx       # Main battle (enhanced)
│   ├── Menu.jsx               # Menu (enhanced)
│   ├── PauseMenu.jsx          # Pause menu (enhanced)
│   ├── SelectionScreen.jsx    # Character select (enhanced)
│   └── SoundControl.jsx       # Sound toggle buttons
└── ...

public/
└── assets/
    └── sounds/                # Sound files here
```

---

## 🎨 UI Enhancements

### Vietnamese GenZ Victory/Defeat Messages

Khi kết thúc trận, random messages như:
- **Thắng:** "EZ CLAP! 👏" - "Quá dễ, như chơi game mobile vậy 😎"
- **Thua:** "SKILL ISSUE! 💀" - "Tập luyện thêm rồi quay lại nhé~"

### HUD Improvements
- Health bar với delayed damage (trắng → đỏ)
- Hiển thị % máu
- Skill cooldown indicator
- Stamina bar gradient

### Responsive Design
- Mobile-friendly buttons
- Scalable fonts
- Touch-friendly UI elements

---

## 🎯 Tips for Sound Files

Để âm thanh hoạt động, bạn cần tạo/tải các file âm thanh:

1. **BGM (Background Music):**
   - Dùng nhạc 8-bit/chiptune
   - Format: MP3
   - Duration: 1-3 phút, loop

2. **SFX (Sound Effects):**
   - Ngắn gọn (< 1 giây)
   - Format: WAV hoặc MP3
   - Clear và punchy

**Free resources:**
- [Freesound.org](https://freesound.org)
- [OpenGameArt.org](https://opengameart.org)
- [Pixabay](https://pixabay.com/sound-effects/)
