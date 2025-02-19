/**
 * Returns an array of names from the URL search parameters or a default list.
 * @returns {string[]}
 */
/**
 * Returns an array of names from the URL search parameters or fetches from names.json.
 * @returns {Promise<string[]>}
 */
var getNames = async function () {
  var params = new URLSearchParams(window.location.search);
  var namesParam = params.get("names");
  if (namesParam) {
    return namesParam.split(",");
  } else {
    try {
      var response = await fetch("names.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching names:", error);
      // Fallback default names
      return [];
    }
  }
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
 * Refreshes the display of names with a shuffled order.
 */
var refreshNames = function (names) {
  const namesContainer = document.getElementById('names');
  if (!namesContainer) return;

  namesContainer.innerHTML = "";
  var namesCopy = names.slice(); // Create a copy so the original array is not mutated
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
    timeElement.textContent = `Current time: ${displayHour}:${minutes} ${ampm}`;
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
    document.body.style.backgroundImage = `url(${response.url})`;
  } catch (error) {
    console.error('Error fetching photo:', error);
    document.body.style.backgroundColor = '#f0f8ff';
  }
};

/**
 * Renders the page by initializing all components.
 */
var renderPage = async function () {
  try {
    var names = await getNames();
    refreshNames(names);
    updateGreetingAndTime();
    setInterval(updateGreetingAndTime, 60000); // Update time every minute
    await displayRandomQuote();
    await fetchPhoto();
  } catch (error) {
    console.error("Error rendering page:", error);
  }
};

document.addEventListener("DOMContentLoaded", renderPage);