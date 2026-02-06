# Kế hoạch Nội dung TikTok/Reels: Hướng dẫn Lập trình Game Meme

Dưới đây là ý tưởng cho chuỗi video ngắn (30-60s) để xây dựng kênh TikTok chia sẻ về quá trình làm game đối kháng Meme của bạn. Nội dung tập trung vào sự hài hước, kiến thức lập trình dễ hiểu và ứng dụng AI.

## Tone & Mood
- **Hài hước, Gen Z, Nhanh gọn**.
- Sử dụng nhạc trend, sound effect meme (Bonk, Bruh, What the hell).
- Show code ít nhưng chất (highlight dòng quan trọng).

---

## Phần 1: Hành trình làm game (Fun & Basic)

### Video 1: Giới thiệu dự án - "Khi tôi chán và tự làm game đấm nhau"
*   **Visual**: Mở đầu bằng cảnh "Buff Doge" đấm "Pepe" bay màu với hiệu ứng rung màn hình.
*   **Code**: Show nhanh cấu trúc thư mục project `e:/meme/src/game` để thấy độ "khủng" (hoặc đơn giản) của dự án.
*   **Nội dung**: "Hôm nay rảnh rỗi tự code con game đối kháng bằng Javascript. Có đủ các idol: Doge, Cheems, Mèo Méo Meo..."
*   **Kết**: "Anh em muốn thêm nhân vật nào comment nhé!"

### Video 2: Quy trình tạo nhân vật bằng AI (Ví dụ: Cute Cat / White Bread)
*   **Visual**: Quay màn hình dùng Midjourney/DALL-E gõ prompt "Pixel art cute cat fighter". Chọn một hình ưng ý.
*   **Nội dung**: "Vẽ tay thì khó, nên mình nhờ AI vẽ dùm. Prompt là 'pixel art, game sprite'. Tách nền ra là xong."
*   **Key Tech**: Nhắc đến công cụ AI (Midjourney/Stable Diffusion) + Photoshop/GIMP để tách nền.

### Video 3: Từ ảnh tĩnh thành động (Sprite Animation)

**Visual:**
1.  **Intro (0:00-0:05):** Quay màn hình game đang chơi character `Luffy Gear 5` (hoặc Zoro). Nhân vật đang đứng thở (Idle), sau đó chạy (Run) và đánh thường (Attack).
2.  **Sprite Sheet Reveal (0:05-0:15):** Hiển thị tấm ảnh gốc `spritesheet.png` của Luffy.
    *   *Effect:* Zoom vào hàng đầu tiên (Row 0). Text overlay: "Row 0: Đứng yên (Idle)".
    *   *Effect:* Kéo xuống hàng thứ hai (Row 1). Text overlay: "Row 1: Chạy (Run)".
    *   *Effect:* Kéo xuống hàng tấn công (Row 4). Text overlay: "Row 4: Đánh (Attack)".
    *   *AI Prompt (nếu cần):* "A magnifying glass scanning across a pixel art sprite sheet, highlighting different rows."
3.  **Concept Animation (0:15-0:25):** Minh hoạ cơ chế "Cắt ô".
    *   Một khung hình chữ nhật (Frame) di chạy trên tấm ảnh lớn. Mỗi lần khung di chuyển sang phải, nhân vật cử động tiếp theo.
    *   Khi đổi hành động (ví dụ từ đứng sang chạy), khung hình nhảy xuống dòng dưới.
4.  **Code Walkthrough (0:25-0:45):** Quay màn hình VS Code.
    *   **Shot 1:** File `src/game/constants.js`. Highlight đoạn config của `luffy_nikka` (dòng 210+).
        *   Focus vào object `rows` và `frameCounts`.
    *   **Shot 2:** File `src/game/Fighter.js`.
        *   Highlight dòng `this.image.src = ...` (dòng 22).
        *   Highlight hàm `setState` (dòng 74) chỗ `this.frameY = this.charData.rows[stateName]`.
    *   **Shot 3 (Optional):** Hàm `draw()` (dòng 449) chỗ `ctx.drawImage`. Chỉ vào `srcX`, `srcY`.

