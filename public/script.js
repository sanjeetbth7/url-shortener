document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById("themeToggle");
    const body = document.body;
    
    // Auth elements
    const authContainer = document.getElementById("authContainer");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const mainApp = document.getElementById("mainApp");
    const dashboardSection = document.getElementById("dashboardSection");
    
    // Nav buttons
    const loginBtn = document.getElementById("loginBtn");
    const userProfile = document.getElementById("userProfile");
    const userAvatar = document.getElementById("userAvatar");
    const userName = document.getElementById("userName");
    const logoutBtn = document.getElementById("logoutBtn");
    const backToMainBtn = document.getElementById("backToMainBtn");
    
    // Form elements
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginSubmit = document.getElementById("loginSubmit");
    const registerName = document.getElementById("registerName");
    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const registerSubmit = document.getElementById("registerSubmit");
    
    // App elements
    const shortenBtn = document.getElementById("shortenBtn");
    const urlInput = document.getElementById("urlInput");
    const shortenedUrlContainer = document.getElementById("shortenedUrl");
    const urlsList = document.getElementById("urlsList");

    // Auth state
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
        dashboardSection.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        userProfile.style.display = 'none';
        logoutBtn.style.display = 'none';
    };

    const showMainApp = () => {
        authContainer.style.display = 'none';
        mainApp.style.display = 'block';
        dashboardSection.style.display = 'none';
        loginBtn.style.display = 'none';
        userProfile.style.display = 'flex';
        logoutBtn.style.display = 'inline-block';
    };

    const showDashboard = () => {
        authContainer.style.display = 'none';
        mainApp.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadUserUrls();
    };

    const updateUserDisplay = (user) => {
        userName.textContent = user.name;
        userAvatar.textContent = user.avatar || user.name.charAt(0).toUpperCase();
    };

    // Check if user is logged in
    if (authToken && currentUser) {
        updateUserDisplay(currentUser);
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
    userProfile.addEventListener("click", showDashboard);
    backToMainBtn.addEventListener("click", showMainApp);
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        authToken = null;
        currentUser = null;
        showAuth();
    });

    // Register
    registerSubmit.addEventListener("click", async () => {
        const name = registerName.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value.trim();

        if (!name || !email || !password) {
            alert('Please fill all fields');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserDisplay(currentUser);
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
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserDisplay(currentUser);
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
                        <p class="original-url" data-id="${url._id}">${url.originalUrl}</p>
                        <small>Clicks: ${url.clicks} | Created: ${new Date(url.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <button onclick="editUrl('${url._id}')">Edit</button>
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
    window.editUrl = (id) => {
        const urlElement = document.querySelector(`p[data-id="${id}"]`);
        const currentUrl = urlElement.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentUrl;
        input.style.cssText = 'width:100%;padding:5px;margin:5px 0;border:1px solid #ddd;border-radius:4px;font-size:14px;';
        
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = 'padding:5px 10px;font-size:12px;margin:2px;background-color:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = 'padding:5px 10px;font-size:12px;margin:2px;background-color:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;';
        
        urlElement.style.display = 'none';
        urlElement.parentNode.insertBefore(input, urlElement);
        urlElement.parentNode.insertBefore(saveBtn, urlElement);
        urlElement.parentNode.insertBefore(cancelBtn, urlElement);
        
        input.focus();
        
        const saveEdit = async () => {
            const newUrl = input.value.trim();
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
        
        const cancelEdit = () => {
            input.remove();
            saveBtn.remove();
            cancelBtn.remove();
            urlElement.style.display = 'block';
        };
        
        saveBtn.onclick = saveEdit;
        cancelBtn.onclick = cancelEdit;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
        };
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