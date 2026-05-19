import { calculateEnglishScore } from "./word-check";

export type CipherResult = {
  type: string;
  decoded: string;
  confidence: number;
};

export function identifyAndDecode(input: string): CipherResult[] {
  const results: CipherResult[] = [];
  const trimmed = input.trim();

  if (!trimmed) return [];

  // 1. Base64
  try {
    const decodedB64 = atob(trimmed);
    if (/^[\x20-\x7E\s]*$/.test(decodedB64) && /^[A-Za-z0-9+/]*={0,2}$/.test(trimmed)) {
      results.push({
        type: "Base64",
        decoded: decodedB64,
        confidence: calculateEnglishScore(decodedB64) + 20
      });
    }
  } catch {}

  // 2. Base32
  const base32Match = /^[A-Z2-7]+=*$/i.test(trimmed.replace(/\s+/g, ''));
  if (base32Match) {
    const decodedB32 = decodeBase32(trimmed);
    if (decodedB32 && /^[\x20-\x7E\s]*$/.test(decodedB32)) {
      results.push({
        type: "Base32",
        decoded: decodedB32,
        confidence: calculateEnglishScore(decodedB32) + 20
      });
    }
  }

  // 3. Hexadecimal
  const cleanHex = trimmed.replace(/\s+/g, '');
  if (/^[0-9A-Fa-f]+$/.test(cleanHex) && cleanHex.length % 2 === 0) {
    try {
      let decodedHex = "";
      for (let i = 0; i < cleanHex.length; i += 2) {
        decodedHex += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
      }
      if (/^[\x20-\x7E\s]*$/.test(decodedHex)) {
        results.push({
          type: "Hexadecimal",
          decoded: decodedHex,
          confidence: calculateEnglishScore(decodedHex) + 20
        });
      }
    } catch {}
  }

  // 4. Binary
  const cleanBinary = trimmed.replace(/\s+/g, '');
  if (/^[01]+$/.test(cleanBinary) && cleanBinary.length % 8 === 0) {
    try {
      let decodedBin = "";
      for (let i = 0; i < cleanBinary.length; i += 8) {
        decodedBin += String.fromCharCode(parseInt(cleanBinary.substr(i, 8), 2));
      }
      if (/^[\x20-\x7E\s]*$/.test(decodedBin)) {
        results.push({
          type: "Binary",
          decoded: decodedBin,
          confidence: calculateEnglishScore(decodedBin) + 20
        });
      }
    } catch {}
  }

  // 5. Morse Code
  const morseAlphabet: Record<string, string> = {
    ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F", "--.": "G", "....": "H", "..": "I", ".---": "J",
    "-.-": "K", ".-..": "L", "--": "M", "-.": "N", "---": "O", ".--.": "P", "--.-": "Q", ".-.": "R", "...": "S", "-": "T",
    "..-": "U", "...-": "V", ".--": "W", "-..-": "X", "-.--": "Y", "--..": "Z", "-----": "0", ".----": "1", "..---": "2",
    "...--": "3", "....-": "4", ".....": "5", "-....": "6", "--...": "7", "---..": "8", "----.": "9", "/": " "
  };
  if (/^[.\-\s/]+$/.test(trimmed)) {
    const decodedMorse = trimmed.split(" ").map(code => morseAlphabet[code] || "?").join("");
    if (decodedMorse.replace(/\?/g, "").length > 0) {
      results.push({
        type: "Morse Code",
        decoded: decodedMorse,
        confidence: calculateEnglishScore(decodedMorse) + 30
      });
    }
  }

  // 6. Bacon's Cipher
  const baconDecoded = decodeBacon(trimmed);
  if (baconDecoded) {
    results.push({
      type: "Bacon's Cipher",
      decoded: baconDecoded,
      confidence: calculateEnglishScore(baconDecoded) + 30
    });
  }

  // 7. Caesar Cipher Cracker
  const caesarResults: CipherResult[] = [];
  for (let shift = 1; shift < 26; shift++) {
    const decoded = caesarShift(trimmed, 26 - shift);
    const score = calculateEnglishScore(decoded);
    if (score > 10) {
      caesarResults.push({
        type: `Caesar (Shift ${shift})`,
        decoded: decoded,
        confidence: score
      });
    }
  }
  results.push(...caesarResults.sort((a, b) => b.confidence - a.confidence).slice(0, 3));

  // 8. Atbash Cipher
  const decodedAtbash = atbash(trimmed);
  const atbashScore = calculateEnglishScore(decodedAtbash);
  if (atbashScore > 10) {
    results.push({
      type: "Atbash",
      decoded: decodedAtbash,
      confidence: atbashScore
    });
  }

  // 9. Affine Cipher Cracker
  const affineResults: CipherResult[] = [];
  const coprimes = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
  for (const a of coprimes) {
    for (let b = 0; b < 26; b++) {
      const decoded = decodeAffine(trimmed, a, b);
      const score = calculateEnglishScore(decoded);
      if (score > 10) {
        affineResults.push({
          type: `Affine (a=${a}, b=${b})`,
          decoded: decoded,
          confidence: score
        });
      }
    }
  }
  results.push(...affineResults.sort((a, b) => b.confidence - a.confidence).slice(0, 1));

  // 10. Vigenere Cipher (Common Keys)
  const commonKeys = ["ABC", "KEY", "CIPHER", "SECRET", "PASSWORD", "VIGENERE", "CRYPTO"];
  const vigenereResults: CipherResult[] = [];
  for (const key of commonKeys) {
    const decoded = decodeVigenere(trimmed, key);
    const score = calculateEnglishScore(decoded);
    if (score > 10) {
      vigenereResults.push({
        type: `Vigenere (Key: ${key})`,
        decoded: decoded,
        confidence: score
      });
    }
  }
  results.push(...vigenereResults.sort((a, b) => b.confidence - a.confidence).slice(0, 1));

  return results.sort((a, b) => b.confidence - a.confidence);
}

