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
*   **Visual**: Show tấm ảnh Sprite Sheet của `Luffy Gear 5` hoặc `Zoro`. Zoom vào từng hàng (Row) hành động: Chạy, Nhảy, Đánh.
*   **Nội dung**: "Làm sao để nhân vật cử động? Mình chia ảnh thành các ô nhỏ. Dòng 1 là đứng yên, dòng 2 là chạy. Code chỉ cần đổi dòng là xong."
*   **Code**: Show dòng `frameCounts` trong `constants.js` và giải thích `image.src`.

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
*   **Visual**: Player đứng im cho AI (Pepe) đánh túi bụi. Sau đó AI tự nhảy tránh đòn.
*   **Kiến thức**: Simple AI Logic / Randomness.
*   **Nội dung**: "Làm sao máy biết đánh lại? AI của mình check khoảng cách. Gần thì đấm, xa thì chạy lại, bị đánh thì Random 50% tỉ lệ đỡ đòn."
*   **Code**: Trích xuất từ `src/game/AI.js`:
    ```javascript
    // AI.js: makeDecision
    const dist = Math.abs(opponent.x - this.fighter.x);
    
    if (dist > 150) {
        // Xa quá thì chạy lại gần
        if (dx > 0) this.input.right = true;
    } else {
        // Gần thì đấm hoặc dùng skill ngẫu nhiên
        if (Math.random() < this.aggression) this.input.attack = true;
        else if (Math.random() < this.skillChance) this.input.skill = true;
    }
    ```

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
