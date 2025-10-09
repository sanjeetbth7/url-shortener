document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    
    // Auth elements
    const authContainer = document.getElementById("authContainer");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const mainApp = document.getElementById("mainApp");
    const profileSection = document.getElementById("profileSection");
    
    // Nav buttons
    const loginBtn = document.getElementById("loginBtn");
    const profileBtn = document.getElementById("profileBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    
    // Form elements
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginSubmit = document.getElementById("loginSubmit");
    const registerUsername = document.getElementById("registerUsername");
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const registerSubmit = document.getElementById("registerSubmit");
    
    // App elements
    const shortenBtn = document.getElementById("shortenBtn");
    const urlInput = document.getElementById("urlInput");
    const shortenedUrlContainer = document.getElementById("shortenedUrl");
    const urlsList = document.getElementById("urlsList");

    // Auth state
    let currentUser = null;
    let authToken = localStorage.getItem('authToken');

    // Theme Toggle
    const updateThemeDisplay = (isDarkMode) => {
        themeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    };

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        updateThemeDisplay(body.classList.contains("dark-mode"));
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') body.classList.add('dark-mode');
    updateThemeDisplay(body.classList.contains('dark-mode'));

    // Auth functions
    const showAuth = () => {
        authContainer.style.display = 'block';
        mainApp.style.display = 'none';
        profileSection.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        profileBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    };

    const showMainApp = () => {
        authContainer.style.display = 'none';
        mainApp.style.display = 'block';
        profileSection.style.display = 'none';
        loginBtn.style.display = 'none';
        profileBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
    };

    const showProfile = () => {
        authContainer.style.display = 'none';
        mainApp.style.display = 'none';
        profileSection.style.display = 'block';
        loadUserUrls();
    };

    // Check if user is logged in
    if (authToken) {
        showMainApp();
    } else {
        showAuth();
    }

    // Auth event listeners
    document.getElementById("showRegister").addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    document.getElementById("showLogin").addEventListener("click", (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    loginBtn.addEventListener("click", showAuth);
    profileBtn.addEventListener("click", showProfile);
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem('authToken');
        authToken = null;
        showAuth();
    });

    // Register
    registerSubmit.addEventListener("click", async () => {
        const username = registerUsername.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value.trim();

        if (!username || !email || !password) {
            alert('Please fill all fields');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                authToken = data.token;
                localStorage.setItem('authToken', authToken);
                currentUser = data.user;
                showMainApp();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Registration failed');
        }
    });

    // Login
    loginSubmit.addEventListener("click", async () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        if (!email || !password) {
            alert('Please fill all fields');
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                authToken = data.token;
                localStorage.setItem('authToken', authToken);
                currentUser = data.user;
                showMainApp();
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Login failed');
        }
    });

    // Shorten URL
    shortenBtn.addEventListener("click", async () => {
        const originalUrl = urlInput.value.trim();
        
        if (!originalUrl) {
            urlInput.style.borderColor = 'red';
            setTimeout(() => { urlInput.style.borderColor = ''; }, 1000);
            return;
        }

        try {
            const response = await fetch("/api/url/shorten", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify({ originalUrl }),
            });

            const data = await response.json();
            if (!response.ok) {
                alert(data.error);
                return;
            }

            const baseUrl = window.location.origin;
            const fullShortUrl = `${baseUrl}/${data.shortUrl}`;

            shortenedUrlContainer.innerHTML = '';
            const link = document.createElement('a');
            link.href = `/${data.shortUrl}`;
            link.target = '_blank';
            link.textContent = fullShortUrl;
            
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(fullShortUrl).then(() => {
                    copyButton.textContent = 'Copied! 🎉';
                    setTimeout(() => copyButton.textContent = 'Copy', 2000);
                });
            });

            shortenedUrlContainer.appendChild(link);
            shortenedUrlContainer.appendChild(copyButton);
            urlInput.value = '';
        } catch (error) {
            alert("Connection error");
        }
    });

    // Load user URLs
    const loadUserUrls = async () => {
        try {
            const response = await fetch('/api/url/my-urls', {
                headers: { "Authorization": `Bearer ${authToken}` }
            });
            
            const urls = await response.json();
            urlsList.innerHTML = '';
            
            urls.forEach(url => {
                const urlItem = document.createElement('div');
                urlItem.className = 'url-item';
                urlItem.innerHTML = `
                    <div>
                        <strong>${window.location.origin}/${url.shortUrl}</strong>
                        <p>${url.originalUrl}</p>
                        <small>Clicks: ${url.clicks} | Created: ${new Date(url.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <button onclick="editUrl('${url._id}', '${url.originalUrl}')">Edit</button>
                        <button onclick="deleteUrl('${url._id}')">Delete</button>
                    </div>
                `;
                urlsList.appendChild(urlItem);
            });
        } catch (error) {
            alert('Failed to load URLs');
        }
    };

    // Global functions for edit/delete
    window.editUrl = async (id, currentUrl) => {
        const newUrl = prompt('Enter new URL:', currentUrl);
        if (!newUrl) return;

        try {
            const response = await fetch(`/api/url/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ originalUrl: newUrl })
            });

            if (response.ok) {
                loadUserUrls();
            } else {
                alert('Failed to update URL');
            }
        } catch (error) {
            alert('Update failed');
        }
    };

    window.deleteUrl = async (id) => {
        if (!confirm('Delete this URL?')) return;

        try {
            const response = await fetch(`/api/url/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });

            if (response.ok) {
                loadUserUrls();
            } else {
                alert('Failed to delete URL');
            }
        } catch (error) {
            alert('Delete failed');
        }
    };
});