    // Function to get names from URL
    function getNamesFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const namesParam = params.get('names');
        return namesParam ? namesParam.split(',') : [
            "Mickey Mouse",
            "John Smith",
            "Minnie Mouse",
            "Goofy Goof",
            "Daisy Duck",
            "Casey Jones",
            "Wendy Darling"
        ];
    }

    // Function to get initials from name
    function getInitials(name) {
        const nameParts = name.trim().split(' ');
        return nameParts[0][0] + nameParts[1][0];
    }

    // Function to shuffle an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to refresh the names display
    function refreshNames() {
        const namesContainer = document.getElementById('names');
        namesContainer.innerHTML = '';
        shuffle(names);
        let row;
        names.forEach((name, index) => {
            if (index % 5 === 0) {
                row = document.createElement('div');
                row.className = 'row';
                namesContainer.appendChild(row);
            }
            const initials = getInitials(name);
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.textContent = initials;
            circle.setAttribute('data-fullname', name);
            row.appendChild(circle);
        });
    }

    // Function to update the greeting and time
    function updateGreetingAndTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        let greeting = "Good Morning";

        if (hours >= 12 && hours < 18) {
            greeting = "Good Afternoon";
        } else if (hours >= 18 || hours < 6) {
            greeting = "Good Evening";
        }

        document.getElementById('greeting').textContent = `${greeting}, Team!`;
        document.getElementById('time').textContent = `Current time: ${hours}:${minutes} ${ampm}`;
    }

    // Get random quote
    async function displayRandomQuote() {
        try {
            const response = await fetch('quotes.json');
            const quotes = await response.json();
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];

            document.getElementById('quote').textContent = `"${randomQuote.q}"`;
            document.getElementById('quote-author').textContent = `- ${randomQuote.a}`;
        } catch (error) {
            console.error('Error fetching quotes:', error);
            document.getElementById('quote').textContent = `"Could not load quote."`;
        }
    }

    // Function to fetch the background image
    async function fetchPhoto() {
        try {
            const response = await fetch('https://picsum.photos/1600/900');
            document.body.style.backgroundImage = `url(${response.url})`;
        } catch (error) {
            console.error('Error fetching photo:', error);
            document.body.style.backgroundColor = '#f0f8ff';
        }
    }

    const names = getNamesFromUrl();
    refreshNames();
    updateGreetingAndTime();
    setInterval(updateGreetingAndTime, 60000); // Update every minute
    displayRandomQuote();
    fetchPhoto();