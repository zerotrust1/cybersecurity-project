# Cipher Identifier

A real-time web application built with Next.js that detects and cracks common encodings and classical ciphers.

## Features

Detects and decodes the following formats:
- **Encodings:** Base64, Base32, Hexadecimal, Binary.
- **Symbolic:** Morse Code.
- **Classical Ciphers:** 
  - Caesar Cipher (Brute-force detection)
  - Atbash Cipher
  - Affine Cipher
  - Bacon's Cipher
  - Vigenère Cipher (Common keys)

## How it works

The tool uses a scoring system based on common English words to identify the most likely decoding result. It processes input in real-time and provides a confidence score for each identified type.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Deployment:** Vercel

## Getting Started

First, install the dependencies:

```bash
cd chiper-identifier
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Author

- **zerotrust1 (fahrel)**
