
function generateShortTitle(transcription) {
  if (!transcription || typeof transcription !== 'string' || transcription.length < 10) {
    return "Untitled"; // Default fallback
  }

  // Split into sentences
  const sentences = transcription.match(/[^.!?]+[.!?]/g) || [transcription];

  // Select the first meaningful sentence
  let selectedSentence = sentences[0].trim();

  // Remove unnecessary words (stopwords)
  const stopwords = new Set([
    "the", "is", "a", "an", "and", "or", "but", "if", "then", "when", "at", "on", "in", "to",
    "it", "this", "that", "of", "for", "with", "as", "by", "from", "against"
  ]);

  // Extract meaningful words
  const words = selectedSentence.split(" ").filter(word => !stopwords.has(word.toLowerCase()));

  // Create a short title using the first 4 words
  const shortTitle = words.slice(0, 4).join(" ");

  return shortTitle.charAt(0).toUpperCase() + shortTitle.slice(1); // Capitalize first letter
}


export default generateShortTitle
