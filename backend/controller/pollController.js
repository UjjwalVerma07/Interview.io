const { calculateResults } = require('../utils/resultCalculator');

let currentPoll = null;
let answers = {};
let participants = [];
let studentCount = 0;
const pollHistory = [];
const nameToSocketMap = {}; // NEW

function handleSocketEvents(io, socket) {
  // Student joins
  socket.on('join_student', (name) => {
    if (name && !participants.includes(name)) {
      participants.push(name);
      nameToSocketMap[name] = socket.id; 
      io.emit('participants_list', participants);
    }

    if (currentPoll) {
      socket.emit('new_poll', currentPoll);
    }
  });

  socket.on('kick_participant', (name) => {
  const targetSocketId = nameToSocketMap[name];
  if (targetSocketId) {
    io.to(targetSocketId).emit('kicked');  // Notify student
    delete nameToSocketMap[name];
    participants = participants.filter(p => p !== name); // Remove
    io.emit('participants_list', participants); // Update list for all
  }
});

  // Student submits answer
  socket.on('submit_answer', ({ name, answer }) => {
    answers[name] = answer;

    // Send live updated results
    io.emit('live_results', calculateResults(currentPoll, answers, currentPoll.correctOption));

    checkIfAllAnswered(io);
  });

  // Teacher creates a new poll
  socket.on('create_poll', (pollData) => {
    currentPoll = {
      question: pollData.question,
      options: pollData.options,
      correctOption: pollData.correctOption,
      timer: pollData.timer || 60,
    };

    answers = {};

    io.emit('new_poll', currentPoll);

    // Auto end after timer
    setTimeout(() => {
  const result = calculateResults(currentPoll, answers, currentPoll.correctOption);
  const totalVotes = Object.keys(answers).length;

  pollHistory.push({
    question: currentPoll.question,
    options: currentPoll.options,
    correctOption: currentPoll.correctOption,
    results: result,
    totalVotes,
    timestamp: Date.now(),
  });

  io.emit('poll_complete');
  io.emit('live_results', result);
}, currentPoll.timer * 1000);

  });

  // Chat message from any user
  socket.on('chat_message', (msg) => {
    io.emit('chat_message', msg);
  });

   socket.on('get_poll_history', () => {
    socket.emit('poll_history_data', pollHistory);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    // Optionally clean up participants here if needed
    const name = Object.keys(nameToSocketMap).find(key => nameToSocketMap[key] === socket.id);
  if (name) {
    delete nameToSocketMap[name];
    participants = participants.filter(p => p !== name);
    io.emit('participants_list', participants);
  }

  
  });
}

// End early if all have answered
function checkIfAllAnswered(io) {
if (Object.keys(answers).length >= participants.length) {
  const result = calculateResults(currentPoll, answers, currentPoll.correctOption);
  const totalVotes = Object.keys(answers).length;

  pollHistory.push({
    question: currentPoll.question,
    options: currentPoll.options,
    correctOption: currentPoll.correctOption,
    results: result,
    totalVotes,
    timestamp: Date.now(),
  });

  io.emit('poll_complete');
  io.emit('live_results', result);
}

}

module.exports = { handleSocketEvents };
