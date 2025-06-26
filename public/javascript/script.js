const questions = [
  {
    q: "What is your residential status?",
    options: ["Resident (Indian)", "Non-Resident", "Resident but Not Ordinarily Resident"],
  },
  { q: "What is your total annual income?", options: ["Less than ₹50 lakh", "More than ₹50 lakh"] },
  {
    q: "What is your primary source of income?",
    options: ["Salary / Pension", "Business or Profession", "Capital Gains", "Other Sources"],
  },
  {
    q: "Do you have income from house property?",
    options: ["No", "Yes, from one house", "Yes, from more than one house"],
  },
  { q: "Do you have any capital gains?", options: ["Yes", "No"] },
  { q: "Do you own any foreign assets or have foreign income?", options: ["Yes", "No"] },
  { q: "Do you hold shares in any unlisted company?", options: ["Yes", "No"] },
  { q: "Are you a director in any company?", options: ["Yes", "No"] },
  { q: "Are you a partner in any firm?", options: ["Yes", "No"] },
  { q: "Do you have income from freelancing or profession?", options: ["Yes", "No"] },
  { q: "Are you opting for presumptive taxation (44AD/ADA/AE)?", options: ["Yes", "No"] },
  { q: "Do you have agricultural income over ₹5,000?", options: ["Yes", "No"] },
  { q: "Have you made investments for deductions (80C, 80D, etc.)?", options: ["Yes", "No"] },
  { q: "Have you invested in cryptocurrency or virtual assets?", options: ["Yes", "No"] },
]

const answers = []
let current = 0
const container = document.getElementById("chatContainer")

function scrollToBottom() {
  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight
  })
}

function showTypingIndicator() {
  const typingDiv = document.createElement("div")
  typingDiv.className = "typing-indicator"
  typingDiv.innerHTML = `
    <div class="bot-avatar-small">
      <i class="fas fa-robot"></i>
    </div>
    <div class="typing-dots">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `
  container.appendChild(typingDiv)
  scrollToBottom()

  return typingDiv
}

function renderQuestion() {
  if (current >= questions.length) {
    // Show completion message
    const completionDiv = document.createElement("div")
    completionDiv.className = "bot-message-container"
    completionDiv.innerHTML = `
      <div class="bot-avatar-small">
        <i class="fas fa-robot"></i>
      </div>
      <div class="bubble question">
        <strong>Perfect! 🎉</strong><br>
        I've gathered all the information needed. Processing your ITR form recommendation...
      </div>
    `
    container.appendChild(completionDiv)
    scrollToBottom()

    // Simulate API call
    setTimeout(() => {
      fetch("/knowing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      })
        .then((res) => {
          if (res.redirected) window.location.href = res.url
        })
        .catch((err) => {
          console.log("Demo mode - would redirect to results")
        })
    }, 2000)
    return
  }

  const { q, options } = questions[current]

  // Show typing indicator first
  const typingIndicator = showTypingIndicator()

  setTimeout(
    () => {
      // Remove typing indicator
      typingIndicator.remove()

      // Bot question with avatar
      const questionContainer = document.createElement("div")
      questionContainer.className = "bot-message-container"
      questionContainer.innerHTML = `
      <div class="bot-avatar-small">
        <i class="fas fa-robot"></i>
      </div>
      <div class="bubble question">${q}</div>
    `
      container.appendChild(questionContainer)

      // Option buttons aligned right
      const optionsDiv = document.createElement("div")
      optionsDiv.className = "options"

      options.forEach((option, index) => {
        const btn = document.createElement("button")
        btn.textContent = option
        btn.style.animationDelay = `${index * 0.1}s`
        btn.onclick = () => {
          answers.push(option)

          // Disable all buttons to prevent multiple clicks
          optionsDiv.querySelectorAll("button").forEach((b) => (b.disabled = true))

          // User's selected answer bubble
          const userDiv = document.createElement("div")
          userDiv.className = "bubble user-answer"
          userDiv.textContent = option
          container.appendChild(userDiv)

          // Remove options after selection
          setTimeout(() => {
            optionsDiv.remove()
            current++
            scrollToBottom()
            setTimeout(() => renderQuestion(), 800)
          }, 300)
        }
        optionsDiv.appendChild(btn)
      })

      container.appendChild(optionsDiv)
      scrollToBottom()
    },
    1000 + Math.random() * 1000,
  ) // Random delay between 1-2 seconds
}

// Start the conversation after a brief delay
window.onload = () => {
  setTimeout(() => {
    renderQuestion()
  }, 2)
}