**Audio / Kịch bản (Thoại):**

*   **(0:00)** "Nhìn Luffy múa may quay cuồng thế này, nhưng thực ra nó là... ảo ảnh đấy!"
*   **(0:05)** "Bản chất nhân vật chỉ là một tấm ảnh tĩnh khổng lồ gọi là Sprite Sheet. Nhìn kỹ nhé!"
*   **(0:10)** "Mình chia tấm ảnh này thành các ô lưới (Grid). Dòng đầu tiên là hình đứng yên. Dòng thứ hai là hình đang chạy. Mỗi hành động là một dòng riêng biệt."
*   **(0:20)** "Để nhân vật cử động, code chỉ cần 'chiếu' từng ô một liên tục, giống như lật sách vậy."
*   **(0:25)** "Vào code xem thử nha. Trong file `constants.js`, mình khai báo sẵn: Đứng là dòng 0, có 4 hình. Chạy là dòng 1, có 6 hình."
*   **(0:35)** "Khi các bạn bấm nút chạy, code trong `Fighter.js` sẽ đổi `frameY` xuống dòng 1. Hàm vẽ `drawImage` sẽ tự động cắt đúng phần hình đó để hiển thị."
*   **(0:45)** "Đơn giản vậy thôi mà nhìn mượt phết!"

**Tài nguyên cần thiết:**
*   Source code: `src/game/constants.js`, `src/game/Fighter.js`.
*   Asset: Ảnh `characters/luffy_nikka/spritesheet.png` (Cần mở ảnh này lên bằng Image Viewer để quay).
*   Gameplay footage: Quay cảnh Luffy thực hiện các hành động tương ứng với Row đã giới thiệu.

### Video 4: Lập trình di chuyển cơ bản (Physic & Gravity)
*   **Visual**: Nhân vật nhảy lên và rơi xuống. Show đoạn code `gravity` trong `CONFIG`.
*   **Nội dung**: "Tại sao nhảy lên lại rơi xuống? Vì có trọng lực (Gravity). Nếu set gravity = 0 thì nó bay luôn lên trời (demo bug hài)."
*   **Code**: `this.position.y += this.velocity.y` trong `Fighter.js`.

### Video 5: Hệ thống hội thoại Gen Z (Dialogue System)
*   **Visual**: Cảnh 2 nhân vật gặp nhau, hiện text hội thoại. Ví dụ Pepe nói "Feels bad man..." hoặc Samurai nói "Honor and Cheems!".
*   **Nội dung**: "Game đánh nhau thì phải có gáy bẩn (Trashtalk). Mình viết riêng bộ thoại cho từng đứa."
*   **Code**: Mở file `CharacterDialogues.js`, zoom vào mấy câu hài hước như "Mlem mlem", "Ao chình".

---

## Phần 2: Chuyên sâu Lập trình (Coding Knowledge)

### Video 6: Hitbox & Collision (Tại sao đánh không trúng?)
*   **Visual**: Bật debug mode vẽ khung đỏ (AttackBox) và khung xanh (Hitbox) quanh nhân vật. Hiệu ứng slow-motion khi 2 khung chạm nhau.
*   **Kiến thức**: Giải thích **AABB Collision** (Axis-Aligned Bounding Box).
*   **Nội dung**: "Làm sao máy biết mình đấm trúng nó? Dùng thuật toán va chạm hình chữ nhật. Nếu cạnh phải của mình > cạnh trái của nó => TRÚNG!"
*   **Code**: Trích xuất từ `src/game/Fighter.js`:
    ```javascript
    // Fighter.js: checkAttackCollision
    if (this.attackBox.x < opponent.hitbox.x + opponent.hitbox.width &&
        this.attackBox.x + this.attackBox.width > opponent.hitbox.x &&
        this.attackBox.y < opponent.hitbox.y + opponent.hitbox.height &&
        this.attackBox.y + this.attackBox.height > opponent.hitbox.y) {
        // Hit logic
    }
    ```

