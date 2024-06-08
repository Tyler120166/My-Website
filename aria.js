// Set role attributes for buttons and links
document.querySelectorAll('button, a').forEach(element => {
    element.setAttribute('role', 'button');
});

// Ensure all images have alt attributes
document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '');
    }
});

// Add ARIA landmarks for better navigation
document.querySelector('header').setAttribute('role', 'banner');
document.querySelector('nav').setAttribute('role', 'navigation');
document.querySelector('main').setAttribute('role', 'main');
document.querySelector('footer').setAttribute('role', 'contentinfo');

// Add ARIA roles to form elements
document.querySelectorAll('form').forEach(form => {
    form.setAttribute('role', 'form');
});
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.setAttribute('role', 'textbox');
});
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.setAttribute('role', 'textbox');
});
document.querySelectorAll('input[type="password"]').forEach(input => {
    input.setAttribute('role', 'textbox');
});
document.querySelectorAll('input[type="submit"], button[type="submit"]').forEach(button => {
    button.setAttribute('role', 'button');
});

// Set ARIA live regions for dynamic content
const feedback = document.getElementById('feedback');
if (feedback) {
    feedback.setAttribute('role', 'alert');
    feedback.setAttribute('aria-live', 'assertive');
}

const loader = document.getElementById('loader');
if (loader) {
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
}

// Add ARIA roles to modal dialogs
document.querySelectorAll('.modal').forEach(modal => {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    const title = modal.querySelector('h2');
    if (title) {
        modal.setAttribute('aria-labelledby', title.id || 'dialog-title');
        if (!title.id) {
            title.id = 'dialog-title';
        }
    }
});

// Enhance focus management for modals
document.querySelectorAll('.modal').forEach(modal => {
    const focusableElements = modal.querySelectorAll('a, button, input, textarea, select');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
});

// Add ARIA roles and properties to tables
document.querySelectorAll('table').forEach(table => {
    table.setAttribute('role', 'table');
    table.querySelectorAll('thead').forEach(thead => {
        thead.setAttribute('role', 'rowgroup');
    });
    table.querySelectorAll('tbody').forEach(tbody => {
        tbody.setAttribute('role', 'rowgroup');
    });
    table.querySelectorAll('tr').forEach(tr => {
        tr.setAttribute('role', 'row');
    });
    table.querySelectorAll('th').forEach(th => {
        th.setAttribute('role', 'columnheader');
    });
    table.querySelectorAll('td').forEach(td => {
        td.setAttribute('role', 'cell');
    });
});

// Add ARIA attributes to form labels
document.querySelectorAll('label').forEach(label => {
    const input = document.getElementById(label.getAttribute('for'));
    if (input) {
        input.setAttribute('aria-labelledby', label.id || 'label-' + label.getAttribute('for'));
        if (!label.id) {
            label.id = 'label-' + label.getAttribute('for');
        }
    }
});

// Set ARIA roles for dropdown menus
document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.setAttribute('role', 'menu');
    dropdown.querySelectorAll('a').forEach(item => {
        item.setAttribute('role', 'menuitem');
    });
});

// Improve keyboard navigation for dropdown menus
document.querySelectorAll('.dropdown').forEach(dropdown => {
    const items = dropdown.querySelectorAll('a');
    items.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (index + 1) % items.length;
                items[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (index - 1 + items.length) % items.length;
                items[prevIndex].focus();
            }
        });
    });
});

// Set ARIA roles and properties for accordions
document.querySelectorAll('.accordion').forEach(accordion => {
    accordion.setAttribute('role', 'tablist');
    accordion.querySelectorAll('.accordion-item').forEach(item => {
        const header = item.querySelector('.accordion-header');
        const panel = item.querySelector('.accordion-panel');
        header.setAttribute('role', 'tab');
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', header.id || 'accordion-header-' + Math.random().toString(36).substr(2, 9));
        if (!header.id) {
            header.id = 'accordion-header-' + Math.random().toString(36).substr(2, 9);
        }
    });
});

// Ensure ARIA roles for sliders
document.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuemin', slider.min);
    slider.setAttribute('aria-valuemax', slider.max);
    slider.setAttribute('aria-valuenow', slider.value);
    slider.addEventListener('input', () => {
        slider.setAttribute('aria-valuenow', slider.value);
    });
});

// Add roles for progress bars
document.querySelectorAll('.progress-bar').forEach(progressBar => {
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', 0);
    progressBar.setAttribute('aria-valuemax', 100);
    progressBar.setAttribute('aria-valuenow', progressBar.style.width.replace('%', ''));
});

// Add roles for alert messages
document.querySelectorAll('.alert').forEach(alert => {
    alert.setAttribute('role', 'alert');
});

// Add ARIA roles for navigation menus
document.querySelectorAll('nav').forEach(nav => {
    nav.setAttribute('role', 'navigation');
    nav.querySelectorAll('a').forEach(link => {
        link.setAttribute('role', 'menuitem');
    });
});

// Add ARIA roles for buttons
document.querySelectorAll('button').forEach(button => {
    button.setAttribute('role', 'button');
});

// Set ARIA attributes for tabs
document.querySelectorAll('.tab-list').forEach(tabList => {
    tabList.setAttribute('role', 'tablist');
    tabList.querySelectorAll('.tab').forEach(tab => {
        tab.setAttribute('role', 'tab');
        const panelId = tab.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', tab.id || 'tab-' + panelId);
            if (!tab.id) {
                tab.id = 'tab-' + panelId;
            }
        }
    });
});

// Set ARIA roles for breadcrumb navigation
document.querySelectorAll('.breadcrumb').forEach(breadcrumb => {
    breadcrumb.setAttribute('role', 'navigation');
    breadcrumb.querySelector('ol').setAttribute('role', 'list');
    breadcrumb.querySelectorAll('li').forEach(item => {
        item.setAttribute('role', 'listitem');
    });
});

// Set ARIA roles for tooltips
document.querySelectorAll('[data-toggle="tooltip"]').forEach(tooltip => {
    tooltip.setAttribute('role', 'tooltip');
});

// Add ARIA roles for dialogs
document.querySelectorAll('.dialog').forEach(dialog => {
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    const title = dialog.querySelector('h2');
    if (title) {
        dialog.setAttribute('aria-labelledby', title.id || 'dialog-title-' + Math.random().toString(36).substr(2, 9));
        if (!title.id) {
            title.id = 'dialog-title-' + Math.random().toString(36).substr(2, 9);
        }
    }
});

// Ensure ARIA roles for status messages
document.querySelectorAll('.status-message').forEach(statusMessage => {
    statusMessage.setAttribute('role', 'status');
    statusMessage.setAttribute('aria-live', 'polite');
});

// Set ARIA attributes for accordions
document.querySelectorAll('.accordion').forEach(accordion => {
    accordion.setAttribute('role', 'tablist');
    accordion.querySelectorAll('.accordion-item').forEach((item, index) => {
        const header = item.querySelector('.accordion-header');
        const panel = item.querySelector('.accordion-panel');
        header.setAttribute('role', 'tab');
        header.setAttribute('aria-controls', panel.id || 'accordion-panel-' + index);
        header.setAttribute('aria-expanded', 'false');
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', header.id || 'accordion-header-' + index);
        panel.setAttribute('aria-hidden', 'true');
        panel.style.display = 'none';

        header.addEventListener('click', () => {
            const expanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !expanded);
            panel.setAttribute('aria-hidden', expanded);
            panel.style.display = expanded ? 'none' : 'block';
        });
    });
});
