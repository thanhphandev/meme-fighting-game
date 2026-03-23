import React from 'react'
import { motion } from 'framer-motion'
import { BACKGROUNDS } from '../engine/data/constants'
import { SoundManager } from '../engine/systems/SoundManager'
import { Image as ImageIcon, Sparkles } from 'lucide-react'

export default function BackgroundSelection({ onSelect, title = "CHỌN SÀN ĐẤU" }) {
    const handleSelect = (bgId) => {
        SoundManager.playSfx('sfx_select')
        // Find the full background object
        const bg = BACKGROUNDS.find(b => b.id === bgId) || BACKGROUNDS[0]
        onSelect(bg)
    }

    return (
        <div className="relative flex flex-col items-center gap-6 w-full max-w-6xl px-4 min-h-screen py-8">
            <div className="bg-pattern" />
            <div className="bg-grid" />

            {/* Title */}
            <motion.div
                className="relative z-10 text-center"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h2 className="text-game text-3xl md:text-5xl text-white tracking-wider">
                    {title}
                </h2>
                <div className="mt-2 flex items-center justify-center gap-3">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500" />
                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500" />
                </div>
            </motion.div>

            {/* Backgrounds Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-h-[70vh] overflow-y-auto p-2 custom-scrollbar">
                
                {/* Random Background Option */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    onClick={() => {
                        handleSelect(BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)].id);
                    }}
                    className="group relative glass-card cursor-pointer overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-purple-500/50 hover:border-purple-400 bg-black/40 hover:bg-purple-900/20 transition-all min-h-[160px] md:min-h-[220px]"
                >
                    <Sparkles className="w-12 h-12 text-purple-500 group-hover:text-purple-400 mb-2 transition-transform group-hover:scale-110" />
                    <span className="text-game text-xs md:text-sm text-purple-400 group-hover:text-white transition-colors">CHỌN NGẪU NHIÊN</span>
                </motion.div>

                {BACKGROUNDS.map((bg, index) => {
                    return (
                        <motion.div
                            key={bg.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03, duration: 0.4 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            onClick={() => handleSelect(bg.id)}
                            className="group relative glass-card glass-card-hover cursor-pointer overflow-hidden aspect-video md:aspect-square flex flex-col justify-end"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 overflow-hidden">
                                <motion.div
                                    style={{
                                        backgroundImage: `url(/assets/${bg.asset})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    className="transform group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                                />
                                {/* Bottom gradient fade */}
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                            </div>

                            {/* Info */}
                            <div className="relative p-3 md:p-4 z-10 w-full text-center">
                                {/* Name */}
                                <h3 className="text-game text-sm md:text-base text-white group-hover:text-cyan-400 transition-colors drop-shadow-md truncate">
                                    {bg.name}
                                </h3>
                            </div>

                            {/* Selection Border Glow */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-cyan-500/50 transition-colors pointer-events-none" />
                        </motion.div>
                    )
                })}
            </div>
            
            <motion.p
                className="relative z-10 text-display text-xs md:text-sm text-white/40 text-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                💡 Bối cảnh sẽ ảnh hưởng đến không khí trận đấu!
            </motion.p>
        </div>
    )
}