### Video 7: Finite State Machine (Quản lý trạng thái nhân vật)
*   **Visual**: Vẽ sơ đồ trạng thái đơn giản: Đứng yên -> Chạy -> Nhảy -> Đánh. Character chuyển màu theo từng trạng thái.
*   **Kiến thức**: **State Machine** (Máy trạng thái).
*   **Nội dung**: "Code nhân vật không phải là `if else` loạn xạ. Mình dùng State Machine. Đang 'Nhảy' thì không được 'Chạy', nhưng được 'Đánh trên không'."
*   **Code**: Trích xuất từ `src/game/Fighter.js`:
    ```javascript
    // Fighter.js: updateAnimation
    switch (this.state) {
        case 'idle': fps = 8; break;
        case 'run': fps = 10 + Math.abs(this.velocityX); break; // Chạy nhanh thì anime nhanh
        case 'attack': fps = 20; break; // Skill đánh phải dứt khoát
        case 'ko': fps = 5; stopAtEnd = true; break;
    }
    ```

### Video 8: Game Loop (Trái tim của Game)
*   **Visual**: Show FPS counter chạy 60fps. Thử chỉnh FPS xuống 1 để game giật tung chảo (hài hước).
*   **Kiến thức**: **Game Loop** & `requestAnimationFrame`.
*   **Nội dung**: "Game thực ra là vòng lặp vô tận. Vẽ -> Xóa -> Tính toán -> Vẽ lại. Chạy 60 lần 1 giây để mượt mà."
*   **Code**: Trích xuất từ `src/components/BattleScreen.jsx`:
    ```javascript
    // BattleScreen.jsx: gameLoop
    const gameLoop = (timeStamp) => {
        // ...
        ctx.clearRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight); // Xóa màn hình
        
        // Update Logic
        p1.update(deltaTime, p2, ...);
        p2.update(deltaTime, p1, ...);
        
        // Draw Logic
        p1.draw();
        p2.draw();
        
        // Loop again
        animationId = requestAnimationFrame(gameLoop);
    }
    ```

### Video 9: Projectile Logic (Code kỹ năng bắn chưởng)
*   **Visual**: Skill `Shuriken` của Ninja hoặc `Egg Bomb` của Gà. Quay chậm đường đạn bay.
*   **Kiến thức**: Object Management & Velocity.
*   **Nội dung**: "Chiêu bắn xa thực ra là tạo một Object mới, gán vận tốc X (bay ngang) và trọng lực Y (nếu cầu vồng). Ra khỏi màn hình thì xóa đi cho nhẹ máy."
*   **Code**: Trích xuất từ `src/game/Projectile.js`:
    ```javascript
    // Projectile.js: update
    this.x += this.vx; // Cộng vận tốc vào vị trí X
    this.y += this.vy; // Cộng vận tốc vào vị trí Y
    this.vy += this.gravity; // Rơi xuống nếu có trọng lực

    // Nảy lên nếu chạm đất
    if (this.y > groundLevel && this.config.onGround === 'bounce') {
        this.vy *= -0.6; // Giảm lực nảy
    }
    ```

### Video 10: AI đơn giản (Code cho máy tự đánh)

**Visual:**
1.  **Intro (0:00-0:10):** Cảnh Player (ví dụ: `Chicken`) đứng im. AI (ví dụ: `Ninja` hoặc `Samurai`) từ xa chạy lại, nhảy lên chém, rồi lùi ra.
2.  **Logic Visualization (0:10-0:20):**
    *   Vẽ một đường thẳng nối giữa 2 nhân vật. Hiển thị text dynamic: `Distance: 400` (giảm dần khi chạy lại).
    *   Khi `Distance > 150`: Hiện text **"CHASE (Đuổi theo)"**.
    *   Khi `Distance < 150`: Hiện text **"ATTACK MODE"** + icon Nắm đấm.
