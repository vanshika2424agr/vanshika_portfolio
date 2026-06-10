import { useState, useEffect } from 'react';

/**
 * useTypewriter
 * @param {string[]} words - array of strings to cycle through
 * @param {number} typeSpeed - ms per character when typing (default 80)
 * @param {number} deleteSpeed - ms per character when deleting (default 45)
 * @param {number} holdTime - ms to hold the full word before deleting (default 2000)
 * @returns {string} - the current text to display
 */
export function useTypewriter(words, typeSpeed = 80, deleteSpeed = 45, holdTime = 2200) {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);   // which word we're on
  const [charIndex, setCharIndex] = useState(0);   // character position
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex % words.length];

    let timeout;

    if (!isDeleting) {
      // --- TYPING PHASE ---
      if (charIndex < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, charIndex + 1));
          setCharIndex(c => c + 1);
        }, typeSpeed);
      } else {
        // Word fully typed — hold, then start deleting
        timeout = setTimeout(() => setIsDeleting(true), holdTime);
      }
    } else {
      // --- DELETING PHASE ---
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, charIndex - 1));
          setCharIndex(c => c - 1);
        }, deleteSpeed);
      } else {
        // Word fully deleted — move to next word
        setIsDeleting(false);
        setWordIndex(i => (i + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, holdTime]);

  return displayText;
}
