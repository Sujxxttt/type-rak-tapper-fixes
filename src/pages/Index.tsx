
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TypeRak – Professional Typing Test</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Inter', sans-serif;
        font-size: 112.5%;
        color: white;
        background: linear-gradient(45deg, #3f034a, #004a7a);
        min-height: 100vh;
        overflow-x: hidden;
      }

      body.midnight-black {
        background-color: #000000;
        background-image: none;
        color: white;
      }

      body.cotton-candy-glow {
        background: linear-gradient(45deg, #3e8cb9, #2f739d);
        color: #222;
      }

      .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding: 20px;
        position: relative;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        z-index: 10;
      }

      header h1 {
        background-image: linear-gradient(90deg, #c454f0 0%, #7d54f0 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        transition: background-image 0.5s ease;
      }

      body.midnight-black header h1 {
        background-image: linear-gradient(90deg, #c559f7 0%, #7f59f7 100%);
      }

      body.cotton-candy-glow header h1 {
        background-image: linear-gradient(90deg, #ff59e8 0%, #ff52a8 100%);
      }

      .header-right {
        display: flex;
        align-items: center;
      }

      #user-select-area {
        display: flex;
        align-items: center;
        margin-right: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 5px 15px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      #user-select-area select {
        background: none;
        border: none;
        color: #fff;
        padding: 5px;
        border-radius: 4px;
        font-size: 0.9rem;
        cursor: pointer;
        appearance: none;
        margin-right: 10px;
      }

      .icon-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s;
        padding: 5px;
      }

      .icon-btn:hover {
        color: #aaa;
      }

      .content-section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease, visibility 0.5s ease;
        padding: 20px 0;
      }

      .content-section.hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        display: none;
      }

      .primary-btn {
        background: rgba(65, 42, 92, 0.8);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;
        font-size: 1rem;
        text-decoration: none;
        display: inline-block;
        text-align: center;
        margin: 5px;
      }

      .primary-btn:hover {
        background: rgba(50, 32, 70, 0.9);
        transform: translateY(-2px);
      }

      body.midnight-black .primary-btn {
        background: rgba(80, 50, 120, 0.8);
      }

      body.midnight-black .primary-btn:hover {
        background: rgba(65, 40, 100, 0.9);
      }

      body.cotton-candy-glow .primary-btn {
        background: rgba(233, 30, 98, 0.7);
        color: white;
      }

      body.cotton-candy-glow .primary-btn:hover {
        background: rgba(200, 25, 80, 0.9);
      }

      .glass-panel {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 30px;
        max-width: 400px;
        margin: 20px auto;
      }

      .glass-panel input {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        background-color: rgba(255, 255, 255, 0.5);
        color: #333;
      }

      #text-display-area {
        position: relative;
        width: 90%;
        max-width: 1200px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 1.5rem;
        padding: 1rem;
        min-height: 80px;
      }

      body.cotton-candy-glow #text-display-area {
        background: rgba(255, 255, 255, 0.2);
      }

      #text-display {
        position: relative;
        white-space: nowrap;
        font-size: 1.35em;
        line-height: 1.6;
        letter-spacing: 0.05em;
      }

      #text-flow .char {
        display: inline-block;
        color: #f5e9f1;
        transition: color 0.15s ease-in-out;
      }

      #text-flow .char.correct {
        color: #21b1ff;
      }

      #text-flow .char.incorrect {
        color: #ff1c14;
        background-color: rgba(255, 28, 20, 0.1);
      }

      body.midnight-black #text-flow .char {
        color: #f0f0f0;
      }

      body.midnight-black #text-flow .char.correct {
        color: #ae1ee3;
      }

      body.cotton-candy-glow #text-flow .char {
        color: #555;
      }

      body.cotton-candy-glow #text-flow .char.correct {
        color: #ff1fbc;
      }

      #caret {
        position: absolute;
        height: 1.4em;
        width: 2px;
        background: #21b1ff;
        animation: blinkCaret 0.8s infinite step-end;
      }

      @keyframes blinkCaret {
        50% { opacity: 0; }
      }

      body.midnight-black #caret {
        background: #ae1ee3;
      }

      body.cotton-candy-glow #caret {
        background: #ff1fbc;
      }

      .stats-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        width: 90%;
        max-width: 900px;
        margin: 1rem auto;
      }

      .stat-box {
        background: rgba(0, 0, 0, 0.3);
        padding: 0.8rem 1.2rem;
        border-radius: 6px;
        text-align: center;
        color: white;
        flex-grow: 1;
        flex-basis: 150px;
        min-width: 120px;
      }

      body.cotton-candy-glow .stat-box {
        background: rgba(255, 255, 255, 0.3);
        color: #333;
      }

      .stat-label {
        display: block;
        font-size: 0.9rem;
        opacity: 0.8;
        margin-bottom: 0.25rem;
      }

      #side-menu {
        position: fixed;
        top: 0;
        right: -310px;
        width: 300px;
        height: 100%;
        background: rgba(30, 35, 45, 0.7);
        backdrop-filter: blur(20px);
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        transition: right 0.4s ease;
        padding: 1.5rem;
        z-index: 1000;
        color: #e0e0e0;
        overflow-y: auto;
      }

      #side-menu.active {
        right: 0;
      }

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s ease;
      }

      .overlay.active {
        opacity: 1;
        pointer-events: auto;
      }

      .menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        padding-bottom: 1rem;
      }

      .menu-section {
        margin: 1.5rem 0;
      }

      .menu-section label {
        display: block;
        margin-bottom: 0.6rem;
        font-size: 0.95em;
        color: #d0d0d0;
      }

      .menu-section select {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0.08);
        color: #ffffff;
        cursor: pointer;
        appearance: none;
      }

      .danger-btn {
        background-color: #c0392b;
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
        font-size: 1rem;
        width: 100%;
      }

      .danger-btn:hover {
        background-color: #e74c3c;
      }

      footer {
        margin-top: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
        padding: 1.5rem 0;
        z-index: 5;
      }

      footer a {
        color: white;
        text-decoration: none;
        transition: color 0.2s;
        font-size: 0.9rem;
      }

      footer a:hover {
        color: #c454f0;
      }

      #score-display {
        font-size: 3em;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: white;
        text-align: center;
      }

      body.cotton-candy-glow #score-display {
        color: #333;
      }

      #compliment {
        font-size: 1.5em;
        margin-bottom: 2rem;
        text-align: center;
        color: white;
      }

      body.cotton-candy-glow #compliment {
        color: #333;
      }

      .previous-test-item {
        background-color: rgba(0, 0, 0, 0.2);
        padding: 8px;
        border-radius: 4px;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      body.cotton-candy-glow .previous-test-item {
        background-color: rgba(255, 255, 255, 0.1);
        color: #333;
      }
    </style>
  </head>
  <body tabindex="0">
    <div class="container">
      <header>
        <div class="header-left">
          <h1>TypeRak</h1>
        </div>
        <div class="header-right">
          <div id="user-select-area" class="flex items-center space-x-2">
            <label for="user-select">User:</label>
            <select id="user-select"></select>
            <button id="add-user-btn" class="primary-btn small-btn">+</button>
            <span id="username-display" class="ml-2 text-lg font-semibold text-indigo-200"></span>
          </div>
          <button id="menu-btn" class="icon-btn">☰</button>
        </div>
      </header>

      <div id="user-greeting-area" class="content-section text-center">
        <h2>Welcome to TypeRak!</h2>
        <p id="greeting-message">No users found. Create one below to get started.</p>
        <div id="greeting-user-creation" class="mt-5 p-4 bg-black bg-opacity-10 rounded-lg max-w-md mx-auto">
          <label for="greeting-new-user-input" class="block mb-2">Enter username:</label>
          <input type="text" id="greeting-new-user-input" placeholder="New username" class="w-full p-2 rounded-md border border-gray-600 mb-2 text-base" />
          <button id="greeting-create-user-btn" class="primary-btn w-full">Create User & Start</button>
        </div>
      </div>

      <div id="create-user-section" class="content-section hidden">
        <h2>Create New User</h2>
        <div class="glass-panel">
          <label for="new-username-input">Enter Username:</label>
          <input type="text" id="new-username-input" placeholder="New username">
          <label for="confirm-username-input">Confirm Username:</label>
          <input type="text" id="confirm-username-input" placeholder="Confirm username">
          <button id="confirm-new-user-btn" class="primary-btn">Create User</button>
          <button id="cancel-new-user-btn" class="primary-btn">Cancel</button>
        </div>
      </div>

      <section id="start-test-area" class="content-section hidden">
        <div id="test-creation-zone" class="flex flex-col md:flex-row justify-center gap-4">
          <button id="create-new-test-btn" class="primary-btn">Create New Test</button>
          <button id="continue-test-btn" class="primary-btn hidden">Continue Last Test</button>
        </div>
        <div id="previous-tests-display" class="mt-5 w-full max-w-3xl text-left mx-auto">
          <h3 class="text-xl font-semibold mb-2">Your Previous Tests:</h3>
          <div id="previous-tests-list" class="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
            <p class="text-gray-400">No tests recorded yet.</p>
          </div>
        </div>
      </section>

      <div id="typing-area" class="content-section hidden">
        <div id="test-naming-prompt" class="hidden mb-4 text-center w-full max-w-xl mx-auto">
          <label for="current-test-name-input" class="block mb-1">Enter name for this test:</label>
          <input type="text" id="current-test-name-input" placeholder="e.g., My Speed Practice" class="w-full mt-1 mb-2 p-2 rounded-md border border-gray-600" />
          <button id="confirm-test-name-btn" class="primary-btn">Start Typing</button>
        </div>

        <div id="text-display-area">
          <div id="text-display">
            <div id="text-flow"></div>
          </div>
          <div id="caret"></div>
        </div>

        <div id="typing-stats-area" class="stats-container">
          <div class="stat-box">
            <span class="stat-label">Time:</span>
            <span id="time-display">00:00</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Speed:</span>
            <span id="wpm">0 WPM</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Errors:</span>
            <span id="errors">0</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Accuracy:</span>
            <span id="accuracy">0.00%</span>
          </div>
        </div>

        <div id="test-controls" class="mt-4">
          <button id="restart-btn" class="primary-btn hidden">Restart Current Test</button>
        </div>
        <div id="message" class="mt-4 text-center text-red-400"></div>
      </div>

      <div id="results-area" class="content-section hidden">
        <div id="score-display">
          <span class="score-label">Score:</span>
          <span id="final-score">0</span>
          <span class="score-label">/ 1000</span>
        </div>
        <div id="compliment"></div>
        <div id="results-stats" class="stats-container">
          <div class="stat-box">
            <span class="stat-label">Time:</span>
            <span id="final-time">00:00</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Speed:</span>
            <span id="final-wpm">0 WPM</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Errors:</span>
            <span id="final-errors">0</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Accuracy:</span>
            <span id="final-accuracy">0.00%</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Signs:</span>
            <span id="final-signs">0</span>
          </div>
        </div>
        <div id="results-controls" class="mt-4">
          <button id="restart-results-btn" class="primary-btn">Back to Test Dashboard</button>
        </div>
      </div>

      <div id="side-menu">
        <div class="menu-header">
          <h2>Settings</h2>
          <button id="close-menu-btn" class="icon-btn">×</button>
        </div>
        <div class="menu-section">
          <button id="delete-user-btn" class="danger-btn w-full mt-2">Delete Current User</button>
        </div>
        <div class="menu-section">
          <label for="duration-select">Test Duration:</label>
          <select id="duration-select">
            <option value="30">30 Seconds</option>
            <option value="60" selected>1 Minute</option>
            <option value="120">2 Minutes</option>
            <option value="180">3 Minutes</option>
            <option value="300">5 Minutes</option>
            <option value="600">10 Minutes</option>
            <option value="1200">20 Minutes</option>
            <option value="1800">30 Minutes</option>
            <option value="3600">60 Minutes</option>
          </select>
        </div>
        <div class="menu-section">
          <label for="theme-select">Theme:</label>
          <select id="theme-select">
            <option value="cosmic-nebula" selected>Cosmic Nebula</option>
            <option value="midnight-black">Midnight Black</option>
            <option value="cotton-candy-glow">Cotton Candy Glow</option>
          </select>
        </div>
        <div class="menu-section">
          <label>More Options:</label>
          <button id="contact-me-btn" class="primary-btn w-full mb-2">Contact Me</button>
          <a id="check-this-out-link" href="https://raktherock.github.io/Rak/" target="_blank" class="primary-btn block text-center no-underline">Check This Out</a>
        </div>
      </div>

      <footer id="footer">
        <a href="https://www.reddit.com/user/Rak_the_rock" target="_blank">Reddit</a>
        <a href="https://github.com/Raktherock" target="_blank">GitHub</a>
        <a href="https://t.me/RakshanKumaraa" target="_blank">Telegram</a>
        <a href="https://www.linkedin.com/in/rakshan-kumaraa-140049365/" target="_blank">LinkedIn</a>
        <a href="https://wa.me/916369314244" target="_blank">WhatsApp</a>
        <a href="mailto:rakshankumaraa@gmail.com">Gmail</a>
      </footer>
    </div>

    <script>
      // Word list for typing test
      const wordList = [
        "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "and", "runs",
        "through", "forest", "with", "great", "speed", "while", "being", "chased", "by",
        "hunter", "who", "wants", "catch", "for", "his", "dinner", "but", "fox", "too",
        "smart", "fast", "escape", "from", "danger", "using", "its", "natural", "instincts",
        "survival", "skills", "that", "have", "been", "developed", "over", "many", "years",
        "evolution", "making", "one", "most", "cunning", "animals", "in", "animal", "kingdom",
        "able", "outsmart", "even", "most", "experienced", "hunters", "with", "ease", "grace"
      ];

      // Global variables
      let usersList = JSON.parse(localStorage.getItem("typeRakUsersList") || "[]");
      let currentActiveUser = localStorage.getItem("typeRakActiveUser") || "";
      let testResults = [];
      let lastTestText = "";
      let currentTestName = "";
      let deleteConfirmState = false;
      let gameOver = false;
      let testActive = false;
      let elapsed = 0;
      let duration = 60;
      let pos = 0;
      let chars = [];
      let typedCharacters = [];
      let totalErrors = 0;
      let timerID = null;

      // DOM elements
      const userGreetingArea = document.getElementById("user-greeting-area");
      const startTestArea = document.getElementById("start-test-area");
      const createUserSection = document.getElementById("create-user-section");
      const typingArea = document.getElementById("typing-area");
      const resultsArea = document.getElementById("results-area");
      const textFlow = document.getElementById("text-flow");
      const caret = document.getElementById("caret");
      const timeDisplay = document.getElementById("time-display");
      const wpmDisplay = document.getElementById("wpm");
      const errorsDisplay = document.getElementById("errors");
      const accuracyDisplay = document.getElementById("accuracy");
      const restartBtn = document.getElementById("restart-btn");
      const userSelect = document.getElementById("user-select");
      const addUserBtn = document.getElementById("add-user-btn");
      const usernameDisplay = document.getElementById("username-display");
      const menuBtn = document.getElementById("menu-btn");
      const closeMenuBtn = document.getElementById("close-menu-btn");
      const sideMenu = document.getElementById("side-menu");
      const container = document.querySelector(".container");
      const themeSelect = document.getElementById("theme-select");
      const durationSelect = document.getElementById("duration-select");
      const deleteUserBtn = document.getElementById("delete-user-btn");
      const greetingCreateUserBtn = document.getElementById("greeting-create-user-btn");
      const greetingNewUserInput = document.getElementById("greeting-new-user-input");
      const newUsernameInput = document.getElementById("new-username-input");
      const confirmUsernameInput = document.getElementById("confirm-username-input");
      const confirmNewUserBtn = document.getElementById("confirm-new-user-btn");
      const cancelNewUserBtn = document.getElementById("cancel-new-user-btn");
      const createNewTestBtn = document.getElementById("create-new-test-btn");
      const continueTestBtn = document.getElementById("continue-test-btn");
      const testNamingPrompt = document.getElementById("test-naming-prompt");
      const currentTestNameInput = document.getElementById("current-test-name-input");
      const confirmTestNameBtn = document.getElementById("confirm-test-name-btn");
      const previousTestsList = document.getElementById("previous-tests-list");
      const messageDisplay = document.getElementById("message");
      const greetingMessage = document.getElementById("greeting-message");
      const greetingUserCreation = document.getElementById("greeting-user-creation");
      const finalScoreDisplay = document.getElementById("final-score");
      const finalTimeDisplay = document.getElementById("final-time");
      const finalWpmDisplay = document.getElementById("final-wpm");
      const finalErrorsDisplay = document.getElementById("final-errors");
      const finalAccuracyDisplay = document.getElementById("final-accuracy");
      const finalSignsDisplay = document.getElementById("final-signs");
      const complimentDisplay = document.getElementById("compliment");
      const restartResultsBtn = document.getElementById("restart-results-btn");

      // Helper functions
      function generateWords(count) {
        let generatedText = "";
        for (let i = 0; i < count; i++) {
          generatedText += wordList[Math.floor(Math.random() * wordList.length)];
          if (i < count - 1) {
            generatedText += " ";
          }
        }
        return generatedText;
      }

      function renderText(text) {
        textFlow.innerHTML = "";
        chars = [];
        const frag = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = char;
          frag.appendChild(span);
          chars.push(span);
        }
        textFlow.appendChild(frag);
      }

      function adjustCaretPosition() {
        if (!caret || !chars || chars.length === 0 || pos >= chars.length) return;
        const currentChar = chars[pos];
        if (!currentChar) return;
        const charRect = currentChar.getBoundingClientRect();
        const displayRect = document.getElementById("text-display-area").getBoundingClientRect();
        caret.style.left = `${charRect.left - displayRect.left}px`;
        caret.style.top = `${charRect.bottom - displayRect.top - 2}px`;
      }

      function updateStats() {
        if (!timeDisplay) return;
        timeDisplay.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
        const mins = Math.max(elapsed / 60, 1 / 60);
        const correctSigns = typedCharacters.filter((char, index) => char === chars[index]?.textContent).length;
        const speed = Math.round(Math.max(0, (correctSigns / 5) / mins));
        wpmDisplay.textContent = `${speed} WPM`;
        errorsDisplay.textContent = totalErrors;
        const accuracyValue = typedCharacters.length > 0 ? ((correctSigns / typedCharacters.length) * 100).toFixed(2) : "0.00";
        accuracyDisplay.textContent = `${accuracyValue}%`;
        adjustCaretPosition();
      }

      function startTimer() {
        timerID = setInterval(() => {
          elapsed++;
          if (elapsed >= duration) {
            endTest();
          }
          updateStats();
        }, 1000);
      }

      function endTest() {
        if (gameOver) return;
        gameOver = true;
        testActive = false;
        clearInterval(timerID);
        timerID = null;
        document.removeEventListener("keydown", handleKey);
        
        // Calculate final stats
        const correctSigns = typedCharacters.filter((char, index) => char === chars[index]?.textContent).length;
        const finalWpm = Math.round(Math.max(0, (correctSigns / 5) / (elapsed / 60 || 1)));
        const finalAccuracy = typedCharacters.length > 0 ? ((correctSigns / typedCharacters.length) * 100).toFixed(2) : "0.00";
        
        // Show results
        typingArea.classList.add("hidden");
        resultsArea.classList.remove("hidden");
        
        finalTimeDisplay.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
        finalWpmDisplay.textContent = `${finalWpm} WPM`;
        finalErrorsDisplay.textContent = totalErrors;
        finalAccuracyDisplay.textContent = `${finalAccuracy}%`;
        finalSignsDisplay.textContent = correctSigns;
        
        const finalScore = calculateScore();
        finalScoreDisplay.textContent = finalScore;
        complimentDisplay.textContent = getCompliment(finalScore);
        
        // Save test result
        saveTestResult({
          name: currentTestName || "Unnamed Test",
          finalWpm: finalWpm,
          finalAccuracy: finalAccuracy,
          finalErrors: totalErrors,
          date: new Date().toISOString()
        });
      }

      function calculateScore() {
        const correctSigns = typedCharacters.filter((char, index) => char === chars[index]?.textContent).length;
        const finalWpm = Math.round(Math.max(0, (correctSigns / 5) / (elapsed / 60 || 1)));
        const accuracy = typedCharacters.length > 0 ? Math.max(0, (correctSigns - totalErrors) / correctSigns) : 1;
        const wpmWeight = 700;
        const accuracyWeight = 300;
        const targetWpm = 100;
        const wpmContribution = (Math.min(finalWpm, targetWpm) / targetWpm) * wpmWeight;
        const accuracyContribution = accuracy * accuracyWeight;
        let totalScore = Math.round(wpmContribution + accuracyContribution);
        return Math.max(0, Math.min(1000, totalScore));
      }

      function getCompliment(score) {
        if (score >= 971) return "Flawless Victory! Typing Master!";
        if (score >= 901) return "Outstanding! Nearly Perfect!";
        if (score >= 751) return "Excellent! Impressive Speed and Accuracy!";
        if (score >= 601) return "Solid Performance! Nice Typing!";
        if (score >= 401) return "Good Effort! Keep Practicing!";
        return "Getting Started! Keep Typing!";
      }

      function saveTestResult(result) {
        if (!currentActiveUser) return;
        const userResults = JSON.parse(localStorage.getItem(`typeRakTests-${currentActiveUser}`) || '[]');
        userResults.push(result);
        localStorage.setItem(`typeRakTests-${currentActiveUser}`, JSON.stringify(userResults));
        displayPreviousTests();
      }

      function handleKey(e) {
        if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") {
          if (e.target === currentTestNameInput && e.key === "Enter") {
            e.preventDefault();
            confirmTestNameBtn.click();
          }
          return;
        }
        
        if (typingArea.classList.contains("hidden") || gameOver) {
          return;
        }
        
        e.preventDefault();
        
        if (!testActive && e.key.length === 1 && pos < chars.length) {
          startTimer();
          testActive = true;
          restartBtn.classList.remove("hidden");
        }
        
        if (!testActive) return;
        
        const expectedChar = chars[pos]?.textContent;
        const typedChar = e.key;
        
        if (typedChar === "Backspace") {
          if (pos > 0) {
            pos--;
            typedCharacters.pop();
            chars[pos]?.classList.remove("correct", "incorrect");
          }
        } else if (typedChar && typedChar.length === 1) {
          typedCharacters.push(typedChar);
          if (expectedChar === typedChar) {
            chars[pos]?.classList.add("correct");
            pos++;
          } else {
            chars[pos]?.classList.add("incorrect");
            totalErrors++;
            pos++;
          }
          
          if (pos >= chars.length) {
            endTest();
          }
        }
        
        updateStats();
        adjustCaretPosition();
      }

      function applyTheme(theme) {
        const body = document.body;
        body.classList.remove("cosmic-nebula", "midnight-black", "cotton-candy-glow");
        if (theme === "midnight-black") body.classList.add("midnight-black");
        else if (theme === "cotton-candy-glow") body.classList.add("cotton-candy-glow");
        localStorage.setItem("typeRakTheme", theme);
      }

      function populateUserSelect() {
        userSelect.innerHTML = "";
        usersList.forEach(username => {
          const option = document.createElement("option");
          option.value = username;
          option.textContent = username;
          userSelect.appendChild(option);
        });
        if (currentActiveUser) {
          userSelect.value = currentActiveUser;
        }
      }

      function setActiveUser(username) {
        currentActiveUser = username;
        localStorage.setItem("typeRakActiveUser", username || "");
        if (username) {
          usernameDisplay.textContent = username;
          userSelect.value = username;
          userGreetingArea.classList.add("hidden");
          startTestArea.classList.remove("hidden");
          loadTestResults();
        } else {
          usernameDisplay.textContent = "";
          userGreetingArea.classList.remove("hidden");
          startTestArea.classList.add("hidden");
          typingArea.classList.add("hidden");
          resultsArea.classList.add("hidden");
          greetingMessage.textContent = usersList.length === 0
            ? "No users found. Create one to get started!"
            : "Please select or create a user to begin.";
        }
        populateUserSelect();
      }

      function loadTestResults() {
        if (!currentActiveUser) return;
        const storedResults = localStorage.getItem(`typeRakTests-${currentActiveUser}`);
        testResults = storedResults ? JSON.parse(storedResults) : [];
        displayPreviousTests();
      }

      function displayPreviousTests() {
        previousTestsList.innerHTML = "";
        if (testResults.length === 0) {
          previousTestsList.innerHTML = "<p>No tests recorded yet.</p>";
          return;
        }
        testResults.forEach((test, index) => {
          const testItem = document.createElement("div");
          testItem.className = "previous-test-item";
          const date = new Date(test.date);
          const dateString = date.toLocaleDateString() + " " + date.toLocaleTimeString();
          testItem.innerHTML = `
            <span>${test.name || `Test ${index + 1}`} - ${dateString}</span>
            <span>${test.finalWpm} WPM, ${test.finalAccuracy}% Errors: ${test.finalErrors}</span>
          `;
          previousTestsList.appendChild(testItem);
        });
      }

      function initializeTest() {
        clearInterval(timerID);
        timerID = null;
        testActive = false;
        gameOver = false;
        elapsed = 0;
        pos = 0;
        totalErrors = 0;
        typedCharacters = [];
        
        const textToUse = generateWords(100);
        renderText(textToUse);
        restartBtn.classList.add("hidden");
        updateStats();
        adjustCaretPosition();
        document.addEventListener("keydown", handleKey);
      }

      function displayUserMessage(msg, isError = false) {
        if (messageDisplay) {
          messageDisplay.textContent = msg;
          messageDisplay.style.color = isError ? "red" : "white";
          setTimeout(() => {
            if (messageDisplay.textContent === msg) {
              messageDisplay.textContent = "";
            }
          }, 3000);
        }
      }

      // Event listeners
      document.addEventListener("DOMContentLoaded", () => {
        // Initialize theme
        const savedTheme = localStorage.getItem("typeRakTheme") || "cosmic-nebula";
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);

        // Initialize duration
        const savedDuration = localStorage.getItem("typeRakDuration") || "60";
        durationSelect.value = savedDuration;
        duration = parseInt(savedDuration, 10);

        // Initialize users
        populateUserSelect();
        if (currentActiveUser && usersList.includes(currentActiveUser)) {
          setActiveUser(currentActiveUser);
        } else if (usersList.length > 0) {
          setActiveUser(usersList[0]);
        } else {
          setActiveUser(null);
        }

        // Menu functionality
        menuBtn?.addEventListener("click", (e) => {
          e.stopPropagation();
          sideMenu?.classList.add("active");
          const overlay = document.createElement("div");
          overlay.classList.add("overlay", "active");
          container?.appendChild(overlay);
          overlay.addEventListener("click", () => {
            sideMenu.classList.remove("active");
            overlay.remove();
          });
        });

        closeMenuBtn?.addEventListener("click", () => {
          sideMenu?.classList.remove("active");
          const overlay = container?.querySelector(".overlay.active");
          if (overlay) overlay.remove();
        });

        // User management
        addUserBtn?.addEventListener("click", () => {
          userGreetingArea.classList.add("hidden");
          startTestArea.classList.add("hidden");
          typingArea.classList.add("hidden");
          resultsArea.classList.add("hidden");
          createUserSection.classList.remove("hidden");
        });

        greetingCreateUserBtn?.addEventListener("click", () => {
          const username = greetingNewUserInput.value.trim();
          if (username && !usersList.includes(username)) {
            usersList.push(username);
            localStorage.setItem("typeRakUsersList", JSON.stringify(usersList));
            setActiveUser(username);
            displayUserMessage(`User "${username}" created and selected.`);
          } else {
            displayUserMessage("Please enter a valid username.", true);
          }
        });

        confirmNewUserBtn?.addEventListener("click", () => {
          const newUsername = newUsernameInput.value.trim();
          const confirmUsername = confirmUsernameInput.value.trim();
          if (newUsername && newUsername === confirmUsername && !usersList.includes(newUsername)) {
            usersList.push(newUsername);
            localStorage.setItem("typeRakUsersList", JSON.stringify(usersList));
            setActiveUser(newUsername);
            createUserSection.classList.add("hidden");
            displayUserMessage(`User "${newUsername}" created and selected.`);
          } else {
            displayUserMessage("Please check your username entries.", true);
          }
        });

        cancelNewUserBtn?.addEventListener("click", () => {
          createUserSection.classList.add("hidden");
          if (currentActiveUser) {
            startTestArea.classList.remove("hidden");
          } else {
            userGreetingArea.classList.remove("hidden");
          }
        });

        // Test functionality
        createNewTestBtn?.addEventListener("click", () => {
          if (!currentActiveUser) {
            displayUserMessage("Please select a user first.", true);
            return;
          }
          startTestArea.classList.add("hidden");
          typingArea.classList.remove("hidden");
          testNamingPrompt.classList.remove("hidden");
          currentTestNameInput.focus();
        });

        confirmTestNameBtn?.addEventListener("click", () => {
          currentTestName = currentTestNameInput.value.trim();
          if (!currentTestName) {
            displayUserMessage("Please enter a name for your test.", true);
            return;
          }
          testNamingPrompt.classList.add("hidden");
          initializeTest();
        });

        restartBtn?.addEventListener("click", () => {
          initializeTest();
        });

        restartResultsBtn?.addEventListener("click", () => {
          resultsArea.classList.add("hidden");
          startTestArea.classList.remove("hidden");
        });

        // Settings
        themeSelect?.addEventListener("change", (e) => {
          applyTheme(e.target.value);
        });

        durationSelect?.addEventListener("change", (e) => {
          duration = parseInt(e.target.value, 10);
          localStorage.setItem("typeRakDuration", duration.toString());
        });

        userSelect?.addEventListener("change", (e) => {
          setActiveUser(e.target.value);
        });

        deleteUserBtn?.addEventListener("click", () => {
          if (!currentActiveUser) return;
          if (!deleteConfirmState) {
            displayUserMessage(`CONFIRM: Delete "${currentActiveUser}"? Click delete again.`);
            deleteConfirmState = true;
            deleteUserBtn.textContent = "Confirm Delete";
            deleteUserBtn.style.backgroundColor = "#e74c3c";
            return;
          }
          
          const userToDelete = currentActiveUser;
          usersList = usersList.filter(user => user !== userToDelete);
          localStorage.setItem("typeRakUsersList", JSON.stringify(usersList));
          localStorage.removeItem(`typeRakTests-${userToDelete}`);
          
          deleteConfirmState = false;
          deleteUserBtn.textContent = "Delete Current User";
          deleteUserBtn.style.backgroundColor = "";
          
          if (usersList.length > 0) {
            setActiveUser(usersList[0]);
          } else {
            setActiveUser(null);
          }
          displayUserMessage(`User "${userToDelete}" deleted.`);
        });
      });
    </script>
  </body>
</html>
