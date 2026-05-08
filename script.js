var currentNames = [];

const CIRCLE_COLORS = [
  '#3a56e8', '#7c3aed', '#0e9f6e', '#e3a008',
  '#f05252', '#0694a2', '#e74694', '#3f83f8',
];

const nameColor = (name) => {
  let h = 0;
  for (const c of name) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return CIRCLE_COLORS[Math.abs(h) % CIRCLE_COLORS.length];
};

const fadeIn = (el) => {
  el.classList.remove('fade-in');
  void el.offsetWidth;
  el.classList.add('fade-in');
};

const getNamesFromUrl = () => {
  const param = new URLSearchParams(window.location.search).get("names");
  return param ? param.split(",").map(s => s.trim()).filter(Boolean) : [];
};

/**
 * Returns the initials from a full name.
 * @param {string} name
 * @returns {string} initials
 */
const getInitials = (name) => {
  // Split on whitespace and remove any empty strings
  const nameParts = name.trim().split(' ').filter(Boolean);
  if (nameParts.length === 0) return '';

  // Take the first character from the first and (if available) second words
  const firstInitial = nameParts[0].charAt(0).toUpperCase();
  const secondInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '';
  return `${firstInitial}${secondInitial}`;
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {any[]} array
 */
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * Parses free-form name input: comma/newline separated, with optional numbered list prefixes.
 * @param {string} text
 * @returns {string[]}
 */
const parseNamesInput = (text) => {
  return text
    .split(/[,\n]/)
    .map(s => s.replace(/^\s*\d+[.)]\s*/, '').trim())
    .filter(Boolean);
};

const showNameForm = () => {
  const footer = document.getElementById('footer-text');
  footer.style.display = 'block';
  footer.style.visibility = 'hidden';
  document.getElementById('share-btn').style.display = 'none';
  document.getElementById('dashboard-section').style.display = 'none';
  document.getElementById('name-form-section').style.display = 'block';
  document.querySelector('.container').classList.add('form-mode');
  document.getElementById('names-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submitNames();
  });
};

const showDashboard = () => {
  document.getElementById('name-form-section').style.display = 'none';
  document.querySelector('.container').classList.remove('form-mode');
  const dash = document.getElementById('dashboard-section');
  const footer = document.getElementById('footer-text');
  dash.style.display = 'block';
  footer.style.display = 'block';
  footer.style.visibility = 'visible';
  fadeIn(dash);
  fadeIn(footer);
  document.getElementById('share-btn').style.display = 'flex';
};

const submitNames = () => {
  const names = parseNamesInput(document.getElementById('names-input').value);
  if (names.length === 0) return;
  currentNames = names;
  showDashboard();
  refreshNames();
};

const copyShareLink = () => {
  const url = new URL(window.location.href);
  url.search = '?names=' + currentNames.map(encodeURIComponent).join(',');
  navigator.clipboard.writeText(url.toString()).then(() => {
    const btn = document.getElementById('share-btn');
    const icon = document.getElementById('share-icon');
    btn.classList.add('copied');
    icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => {
      btn.classList.remove('copied');
      icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
    }, 2000);
  });
};

/**
 * Refreshes the display of names with a shuffled order.
 */
var refreshNames = function () {
  const namesContainer = document.getElementById('names');
  if (!namesContainer) return;

  namesContainer.innerHTML = "";
  var namesCopy = currentNames.slice(); // Create a copy so the original array is not mutated
  shuffle(namesCopy);

  let rowElement;

  namesCopy.forEach((name, index) => {
    // Create a new row every 5 names
    if (index % 5 === 0) {
      rowElement = document.createElement('div');
      rowElement.className = 'row';
      namesContainer.appendChild(rowElement);
    }

    const initials = getInitials(name);
    const circleElement = document.createElement('div');
    circleElement.className = 'circle';
    circleElement.textContent = initials;
    circleElement.dataset.fullname = name;
    circleElement.style.backgroundColor = CIRCLE_COLORS[index % CIRCLE_COLORS.length];
    circleElement.style.animationDelay = `${index * 40}ms`;

    rowElement.appendChild(circleElement);
  });
};

/**
 * Updates the greeting message and the current time on the page.
 */
const updateGreetingAndTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const displayHour = currentHour % 12 || 12;
  const ampm = currentHour >= 12 ? 'PM' : 'AM';

  // Determine greeting based on 24-hour time
  const greeting =
    currentHour < 12
      ? 'Good Morning'
      : currentHour < 18
      ? 'Good Afternoon'
      : 'Good Evening';

  const greetingElement = document.getElementById('greeting');
  const timeElement = document.getElementById('time');

  if (greetingElement) {
    greetingElement.textContent = `${greeting}, Team!`;
  }
  if (timeElement) {
    timeElement.textContent = `Current Time: ${displayHour}:${minutes} ${ampm}`;
  }
};

/**
 * Fetches a random quote from quotes.json and displays it.
 */
const displayRandomQuote = async () => {
  try {
    const response = await fetch('quotes.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const quotes = await response.json();

    if (!Array.isArray(quotes) || quotes.length === 0) {
      throw new Error('No quotes available');
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('quote-author');

    if (quoteElement) {
      quoteElement.textContent = `"${randomQuote.q}"`;
    }
    if (authorElement) {
      authorElement.textContent = `- ${randomQuote.a}`;
    }
  } catch (error) {
    console.error('Error fetching quotes:', error);
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
      quoteElement.textContent = '"Could not load quote."';
    }
  }
};

/**
 * Fetches a random background photo and sets it as the body's background.
 */
const fetchPhoto = async () => {
  try {
    const response = await fetch('https://picsum.photos/1600/900');
    document.body.style.backgroundImage =
      `linear-gradient(rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.28) 100%), url(${response.url})`;
  } catch (error) {
    console.error('Error fetching photo:', error);
    document.body.style.background = 'linear-gradient(135deg, #1a2040 0%, #2d3561 100%)';
  }
};

/**
 * Renders the page by initializing all components.
 */
var renderPage = async function () {
  // Determine which view to show synchronously, no flicker
  const names = getNamesFromUrl();
  if (names.length === 0) {
    showNameForm();
  } else {
    currentNames = names;
    showDashboard();
    refreshNames();
  }
  updateGreetingAndTime();
  setInterval(updateGreetingAndTime, 60000);
  await Promise.all([displayRandomQuote(), fetchPhoto()]);
};

document.addEventListener("DOMContentLoaded", renderPage);