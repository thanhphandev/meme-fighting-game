# Hướng dẫn thêm nhân vật mới vào game

Để thêm một nhân vật mới vào game, bạn cần thực hiện 3 bước chính:
1. Chuẩn bị hình ảnh (Sprite sheet)
2. Khai báo thông số nhân vật trong `constants.js`
3. Thêm câu thoại (Dialogues) cho nhân vật trong `CharacterDialogues.js`

Dưới đây là hướng dẫn chi tiết từng bước:

## Bước 1: Chuẩn bị hình ảnh (Sprite sheet)

1. Tạo thư mục mới cho nhân vật của bạn tại đường dẫn: `public/assets/characters/<id_nhan_vat>/` (ví dụ: `public/assets/characters/sieu_nhan/`).
2. Đặt file hình ảnh sprite sheet vào thư mục đó với tên `spritesheet.png`.
   - **Lưu ý**: Cấu trúc sprite sheet cần tuân theo chuẩn lưới. Bạn có thể tham khảo file `PROMPTS_CHARACTERS.md` để biết cách tạo hoặc chuẩn bị sprite sheet đúng chuẩn (ví dụ: lưới 6 cột x 8 hàng).

## Bước 2: Khai báo thông số nhân vật

Mở file `src/engine/data/constants.js`, tìm mảng `export const CHARACTERS = [...]` và thêm một object mới cho nhân vật của bạn vào cuối mảng.

**Mẫu khai báo:**

```javascript
{
    id: 'sieu_nhan', // ID của nhân vật (phải trùng với tên thư mục ở Bước 1)
    name: 'Siêu Nhân', // Tên hiển thị trong game
    asset: 'characters/sieu_nhan/spritesheet.png', // Đường dẫn tới file hình
    description: 'Người bảo vệ công lý.', // Mô tả nhân vật
    stats: { speed: 10, jump: 20, damage: 25 }, // Chỉ số cơ bản
    // Chỉ định hàng chứa animation trong sprite sheet (bắt đầu từ 0)
    rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, win: 8, roll: 1 },
    // Chỉ định số khung hình (frames) cho mỗi animation
    frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, win: 4, roll: 6 },
    // Cấu hình kỹ năng đặc biệt
    skill: {
        name: 'TIA CHỚP',
        type: 'projectile', // Loại kỹ năng: 'projectile' (bắn), 'dash' (lướt), 'aoe' (diện rộng), 'buff' (tăng sức mạnh)
        data: {
            speedX: 20, speedY: 0, damage: 30, width: 40, height: 40,
            color: '#ff0', shape: 'circle', life: 60, knockback: 20, effect: 'fireball'
        }
    }
}
```

## Bước 3: Thêm câu thoại (Dialogues)

Mở file `src/engine/data/CharacterDialogues.js`, tìm object `export const CHARACTER_DIALOGUES = {...}` và thêm bộ câu thoại cho nhân vật của bạn với key là `id_nhan_vat`.

**Mẫu khai báo câu thoại:**

```javascript
sieu_nhan: {
    intro: [
        "Công lý sẽ chiến thắng!",
        "Biến hình!",
        "Ta đến đây!",
    ],
    attack: [
        "Đấm phát chết luôn!",
        "Nhận lấy này!",
        "Chaa!",
    ],
    skill: [
        "TIA CHỚP SIÊU THANH! ⚡",
        "Sức mạnh vô cực!",
        "Đỡ này!",
    ],
    hit: [
        "Á!",
        "Cũng đau đấy...",
        "Ngươi khá lắm!",
    ],
    block: [
        "Không xi nhê!",
        "Khiên năng lượng!",
        "Đỡ!",
    ],
    win: [
        "Công lý đã được thực thi! 🏆",
        "Quá dễ dàng!",
        "Bảo vệ thế giới thành công!",
    ],
    lose: [
        "Chưa kết thúc đâu...",
        "Hết năng lượng...",
        "Rút lui...",
    ],
    taunt: [
        "Đầu hàng đi!",
        "Yếu thế?",
        "Chỉ có vậy thôi sao?",
    ],
},
```

---
**Hoàn tất!** Sau khi làm xong 3 bước trên và lưu file lại, nhân vật mới của bạn sẽ tự động xuất hiện ở màn hình chọn nhân vật trong game.