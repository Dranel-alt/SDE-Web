document.addEventListener("click", (event) => {
    const s = document.createElement("div");

    s.className = "spark";
    s.style.left = event.pageX + "px";
    s.style.top = event.pageY + "px";
    s.style.transform = "translate(-50%, -50%)";
    s.style.pointerEvents = "none";
    document.body.appendChild(s);

    setTimeout(() => {
        s.remove();
    }, 600);
});

// Legacy API helper retained for pages that still use the Node API.
const API_BASE = window.API_BASE || 'http://localhost:3000/api';

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data;
}
