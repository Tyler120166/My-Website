document.addEventListener('DOMContentLoaded', () => {
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const body = document.body;
    const applyDarkMode = () => {
        if (darkModeSwitch.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    };

    darkModeSwitch.addEventListener('change', applyDarkMode);

    if (localStorage.getItem('darkMode') === 'enabled') {
        darkModeSwitch.checked = true;
        body.classList.add('dark-mode');
    }

    // Accessibility: Toggle dark mode using keyboard shortcut (Ctrl+D)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd') {
            darkModeSwitch.checked = !darkModeSwitch.checked;
            applyDarkMode();
        }
    });

    // Transition effect for smooth mode change
    body.style.transition = 'background-color 0.3s, color 0.3s';

    // Remember dark mode preference across sessions
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });

    if (localStorage.getItem('darkMode') === 'true') {
        darkModeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }

    // Dark mode for other elements
    const toggleElements = document.querySelectorAll('.toggle-dark-mode');
    toggleElements.forEach(element => {
        element.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode', element.checked);
            localStorage.setItem('darkMode', element.checked);
        });
    });

    // Additional dark mode styles
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        .dark-mode {
            background-color: #121212;
            color: #ffffff;
        }
        .dark-mode .navbar {
            background-color: #333;
        }
        .dark-mode .card {
            background-color: #1e1e1e;
            color: #ddd;
        }
        .dark-mode .btn {
            background-color: #444;
            color: #fff;
        }
        .dark-mode .form-control {
            background-color: #333;
            color: #fff;
        }
        .dark-mode input::placeholder {
            color: #bbb;
        }
        .dark-mode input:focus {
            border-color: #555;
            box-shadow: 0 0 5px rgba(85, 85, 85, 0.5);
        }
    `;
    document.head.appendChild(styleSheet);

    // Improved dark mode toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Dark Mode';
    toggleButton.classList.add('toggle-dark-mode-btn');
    toggleButton.style.cssText = `
        position: fixed;
        bottom: 1em;
        right: 1em;
        padding: 0.5em 1em;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    `;
    toggleButton.addEventListener('click', () => {
        darkModeSwitch.checked = !darkModeSwitch.checked;
        applyDarkMode();
    });
    document.body.appendChild(toggleButton);

    // Enhanced button hover effects
    toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.backgroundColor = '#0056b3';
    });
    toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.backgroundColor = '#007bff';
    });

    // Media query to detect system dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        darkModeSwitch.checked = true;
        applyDarkMode();
    }

    // Listen for changes to system dark mode preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        darkModeSwitch.checked = e.matches;
        applyDarkMode();
    });

    // Update dark mode switch state on page load
    darkModeSwitch.checked = localStorage.getItem('darkMode') === 'true';
    applyDarkMode();

    // Enhanced accessibility: Announce dark mode toggle state
    darkModeSwitch.addEventListener('change', () => {
        const announcement = darkModeSwitch.checked ? 'Dark mode enabled' : 'Dark mode disabled';
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.style.position = 'absolute';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.margin = '-1px';
        liveRegion.style.border = '0';
        liveRegion.style.padding = '0';
        liveRegion.style.clip = 'rect(0 0 0 0)';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        liveRegion.textContent = announcement;
        setTimeout(() => {
            document.body.removeChild(liveRegion);
        }, 1000);
    });
});
