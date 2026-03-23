import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Wand2, Save } from 'lucide-react';
import { CustomCharacterManager } from '../engine/data/CustomCharacterManager';
import { loadCustomCharacters } from '../engine/data/constants';

export default function CharacterCreator({ onClose, onCharacterAdded }) {
    const [name, setName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [assetUrl, setAssetUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Stats
    const [speed, setSpeed] = useState(10);
    const [jump, setJump] = useState(15);
    const [damage, setDamage] = useState(20);

    const [skillType, setSkillType] = useState('projectile');
    const [skillName, setSkillName] = useState('MY SKILL');

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        try {
            // Advanced Prompting based on PROMPTS_CHARACTERS.md
            const basePrompt = `Game sprite sheet of ${prompt}, Side-view fighting game. STRICT FORMAT: Uniform 6x8 animation grid (exactly 6 columns, 8 rows). NO LARGE PORTRAIT. Pure solid white background. High-fidelity 16-bit pixel art, distinct thick outlines. Actions: Idle, Run, Jump, Fall, Attack, Skill, Hit, KO. Perfect centering in each cell, identical scale.`;
            const negativePrompt = `large portrait, central figure, big character, standalone, fuzzy, blurry, anti-aliasing, messy, overlapping, text, header, title, distorted grid, uneven size`;
            
            const encodedPrompt = encodeURIComponent(basePrompt);
            const encodedNegative = encodeURIComponent(negativePrompt);
            
            const apiKey = import.meta.env.VITE_POLLINATION_KEY || import.meta.env.POLLINATION_KEY || '';
            const keyParam = apiKey ? `&key=${apiKey}` : '';
            // Using 1152x1536 perfectly divisible by 6x8. Using nanobanana-pro (Gemini 3 Pro 4K Thinking) for ultra-strict grid adherence
            const url = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1152&height=1536&model=nanobanana-pro&nologo=true&negative_prompt=${encodedNegative}${keyParam}`;

            // We use gen.pollinations.ai and pass the API key in the URL query to avoid CORS preflight header restrictions
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Failed to generate API returned ${response.status}`);
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setAssetUrl(objectUrl);
        } catch (error) {
            console.error(error);
            alert("Tạo asset thất bại. Vui lòng check lại kết nối của bạn.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setAssetUrl(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!name || !assetUrl) {
            alert('Please provide a name and generate/upload a spritesheet!');
            return;
        }

        const newChar = {
            id: 'custom_' + Date.now(),
            name: name,
            asset: assetUrl,
            description: 'A custom community character.',
            isCustom: true,
            stats: { speed: parseInt(speed), jump: parseInt(jump), damage: parseInt(damage) },
            // Default mappings assuming a standard 6x8 grid
            rows: { idle: 0, run: 1, jump: 2, fall: 3, attack: 4, skill: 5, hit: 6, ko: 7, roll: 1 },
            frameCounts: { idle: 4, run: 6, jump: 4, fall: 4, attack: 5, skill: 6, hit: 3, ko: 1, roll: 6 },
            skill: {
                name: skillName,
                type: skillType,
                data: getSkillData(skillType)
            }
        };

        await CustomCharacterManager.save(newChar);
        await loadCustomCharacters();
        onCharacterAdded();
        onClose();
    };

    const getSkillData = (type) => {
        switch (type) {
            case 'projectile': return { speedX: 15, speedY: 0, damage: 30, width: 40, height: 40, color: '#0ff', shape: 'circle', life: 60, effect: 'fireball' };
            case 'dash': return { speed: 35, damage: 30, range: 120, invuln: true, effect: 'slash' };
            case 'aoe': return { range: 250, damage: 15, stun: 60, duration: 40, visual: 'shockwave', effect: 'shockwave' };
            case 'buff': return { scale: 1.3, damageMult: 1.5, duration: 200, effect: 'buff_aura' };
            default: return {};
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-gray-900 border border-cyan-500/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl shadow-cyan-500/20 p-6 relative custom-scrollbar flex flex-col md:flex-row gap-6"
                    initial={{ y: 50, scale: 0.9 }}
                    animate={{ y: 0, scale: 1 }}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 p-2 rounded-full z-10">
                        <X className="w-5 h-5" />
                    </button>

                    {/* Left Column: Form */}
                    <div className="flex-1 space-y-5">
                        <h2 className="text-3xl text-game text-cyan-400 border-b border-cyan-500/30 pb-2">CREATE CHARACTER</h2>

                        <div>
                            <label className="text-xs text-cyan-300 font-bold mb-1 block">CHARACTER NAME</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-cyan-400 outline-none"
                                placeholder="E.g. Mecha Doge"
                                maxLength={20}
                            />
                        </div>

                        <div className="p-4 bg-black/40 rounded-lg border border-gray-800 space-y-3">
                            <label className="text-xs text-purple-300 font-bold block">AI SPRITE GENERATION (FREE)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm outline-none"
                                    placeholder="Enter prompt (e.g. A robotic ninja with blue glowing eyes)"
                                />
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt}
                                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-2 rounded flex items-center gap-2 font-bold text-sm transition-colors"
                                >
                                    {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    GENERATE
                                </button>
                            </div>

                            <div className="flex items-center gap-4 py-2">
                                <div className="h-px bg-gray-700 flex-1"></div>
                                <span className="text-xs text-gray-500">OR</span>
                                <div className="h-px bg-gray-700 flex-1"></div>
                            </div>

                            <div>
                                <label className="text-xs text-cyan-300 font-bold block mb-2">UPLOAD OWN SPRITESHEET (6x8 grid)</label>
                                <label className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 border border-dashed border-gray-600 rounded p-4 cursor-pointer transition-colors text-gray-300 hover:text-white">
                                    <Upload className="w-5 h-5" />
                                    <span className="text-sm font-bold">Select Image</span>
                                    <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 font-bold mb-1 block">SPEED ({speed})</label>
                                <input type="range" min="4" max="15" value={speed} onChange={(e) => setSpeed(e.target.value)} className="w-full accent-cyan-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 font-bold mb-1 block">JUMP ({jump})</label>
                                <input type="range" min="10" max="25" value={jump} onChange={(e) => setJump(e.target.value)} className="w-full accent-cyan-500" />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-gray-400 font-bold mb-1 block">DAMAGE ({damage})</label>
                                <input type="range" min="10" max="40" value={damage} onChange={(e) => setDamage(e.target.value)} className="w-full accent-red-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                            <div>
                                <label className="text-xs text-pink-400 font-bold mb-1 block">SKILL TYPE</label>
                                <select value={skillType} onChange={(e) => setSkillType(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-pink-300 outline-none">
                                    <option value="projectile">Projectile / Magic</option>
                                    <option value="dash">Dash / Slash</option>
                                    <option value="aoe">Area of Effect (AOE)</option>
                                    <option value="buff">Buff (Aura)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-pink-400 font-bold mb-1 block">SKILL NAME</label>
                                <input type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white outline-none" maxLength={15} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Preview */}
                    <div className="w-full md:w-[350px] bg-black/40 border border-gray-800 rounded-xl p-4 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-400 mb-3 text-center">SPRITESHEET PREVIEW</h3>
                        <div className="flex-1 bg-[url('/assets/grid_pattern.png')] bg-repeat bg-[length:20px_20px] rounded-lg border border-gray-700 flex flex-col justify-center items-center overflow-hidden min-h-[300px] relative">
                            {isGenerating ? (
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-purple-400 text-xs font-bold animate-pulse">Generating via AI...</p>
                                    <p className="text-gray-500 text-[10px] mt-1 text-center px-4">This usually takes 5-10 seconds.<br />Using high-performance models.</p>
                                </div>
                            ) : assetUrl ? (
                                <img src={assetUrl} alt="Preview" className="max-w-full max-h-[400px] object-contain" />
                            ) : (
                                <p className="text-gray-500 text-sm font-bold">No Asset Selected</p>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-cyan-500/30 flex justify-center items-center gap-2 mt-4 transition-transform active:scale-95"
                        >
                            <Save className="w-5 h-5" /> COMPLETE & SAVE
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