3.  **Code Walkthrough (0:20-0:35):** Quay file `src/game/AI.js`.
    *   Highlight dòng tính khoảng cách: `const dist = Math.abs(dx);`.
    *   Highlight logic di chuyển: `if (dist > 150) ...`.
    *   Highlight logic tấn công: `Math.random() < this.aggression`.
4.  **Funny Moment (0:35-0:45):** Chỉnh độ khó lên `Hard`. AI đỡ đòn liên tục hoặc Roll né skill như hack. Zoom vào mặt meme nhân vật kiểu "What???".

**Audio / Kịch bản (Thoại):**

*   **(0:00)** "Nhiều bạn hỏi làm sao máy biết đánh lại? Trí tuệ nhân tạo có thông minh không?"
*   **(0:05)** "Thực ra con AI này đơn giản hơn bạn nghĩ, nó chỉ biết làm toán lớp 1 thôi."
*   **(0:10)** "Đầu tiên, nó tính khoảng cách (Distance) đến mình. Nếu xa quá 150 pixel, nó sẽ tự giữ nút đi tới."
*   **(0:15)** "Khi đã áp sát, nó bắt đầu... lắc xí ngầu. Tỷ lệ 30% là đấm, 5% là tung skill. Hoàn toàn hên xui!"
*   **(0:25)** "Nhưng ở chế độ Khó, mình code thêm cho nó khả năng 'hack map'. Cứ thấy mình bấm nút đánh là nó tự động đỡ (Block) hoặc lộn nhào (Roll) bỏ chạy."
*   **(0:35)** "Code có mấy dòng thôi mà đánh khó chịu phết đấy!"

**Tài nguyên cần thiết:**
*   Source code: `src/game/AI.js`.
*   Gameplay: Cảnh đấu với AI mode Easy (đứng im cho đánh) và Hard (đánh trả gắt).
*   Overlay Effect: Cần edit video thêm text "Distance" và mũi tên chỉ hướng.


### Video 11: Particle System (Hiệu ứng cháy nổ)
*   **Visual**: Skill `SOLAR KAMEHAMEHA` nổ đùng đùng, các hạt pixel (particle) bay tứ tung.
*   **Kiến thức**: Particle System & Performance.
*   **Nội dung**: "Chiêu thức đẹp là nhờ Particle. Mỗi vụ nổ là sinh ra 50-100 hạt nhỏ, bay random rồi mờ dần. Đẹp nhưng tốn RAM lắm nha."
*   **Code**: Trích xuất từ `src/game/Particle.js`:
    ```javascript
    // Particle.js
    constructor(x, y, type) {
        // Bắn tung tóe theo hướng ngẫu nhiên
        const angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.type === 'dust') this.opacity -= 0.05; // Mờ dần
    }
    ```

### Video 12: Camera & Parallax (Hiệu ứng chiều sâu)
*   **Visual**: Nhân vật di chuyển, background phía sau trôi chậm hơn background phía trước (hoặc sàn đấu).
*   **Kiến thức**: **Parallax Scrolling**.
*   **Nội dung**: "Muốn game 2D nhìn xịn xò 3D? Dùng Parallax. Lớp ảnh xa trôi chậm, lớp ảnh gần trôi nhanh. Tạo cảm giác chiều sâu."
*   **Code**: Minh họa logic Parallax:
    ```javascript
    // Background layer
    ctx.drawImage(bgLayer1, x * 0.2, y); // Trôi chậm
    ctx.drawImage(bgLayer2, x * 0.5, y); // Trôi vừa
    ctx.drawImage(foreground, x * 1.0, y); // Trôi nhanh
    ```

---

## Phần 3: Ứng dụng AI Tools (Làm game nhàn tênh)

