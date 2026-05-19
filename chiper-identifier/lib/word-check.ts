const COMMON_WORDS = new Set([
  "THE", "BE", "TO", "OF", "AND", "A", "IN", "THAT", "HAVE", "I",
  "IT", "FOR", "NOT", "ON", "WITH", "HE", "AS", "YOU", "DO", "AT",
  "THIS", "BUT", "HIS", "BY", "FROM", "THEY", "WE", "SAY", "HER", "SHE",
  "OR", "AN", "WILL", "MY", "ONE", "ALL", "WOULD", "THERE", "THEIR", "WHAT",
  "SO", "UP", "OUT", "IF", "ABOUT", "WHO", "GET", "WHICH", "GO", "ME",
  "WHEN", "MAKE", "CAN", "LIKE", "TIME", "NO", "JUST", "HIM", "KNOW", "TAKE",
  "PEOPLE", "INTO", "YEAR", "YOUR", "GOOD", "SOME", "COULD", "THEM", "SEE", "OTHER",
  "THAN", "THEN", "NOW", "LOOK", "ONLY", "COME", "ITS", "OVER", "THINK", "ALSO",
  "BACK", "AFTER", "USE", "TWO", "HOW", "OUR", "WORK", "FIRST", "WELL", "EVEN",
  "NEW", "WANT", "BECAUSE", "ANY", "THESE", "GIVE", "DAY", "MOST", "US",
  "HELLO", "WORLD", "IS", "ARE", "AM", "WAS", "WERE", "BEEN", "BEING", "HAD",
  "HAS", "DID", "DONE", "DOING", "SAID", "SAYS", "SAYING", "WENT", "GONE", "GOING",
  "CAME", "COMES", "COMING", "MADE", "MAKES", "MAKING"
]);

export function calculateEnglishScore(text: string): number {
  const words = text.toUpperCase().split(/[^A-Z]+/).filter(w => w.length > 0);
  if (words.length === 0) return 0;

  let matches = 0;
  for (const word of words) {
    if (COMMON_WORDS.has(word)) {
      matches++;
    }
  }

  return (matches / words.length) * 100;
}

export function isLikelyEnglish(text: string): boolean {
  return calculateEnglishScore(text) > 10;
}
