class CareerAssessment {
  constructor() {
    this.questions = [];
    this.currentIndex = 0;
    this.answers = {};
    this.results = {};
  }

  async loadQuestions() {
    try {
      const response = await fetch('../data/questions.json');
      if (!response.ok) throw new Error('Could not load questions');
      this.questions = await response.json();
    } catch (e) {
      console.error(e);
      this.questions = [];
    }
  }

  displayQuestion(index) {
    if (!this.questions || index >= this.questions.length) return;
    const questionContainer = document.getElementById('question-container');
    const question = this.questions[index];
    // Build options buttons
    const optionsHtml = question.options
      .map(
        (opt) => `
          <button class="option-btn bg-blue-600 text-white px-4 py-2 rounded m-2" data-score="${opt.score}" data-path="${opt.path}">
            ${opt.text}
          </button>
        `
      )
      .join('');
    questionContainer.innerHTML = `
      <h2 class="text-lg font-semibold mb-4">${question.text}</h2>
      <div class="options flex flex-col">${optionsHtml}</div>
    `;
    // Add click listeners
    document.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const score = parseInt(e.target.getAttribute('data-score'), 10);
        const path = e.target.getAttribute('data-path');
        this.saveAnswer(question.id, { path, score });
        this.nextQuestion();
      });
    });
  }

  saveAnswer(id, answer) {
    this.answers[id] = answer;
    if (window.dataManager) {
      window.dataManager.save('assessmentAnswers', this.answers);
    }
  }

  nextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.displayQuestion(this.currentIndex);
    } else {
      this.calculateScore();
      this.showResults();
    }
  }

  calculateScore() {
    this.results = {};
    Object.values(this.answers).forEach((ans) => {
      const { path, score } = ans;
      this.results[path] = (this.results[path] || 0) + score;
    });
    return this.results;
  }

  showResults() {
    const resultContainer = document.getElementById('results');
    if (!resultContainer) return;
    const maxScore = Math.max(...Object.values(this.results));
    resultContainer.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">Your Fit Scores</h2>
      ${Object.entries(this.results)
        .map(([path, score]) => {
          const percent = maxScore ? Math.round((score / maxScore) * 100) : 0;
          return `<p class="mb-2">${path}: ${percent}/100</p>`;
        })
        .join('')}
    `;
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    const assessment = new CareerAssessment();
    await assessment.loadQuestions();
    assessment.displayQuestion(0);
  });
}
