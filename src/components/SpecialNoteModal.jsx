import React from 'react';
import { X, Heart } from 'lucide-react';

export default function SpecialNoteModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="special-note-backdrop animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="note-title">
      <div className="special-note-container animate-pop-in" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="note-close-btn"
          onClick={onClose}
          aria-label="Close special note"
        >
          <X size={24} />
        </button>

        <h2 id="note-title" className="special-note-heading">A Special Note For You ♡</h2>

        <div className="vintage-note-paper">
          <div className="tape-strip" aria-hidden="true" />

          <div className="note-content-body">
            <p className="note-salutation">meri jaan happy bitrthday to my lovely kuchupucchu,</p>

            <p>
              Many many happy returns of the day💕 , I wish I were with yuh and celebrate the special day with yuh .
              pta hai jab sath honge to isse acche se celebrate krenge tumhare liye dher sare surprise honge ur usse bht special bna dunga waiting for you bby .
            </p>

            <p>
              wish ur upcoming life be as amazing as you are . 💖
            </p>

            <p>
              On ur special day I want to tell you that no matter whatever the situation is , I promise , I will always be with you ,
              in ur good times in ur bad times you will always find me standing by your side😊
            </p>

            <p className="note-love-more">
              I love you more and more and more.😘 ☺️ 💖
            </p>

            <p className="note-jaan">
              Happy birthday jaann 💕
            </p>

            <p className="note-final-line">
              I love you mentally , emotionally , physically , heartfully , unconditionally ❤️❤️😘
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