function caesarShift(str: string, shift: number): string {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26) + start);
  });
}

function atbash(str: string): string {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const isUpper = char <= 'Z';
    const start = isUpper ? 65 : 97;
    const end = isUpper ? 90 : 122;
    return String.fromCharCode(end - (char.charCodeAt(0) - start));
  });
}

function decodeBase32(str: string): string | null {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = str.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const char of clean) {
    const val = alphabet.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  
  let decoded = "";
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    decoded += String.fromCharCode(parseInt(bits.substr(i, 8), 2));
  }
  return decoded || null;
}

function decodeBacon(str: string): string | null {
  const clean = str.toUpperCase().replace(/[^AB01]/g, "").replace(/[0]/g, "A").replace(/[1]/g, "B");
  if (clean.length < 5 || clean.length % 5 !== 0) return null;

  const alphabetStandard = "ABCDEFGHIKLMNOPQRSTUWXYZ"; // Standard: I=J, U=V
  const alphabetComplete = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let decoded = "";
  for (let i = 0; i < clean.length; i += 5) {
    const chunk = clean.substr(i, 5);
    const val = parseInt(chunk.replace(/A/g, "0").replace(/B/g, "1"), 2);
    if (val < 26) {
      decoded += alphabetComplete[val];
    }
  }
  return decoded || null;
}

function decodeAffine(str: string, a: number, b: number): string {
  // Modular inverse of a modulo 26
  let aInv = 0;
  for (let i = 0; i < 26; i++) {
    if ((a * i) % 26 === 1) {
      aInv = i;
      break;
    }
  }

  return str.replace(/[a-zA-Z]/g, (char) => {
    const isUpper = char <= 'Z';
    const start = isUpper ? 65 : 97;
    const x = char.charCodeAt(0) - start;
    let decodedIdx = (aInv * (x - b)) % 26;
    if (decodedIdx < 0) decodedIdx += 26;
    return String.fromCharCode(decodedIdx + start);
  });
}

function decodeVigenere(str: string, key: string): string {
  let keyIdx = 0;
  const k = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (k.length === 0) return str;

  return str.replace(/[a-zA-Z]/g, (char) => {
    const isUpper = char <= 'Z';
    const start = isUpper ? 65 : 97;
    const x = char.charCodeAt(0) - start;
    const shift = k.charCodeAt(keyIdx % k.length) - 65;
    let decodedIdx = (x - shift) % 26;
    if (decodedIdx < 0) decodedIdx += 26;
    keyIdx++;
    return String.fromCharCode(decodedIdx + start);
  });
}
