document.getElementById("shortenBtn").addEventListener("click", async () => {
    const urlInput = document.getElementById("urlInput").value;
    if (!urlInput) return alert("Please enter a URL");

    try {
        const response = await fetch("/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ originalUrl: urlInput }),
        });

        const data = await response.json();
        const baseUrl = window.location.origin;
        const shortUrl = `${baseUrl}/${data.shortUrl}`;
        
        const resultDiv = document.getElementById("shortenedUrl");
        resultDiv.innerHTML = `Short URL: <a href="/${data.shortUrl}" target="_blank">${shortUrl}</a>`;
    } catch (error) {
        console.error("Error:", error);
        alert("Error shortening URL. Please start the server first.");
    }
});


const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Dark Mode" : "Light Mode";
});
