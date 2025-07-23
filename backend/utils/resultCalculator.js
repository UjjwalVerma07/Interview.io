function calculateResults(poll, answers) {
  const result = {};
  if (!poll) return result;

  // Initialize vote count for each option
  poll.options.forEach(opt => result[opt] = 0);

  // Count votes and correct answers
  let correctCount = 0;
  Object.values(answers).forEach(ans => {
    if (result.hasOwnProperty(ans)) {
      result[ans]++;
    }
if (ans === poll.options[poll.correctOption]){
      correctCount++;
    }
  });

  // Attach extra metadata
  result.correct = correctCount;
  result.total = Object.keys(answers).length;
  result.correctOption = poll.correctOption;

  return result;
}

module.exports = {
  calculateResults,
};
