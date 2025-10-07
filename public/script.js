document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById("themeToggle");
    const shortenBtn = document.getElementById("shortenBtn");
    const urlInput = document.getElementById("urlInput");
    const shortenedUrlContainer = document.getElementById("shortenedUrl");
    const body = document.body;

    // --- 1. Theme Toggle Logic ---
    const updateThemeDisplay = (isDarkMode) => {
        themeToggle.textContent = isDarkMode ? "Dark Mode" : "Light Mode";
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    };

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        const isDarkMode = body.classList.contains("dark-mode");
        updateThemeDisplay(isDarkMode);
    });

    // Load saved theme on startup
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
    updateThemeDisplay(body.classList.contains('dark-mode'));


    // --- 2. Shorten URL and Display Logic ---
    shortenBtn.addEventListener("click", async () => {
        const originalUrl = urlInput.value.trim();
        
        // Input Validation
        if (!originalUrl) {
            urlInput.style.borderColor = 'red';
            setTimeout(() => { urlInput.style.borderColor = ''; }, 1000); // Clear highlight
            return;
        }

        // 1. Send Request to Server
        try {
            const response = await fetch("/shorten", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ originalUrl: originalUrl }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle server-side errors (e.g., validation failed, link already exists)
                const errorMessage = data.message || "Failed to shorten URL.";
                alert(`Error: ${errorMessage}`);
                return;
            }

            const baseUrl = window.location.origin;
            // The shortened code from the server, e.g., "abcd123"
            const shortCode = data.shortUrl; 
            // The full shortened URL string to display/copy
            const fullShortUrl = `${baseUrl}/${shortCode}`; 

            // 2. Clear and Display Result
            shortenedUrlContainer.innerHTML = ''; // Clear previous content

            const link = document.createElement('a');
            link.href = `/${shortCode}`; // The actual redirect path
            link.target = '_blank';
            link.textContent = fullShortUrl;
            
            const copyButton = document.createElement('button');
            copyButton.id = 'copyBtn';
            copyButton.textContent = 'Copy';

            // Add elements to the container (styled with flex in CSS)
            shortenedUrlContainer.appendChild(link);
            shortenedUrlContainer.appendChild(copyButton);

            // 3. Add Copy Functionality
            copyButton.addEventListener('click', () => {
                // Use the modern clipboard API
                navigator.clipboard.writeText(fullShortUrl)
                    .then(() => {
                        copyButton.textContent = 'Copied! 🎉';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy';
                        }, 2000); // Reset button text after 2 seconds
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        copyButton.textContent = 'Error!';
                    });
            });

        } catch (error) {
            console.error("Error:", error);
            alert("Connection error: Ensure  server is busy or not reachable.");
        }
    });
});