### Video 13: Lên ý tưởng & Chỉ số với Gemini/ChatGPT
*   **Visual**: Quay màn hình chat với Gemini: "Hãy nghĩ cho tôi 1 nhân vật meme hệ 'Bò Sát', có skill xoay vòng. Tự cân bằng chỉ số Speed/Damage so với 10 nhân vật cũ."
*   **Công cụ**: **Gemini / ChatGPT**.
*   **Nội dung**: "Bí ý tưởng? Hỏi AI ngay. Nó không chỉ nghĩ tên (Cá Sấu Chúa) mà còn tính luôn chỉ số cân bằng để game không bị 'lỗi' quá."
*   **Tip**: Show prompt mẫu: `Act as a Game Designer, balance these stats...`

### Video 14: Tạo Sprite Sheet chuẩn với Leonardo.ai / Midjourney
*   **Visual**: Mở Leonardo.ai, gõ prompt dài loằng ngoằng. Ra kết quả 1 bảng sprite mèo cute.
*   **Công cụ**: **Leonardo.ai** (chế độ Pixel Art).
*   **Nội dung**: "Prompt thần thánh: `pixel art, game sprite sheet, cute cat fighter, idle animation, run animation, white background, 32 bit`. Nhớ chọn model chuyên Pixel để đỡ bị méo hình."
*   **Tip**: Dùng Photoshop/Ezgif để cắt ảnh.

### Video 15: Tạo nhạc nền chiến đấu với Suno AI
*   **Visual**: Gõ prompt vào Suno: "8-bit retro arcade fighting music, high tempo, intense". Nghe thử đoạn nhạc cháy phố.
*   **Công cụ**: **Suno / Udio**.
*   **Nội dung**: "Game hay phải có nhạc cuốn. Không cần thuê nhạc sĩ, AI lo hết. Chỉ 1 phút là có bản nhạc nền 8-bit cực 'chiến' cho màn đấu Boss."
*   **Tip**: Tải về và cho vào `SoundManager.playBgm()`.

### Video 16: Voice Over & Sound Effect (ElevenLabs)
*   **Visual**: Vào ElevenLabs gõ "Fatality!", "Perfect!", "Gà chiến thắng!". Chọn giọng trầm ấm kiểu phim hành động.
*   **Công cụ**: **ElevenLabs**.
*   **Nội dung**: "Cần giọng bình luận viên? Đừng tự thu âm nếu giọng bạn không hay. AI đọc diễn cảm như bình luận viên NBA luôn."

---

## Phần 4: Hoàn thiện & Cộng đồng

### Video 17: Xử lý Bug Meme (Bug hay Feature?)
*   **Visual**: Nhân vật bị kẹt trong tường, hoặc xoay vòng tròn không dừng (lỗi `hitStun` cũ).
*   **Nội dung**: "Lập trình đôi khi nó lạ lắm. Định làm chiêu lướt, nó lướt ra khỏi bản đồ luôn. Đây là Bug hay Feature?"
*   **Bài học**: Debugging skill.

### Video 18: Cân bằng Game (Balancing Stats)
*   **Visual**: Con `White Bread` (Bánh mì) đấm `Dino` gần chết.
*   **Nội dung**: "Không thể để cái bánh mì mạnh hơn khủng long được. Giảm damage bánh mì xuống, tăng máu khủng long lên. Game Design là phải cân bằng."
*   **Code**: Chỉnh sửa object `stats` trong `constants.js`.

### Video 19: Tổng kết & Release
*   **Visual**: Highlight các pha combat đẹp mắt nhất.
*   **Call to action**: "Link game ở bio nhé. Ai thắng trùm cuối comment!"

---
## Tech Stack & Tools giới thiệu trong video
1.  **Language**: Javascript (Vanilla hoặc Canvas API).
2.  **Editor**: VS Code (Zoom code to cho dễ nhìn).
3.  **AI Tools**:
    *   **Midjourney / DALL-E 3**: Tạo sprite, background.
    *   **ChatGPT / Claude**: Hỗ trợ viết logic khó, fix bug, viết lời thoại.
    *   **ElevenLabs**: Tạo giọng meme (ví dụ giọng dẫn truyện kiểu phim tài liệu hoặc giọng Anime).
