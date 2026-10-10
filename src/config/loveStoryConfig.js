// =========================================================================
// LOVE STORY CONFIGURATION
// Easily customize names, memories, and photos here!
// =========================================================================

export const loveStoryConfig = {
  // Personal Details
  partnerName: "Sara",
  nickname: "Baby",
  relationshipDuration: "Four years",
  birthdayDate: "", // Leave blank or add format like "October 11"

  // Photos (stored in /public/assets/)
  photos: {
    hero: "./assets/sara-bows.jpg", // Sara smiling with cute pink bows
    coupleHero: "./assets/us-sunset.jpg", // Warm golden hour photo of both of you
    portraitRings: "./assets/sara-portrait-rings.jpg", // Sara looking gorgeous in black
    traditional: "./assets/sara-traditional.jpg", // Sara festive in silver-black
    gangaGhat: "./assets/birthday-terrace.webp", // Scenic terrace / ghat backdrop
    coupleOriginal: "./assets/us.jpeg", // Original photo
  },

  // Songs
  playlist: [
    {
      id: "tera-hone-laga-hoon",
      title: "Tera Hone Laga Hoon",
      artist: "Ajab Prem Ki Ghazab Kahani · Atif Aslam",
      type: "synth-romantic", // Built-in melodic romantic audio engine
      audioSrc: "./assets/our-song.mp3", // Optional local MP3 file if added
    },
    {
      id: "until-i-found-you",
      title: "Until I Found You",
      artist: "Stephen Sanchez",
      type: "synth-lofi",
      audioSrc: "./assets/until-i-found-you.mp3",
    },
    {
      id: "boyfriend-banale",
      title: "Boyfriend Banale",
      artist: "Special Track for Sara",
      type: "synth-upbeat",
      audioSrc: "./assets/boyfriend-banale.mp3",
    },
  ],

  // Special Ganga Ghat Memory
  gangaGhatStory: {
    title: "Baby, close your eyes for a second… 🌙❤️",
    lines: [
      "And imagine we're there again.",
      "Sitting on those ghat steps, with the beautiful Ganga flowing quietly in front of us.",
      "Your head resting on my shoulder.",
      "The evening slowly turning into night.",
      "The sound of the waves, the stars above us, and you right beside me.",
      "No fancy plans. No expensive gifts. No need to go anywhere.",
      "Just you and me, sitting together, watching the stars.",
      "Baby, I don't know if you remember every little detail of that evening, but I know I'll always cherish the feeling of having you right there beside me.",
      "Because sometimes, the most beautiful moments aren't the ones where we do something extraordinary.",
      "They're the ones where we're doing absolutely nothing…",
      "But we're doing nothing together. ❤️",
      "And if I could go back to that ghat, to those steps, to that evening…",
      "I'd sit beside you all over again.",
      "And when you rested your head on my shoulder, I'd wish for just one thing:",
      "That time would slow down a little, so I could stay in that moment with you a little longer.",
      "I love you, Baby. More than these words could ever explain. 🌙❤️"
    ],
  },

  // The Final Surprise Letter
  finalLetter: {
    title: "To My Baby, Sara ❤️",
    paragraphs: [
      "Happy Birthday, My Baby! ❤️🎂",
      "Four years.",
      "Four years of knowing you, caring about you, making memories with you, and having someone who has become such a special part of my life.",
      "Baby, I wish I could put everything I feel for you into words, but sometimes words just don't feel enough.",
      "You have your own little place in my heart that nobody else could ever take. And no matter how many birthdays come and go, I hope I always get the chance to make you smile on your special day.",
      "I know we won't always have perfect days. There may be silly fights, misunderstandings, and moments when things aren't easy. But I hope we always remember why we chose each other and keep finding our way back to the love we share.",
      "Today, I want you to feel loved, appreciated, and special—not just because it's your birthday, but because you deserve to feel that way every day.",
      "Thank you for being you, Baby.",
      "Thank you for the memories, the smiles, and all those little moments that mean more to me than you probably realise.",
      "Happy Birthday to my favourite girl, my Baby, my Sara. ❤️",
      "Four years down, and so many beautiful memories still waiting for us.",
      "I love you. Always keep smiling for me. 🥹💗"
    ]
  }
};
