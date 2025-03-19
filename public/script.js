document.getElementById("shortenBtn").addEventListener("click", async () => {
    const urlInput = document.getElementById("urlInput").value;
    if (!urlInput) return alert("Please enter a URL");

    const response = await fetch("/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: urlInput }),
    });

    const data = await response.json();
    document.getElementById("shortenedUrl").innerHTML = 
        `Short URL: <a href="/${data.shortUrl}" target="_blank">http://localhost:5000/${data.shortUrl}</a>`;
});


const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "Dark Mode" : "Light Mode";
});
