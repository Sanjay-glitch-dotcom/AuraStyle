document.addEventListener('DOMContentLoaded', async () => {
    // Make overview cards act as nav links synchronously on load
    document.querySelectorAll('.overview-nav-card').forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target-tab');
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('show', 'active'));
            document.getElementById(targetId).classList.add('show', 'active');
            document.querySelectorAll('#v-pills-tab .nav-link').forEach(l => l.classList.remove('active'));
        });
    });

    // Handle sidebar buttons manually to prevent Bootstrap tab state desync
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target-tab');
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('show', 'active'));
            document.getElementById(targetId).classList.add('show', 'active');
            
            document.querySelectorAll('#v-pills-tab .nav-link').forEach(l => l.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Handle Back to Overview buttons
    document.querySelectorAll('.btn-back-to-overview').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('show', 'active'));
            document.getElementById('tab-overview').classList.add('show', 'active');
            document.querySelectorAll('#v-pills-tab .nav-link').forEach(l => l.classList.remove('active'));
            document.getElementById('nav-overview-btn').classList.add('active');
        });
    });

    // Theme logic
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars"></i>';

    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars"></i>';
    });

    const logoutBtn = document.getElementById('btn-logout');
    const sidebarLogoutBtn = document.getElementById('btn-sidebar-logout');
    
    const handleLogout = async (e) => {
        e.preventDefault();
        await ApiService.logout();
        window.location.href = '/';
    };

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleLogout);

    // Toast
    const toastEl = document.getElementById('appToast');
    const appToast = new bootstrap.Toast(toastEl);
    function showToast(msg, type='success') {
        document.getElementById('toast-message').innerText = msg;
        const titleEl = document.getElementById('toast-title');
        const iconEl = document.getElementById('toast-icon');
        
        if (type === 'error' || type === true) {
            titleEl.innerText = 'Error';
            iconEl.className = 'bi bi-x-circle-fill text-danger me-2';
        } else if (type === 'info') {
            titleEl.innerText = 'Notification';
            iconEl.className = 'bi bi-info-circle-fill text-primary me-2';
        } else {
            titleEl.innerText = 'Success';
            iconEl.className = 'bi bi-check-circle-fill text-success me-2';
        }
        appToast.show();
    }

    try {
        const profile = await ApiService.getProfile();
        document.getElementById('profile-name').innerText = profile.username;
        document.getElementById('welcome-name').innerText = profile.username;
        document.getElementById('profile-email').innerText = profile.email;
        document.getElementById('set-username').value = profile.username;
        document.getElementById('set-email').value = profile.email;
    } catch (e) {
        window.location.href = '/'; // Redirect to home if not logged in
        return;
    }

    // Load Data Functions
    async function loadAddresses() {
        const grid = document.getElementById('addresses-grid');
        try {
            const addresses = await ApiService.getAddresses();
            document.getElementById('stat-addresses').innerText = addresses.length;
            if (addresses.length === 0) {
                grid.innerHTML = '<div class="col w-100"><div class="alert alert-light text-center border">No addresses found. Add one above!</div></div>';
                return;
            }
            grid.innerHTML = addresses.map(a => `
                <div class="col-md-6 mb-3">
                    <div class="card h-100 border ${a.is_default ? 'border-primary shadow-sm' : ''}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <h5 class="fw-bold">${a.title}</h5>
                                ${a.is_default ? '<span class="badge bg-primary">Default</span>' : ''}
                            </div>
                            <p class="text-muted mb-1">${a.street_address}</p>
                            <p class="text-muted mb-3">${a.city}, ${a.state} ${a.postal_code}<br>${a.country}</p>
                            <button class="btn btn-sm btn-outline-danger btn-delete-address" data-id="${a.id}">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.btn-delete-address').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    try {
                        await ApiService.deleteAddress(id);
                        showToast('Address deleted');
                        loadAddresses();
                    } catch (err) {
                        showToast('Error deleting address', true);
                    }
                });
            });
        } catch (e) {
            grid.innerHTML = '<p class="text-danger">Failed to load addresses.</p>';
        }
    }

    async function loadFavorites() {
        const grid = document.getElementById('favorites-grid');
        try {
            const favs = await ApiService.getFavorites();
            document.getElementById('stat-favorites').innerText = favs.length;
            if (favs.length === 0) {
                grid.innerHTML = '<div class="col w-100"><div class="alert alert-light text-center border">Your wishlist is empty. Go discover some styles!</div></div>';
                return;
            }
            grid.innerHTML = favs.map(f => {
                const p = f.product;
                const storeName = p.store ? p.store.name : 'AuraStyle';
                const externalUrl = p.external_url ? p.external_url : '#';
                return `
                <div class="col mb-3">
                    <div class="card product-card h-100 border-0 shadow-sm">
                        <div class="product-img-wrapper" style="height:250px;">
                            <img src="${p.image_url || 'https://via.placeholder.com/400x500?text=No+Image'}" alt="${p.name}" onload="this.classList.add('loaded')" class="product-image-click" data-image="${p.image_url || ''}">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h6 class="fw-bold text-truncate mb-1" title="${p.name}">${p.name}</h6>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="fw-bold text-primary">₹${p.price}</span>
                                <small class="text-muted">${storeName}</small>
                            </div>
                            <div class="mt-auto d-flex gap-2">
                                <a href="${externalUrl}" target="_blank" class="btn btn-primary flex-grow-1 rounded-pill btn-sm">Buy Now</a>
                                <button class="btn btn-outline-danger rounded-pill btn-sm btn-remove-fav" data-id="${f.id}"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');

            document.querySelectorAll('.btn-remove-fav').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const btnEl = e.target.closest('button');
                    const id = btnEl.getAttribute('data-id');
                    try {
                        await ApiService.removeFavorite(id);
                        showToast('Removed from wishlist');
                        loadFavorites();
                    } catch (err) {
                        showToast('Error removing favorite', true);
                    }
                });
            });
        } catch (e) {
            grid.innerHTML = '<p class="text-danger">Failed to load favorites.</p>';
        }
    }

    async function loadSearchHistory() {
        const list = document.getElementById('history-list');
        try {
            const history = await ApiService.getSearchHistory();
            document.getElementById('stat-searches').innerText = history.length;
            if (history.length === 0) {
                list.innerHTML = '<div class="alert alert-light text-center border m-3">No search history.</div>';
                return;
            }
            list.innerHTML = history.map(h => {
                const date = new Date(h.timestamp).toLocaleString();
                let icon = 'bi-search';
                let content = h.query_text || '';
                let thumbnail = '';
                
                if (h.search_type === 'IMAGE' || h.search_type === 'HYBRID') {
                    if (h.search_type === 'IMAGE') { icon = 'bi-image'; content = 'Image Search'; }
                    if (h.search_type === 'HYBRID') { icon = 'bi-images'; content = h.query_text + ' + Image'; }
                    if (h.query_image_url) {
                        thumbnail = `<img src="${h.query_image_url}" alt="thumbnail" class="rounded object-fit-cover shadow-sm" style="width: 50px; height: 50px;">`;
                    }
                }

                // If it has query_text, we can rerun it via URL param. 
                const canRerun = h.query_text ? true : false;
                
                return `
                <div class="list-group-item d-flex gap-3 py-3 align-items-center flex-wrap">
                    <div class="d-flex align-items-center justify-content-center bg-light rounded-circle" style="width: 50px; height: 50px;">
                        ${thumbnail || `<i class="bi ${icon} fs-4 text-primary"></i>`}
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1 fw-bold">${content}</h6>
                        <div class="d-flex gap-3">
                            <small class="opacity-75">${h.search_type} search</small>
                            <small class="opacity-50">${date}</small>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        ${canRerun ? `<a href="/?q=${encodeURIComponent(h.query_text)}" class="btn btn-outline-primary btn-sm rounded-pill fw-bold px-3 d-flex align-items-center">Rerun</a>` : ''}
                        <button class="btn btn-light text-danger btn-delete-history border rounded-circle" data-id="${h.id}" title="Delete"><i class="bi bi-trash3"></i></button>
                    </div>
                </div>`;
            }).join('');

            document.querySelectorAll('.btn-delete-history').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.closest('button').getAttribute('data-id');
                    try {
                        await ApiService.deleteSearchHistory(id);
                        showToast('Search history item deleted');
                        loadSearchHistory();
                    } catch (err) {
                        showToast('Error deleting history item', true);
                    }
                });
            });
        } catch (e) {
            list.innerHTML = '<p class="text-danger m-3">Failed to load history.</p>';
        }
    }

    // Trigger Clear History Modal
    const btnClearAllTrigger = document.getElementById('btn-clear-all-trigger');
    if (btnClearAllTrigger) {
        btnClearAllTrigger.addEventListener('click', () => {
            const countStr = document.getElementById('stat-searches').innerText;
            const count = parseInt(countStr) || 0;
            if (count === 0) {
                const emptyState = document.querySelector('#history-list .alert');
                if (emptyState) {
                    emptyState.innerHTML = '<i class="bi bi-info-circle-fill text-primary me-2"></i> Your search history is already empty.';
                    emptyState.classList.replace('alert-light', 'alert-info');
                    
                    // Revert back after 3 seconds
                    setTimeout(() => {
                        emptyState.classList.replace('alert-info', 'alert-light');
                        emptyState.innerHTML = 'No search history.';
                    }, 3000);
                }
            } else {
                const clearHistoryModal = new bootstrap.Modal(document.getElementById('clearHistoryModal'));
                clearHistoryModal.show();
            }
        });
    }

    // Clear History Modal Confirm
    const btnConfirmClearHistory = document.getElementById('btn-confirm-clear-history');
    if (btnConfirmClearHistory) {
        btnConfirmClearHistory.addEventListener('click', async () => {
            try {
                await ApiService.clearSearchHistory();
                const clearHistoryModal = bootstrap.Modal.getInstance(document.getElementById('clearHistoryModal'));
                if (clearHistoryModal) clearHistoryModal.hide();
                showToast('All search history cleared');
                loadSearchHistory();
            } catch (err) {
                showToast('Error clearing search history', true);
            }
        });
    }

    // Address Form
    const addressForm = document.getElementById('address-form');
    const addressModalEl = document.getElementById('addAddressModal');
    let addressModal = null;
    if (typeof bootstrap !== 'undefined') {
        addressModal = new bootstrap.Modal(addressModalEl);
    }

    addressForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById('addr-title').value,
            street_address: document.getElementById('addr-street').value,
            city: document.getElementById('addr-city').value,
            state: document.getElementById('addr-state').value,
            postal_code: document.getElementById('addr-zip').value,
            country: document.getElementById('addr-country').value,
            is_default: document.getElementById('addr-default').checked
        };
        try {
            await ApiService.addAddress(data);
            addressModal.hide();
            addressForm.reset();
            showToast('Address added successfully!');
            loadAddresses();
        } catch (err) {
            showToast('Error saving address', true);
        }
    });


    // --- Delete Account Logic ---
    const btnDeleteContinue = document.getElementById('btn-delete-continue');
    const btnVerifyDelete = document.getElementById('btn-verify-delete');
    const deletePasswordInput = document.getElementById('delete-password-input');
    let deleteConfirmModalInst = null;
    let deletePasswordModalInst = null;

    if (btnDeleteContinue) {
        btnDeleteContinue.addEventListener('click', () => {
            if (!deleteConfirmModalInst) {
                deleteConfirmModalInst = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteAccountConfirmModal'));
            }
            if (!deletePasswordModalInst) {
                deletePasswordModalInst = bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteAccountPasswordModal'));
            }
            
            // Hide confirm, show password
            deleteConfirmModalInst.hide();
            deletePasswordInput.value = ''; // Reset input
            
            // Wait for first modal to hide before showing second to prevent backdrop issues
            setTimeout(() => {
                deletePasswordModalInst.show();
            }, 400);
        });
    }

    if (btnVerifyDelete) {
        btnVerifyDelete.addEventListener('click', async () => {
            const password = deletePasswordInput.value.trim();
            if (!password) {
                showToast('Please enter your password.', true);
                return;
            }

            const originalHtml = btnVerifyDelete.innerHTML;
            btnVerifyDelete.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Deleting...';
            btnVerifyDelete.disabled = true;

            try {
                await ApiService.deleteAccount(password);
                
                // Success: close modal, clear local storage, redirect
                deletePasswordModalInst.hide();
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                
                showToast('Account deleted successfully.');
                setTimeout(() => {
                    window.location.href = 'auth.html';
                }, 1000);
                
            } catch (err) {
                showToast(err.message || 'Incorrect password. Please try again.', true);
                btnVerifyDelete.innerHTML = originalHtml;
                btnVerifyDelete.disabled = false;
            }
        });
    }

    // Toggle password visibility in delete modal
    document.querySelectorAll('#deleteAccountPasswordModal .toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });


    // Initial Load
    loadAddresses();
    loadFavorites();
    loadSearchHistory();

    // Image Modal Logic
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('product-image-click')) {
            const imageUrl = e.target.getAttribute('data-image');
            if (imageUrl && imageUrl !== 'undefined') {
                const modalImg = document.getElementById('previewModalImage');
                if (modalImg) {
                    modalImg.src = imageUrl;
                    modalImg.classList.remove('zoomed');
                    const modal = new bootstrap.Modal(document.getElementById('imagePreviewModal'));
                    modal.show();
                }
            }
        }
    });

    const previewModalImage = document.getElementById('previewModalImage');
    if (previewModalImage) {
        previewModalImage.addEventListener('click', () => {
            previewModalImage.classList.toggle('zoomed');
        });
    }
});
