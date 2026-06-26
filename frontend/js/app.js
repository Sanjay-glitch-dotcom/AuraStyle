document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const splashScreen = document.getElementById('splash-screen');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Auth UI
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const btnLogout = document.getElementById('btn-logout');
    const navProfileItem = document.getElementById('nav-profile-item');
    const navUsername = document.getElementById('nav-username');
    
    // Splash Screen logic
    const SPLASH_DELAY = 1500;
    const splashStartTime = Date.now();
    
    // GREETINGS LOGIC
    const greetings = [
        "Welcome back, {name}! Ready to discover your next favorite look?",
        "Hey, {name}! Fashion inspiration awaits.",
        "Great to see you again, {name}!",
        "Your style journey continues, {name}.",
        "Ready to turn heads today, {name}?",
        "New trends are waiting for you, {name}.",
        "Let's find something amazing today, {name}.",
        "Welcome back to AuraStyle, {name}!",
        "Time to refresh your wardrobe, {name}.",
        "Discover your next signature look, {name}.",
        "Stay stylish, {name}!",
        "Elevate your look today, {name}.",
        "Fashion is what you buy, style is what you do with it, {name}.",
        "Ready for a wardrobe glow-up, {name}?",
        "Explore the latest collections, {name}!",
        "Your perfect outfit is one search away, {name}.",
        "Hello gorgeous! Ready to shop, {name}?",
        "AuraStyle welcomes you back, {name}!",
        "Step into style, {name}.",
        "Curate your dream closet, {name}.",
        // Adding many more generic/fashion variants to reach ~100 logically
        "Find the fit that speaks to you, {name}.",
        "Your runway awaits, {name}.",
        "Dress to express, {name}.",
        "New arrivals are calling your name, {name}.",
        "Let's upgrade your aesthetic, {name}.",
        "Looking for something chic, {name}?",
        "Unleash your inner fashionista, {name}.",
        "Your daily dose of style, {name}.",
        "Every day is a fashion show, {name}.",
        "Life is too short to wear boring clothes, {name}.",
        "Confidence looks great on you, {name}.",
        "Shop the looks you love, {name}.",
        "Discover fashion that fits your vibe, {name}.",
        "What's your style mood today, {name}?",
        "Find pieces as unique as you are, {name}.",
        "Level up your layering game, {name}.",
        "From casual to couture, we've got you, {name}.",
        "Let your outfit do the talking, {name}.",
        "Stay ahead of the trends, {name}.",
        "Your personal stylist is ready, {name}.",
        "Let's build your capsule wardrobe, {name}.",
        "Express yourself through fashion, {name}.",
        "Dress how you want to be addressed, {name}.",
        "Find the perfect accessory, {name}.",
        "Step out in confidence, {name}.",
        "Upgrade your everyday essentials, {name}.",
        "Discover sustainable style, {name}.",
        "Find the perfect pair of shoes, {name}.",
        "Let's find your new favorite jeans, {name}.",
        "Dress for the occasion, {name}.",
        "Your style evolution starts here, {name}.",
        "Find the perfect gift, {name}.",
        "Let's explore new color palettes, {name}.",
        "Discover the power of a great outfit, {name}.",
        "Find fashion that empowers you, {name}.",
        "Let's find your signature scent, {name}.",
        "Discover the latest beauty trends, {name}.",
        "Find the perfect skincare routine, {name}.",
        "Let's find your new favorite makeup look, {name}.",
        "Discover the power of self-care, {name}.",
        "Find the perfect hairstyle, {name}.",
        "Let's find your new favorite nail color, {name}.",
        "Discover the power of a great smile, {name}.",
        "Find the perfect pair of glasses, {name}.",
        "Let's find your new favorite hat, {name}.",
        "Discover the power of a great bag, {name}.",
        "Find the perfect piece of jewelry, {name}.",
        "Let's find your new favorite watch, {name}.",
        "Discover the power of a great belt, {name}.",
        "Find the perfect pair of socks, {name}.",
        "Let's find your new favorite scarf, {name}.",
        "Discover the power of a great tie, {name}.",
        "Find the perfect pair of gloves, {name}.",
        "Let's find your new favorite wallet, {name}.",
        "Discover the power of a great umbrella, {name}.",
        "Find the perfect pair of sunglasses, {name}.",
        "Let's find your new favorite swimsuit, {name}.",
        "Discover the power of a great towel, {name}.",
        "Find the perfect pair of sandals, {name}.",
        "Let's find your new favorite boots, {name}.",
        "Discover the power of a great coat, {name}.",
        "Find the perfect jacket, {name}.",
        "Let's find your new favorite sweater, {name}.",
        "Discover the power of a great shirt, {name}.",
        "Find the perfect pair of pants, {name}.",
        "Let's find your new favorite skirt, {name}.",
        "Discover the power of a great dress, {name}.",
        "Find the perfect suit, {name}.",
        "Let's find your new favorite activewear, {name}.",
        "Discover the power of great loungewear, {name}.",
        "Find the perfect sleepwear, {name}.",
        "Let's find your new favorite underwear, {name}.",
        "Discover the power of great shapewear, {name}.",
        "Find the perfect hosiery, {name}.",
        "Let's find your new favorite maternity wear, {name}.",
        "Discover the power of great plus-size fashion, {name}.",
        "Find the perfect petite fashion, {name}.",
        "Let's find your new favorite tall fashion, {name}.",
        "Discover the power of great adaptive fashion, {name}.",
        "Find the perfect sustainable fashion, {name}.",
        "Let's find your new favorite vintage fashion, {name}.",
        "Discover the power of great secondhand fashion, {name}.",
        "Find the perfect upcycled fashion, {name}.",
        "Let's find your new favorite handmade fashion, {name}."
    ];

    let currentGreetingIndices = [];
    let usernameCache = '';

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function initGreetings() {
        let stored = localStorage.getItem('greetings_queue');
        if (stored) {
            currentGreetingIndices = JSON.parse(stored);
        }
        if (!currentGreetingIndices || currentGreetingIndices.length === 0) {
            currentGreetingIndices = Array.from(Array(greetings.length).keys());
            shuffleArray(currentGreetingIndices);
        }
    }

    function getNextGreeting() {
        if (currentGreetingIndices.length === 0) {
            initGreetings();
        }
        const index = currentGreetingIndices.pop();
        localStorage.setItem('greetings_queue', JSON.stringify(currentGreetingIndices));
        return greetings[index];
    }

    function updateGreetingText() {
        if (!usernameCache) return;
        const greetingTemplate = getNextGreeting();
        const text = greetingTemplate.replace('{name}', usernameCache);
        
        navUsername.classList.add('greeting-fade-out');
        navUsername.classList.remove('greeting-fade-in');
        
        setTimeout(() => {
            navUsername.innerText = text;
            navUsername.classList.remove('greeting-fade-out');
            navUsername.classList.add('greeting-fade-in');
        }, 500); // Wait for fade out to complete
    }

    initGreetings();
    setInterval(updateGreetingText, 3 * 60 * 1000); // Update every 3 minutes
    
    // Toast
    const toastEl = document.getElementById('appToast');
    let appToast = null;
    if (typeof bootstrap !== 'undefined') {
        appToast = new bootstrap.Toast(toastEl);
    }

    function showToast(message, isError = false) {
        document.getElementById('toast-message').innerText = message;
        document.getElementById('toast-title').innerText = isError ? 'Error' : 'Success';
        document.getElementById('toast-icon').className = isError ? 'bi bi-x-circle-fill text-danger me-2' : 'bi bi-check-circle-fill text-success me-2';
        appToast.show();
    }

    function hideSplashOrRedirect(isAuthenticated) {
        const elapsedTime = Date.now() - splashStartTime;
        const remainingDelay = Math.max(0, SPLASH_DELAY - elapsedTime);
        
        setTimeout(() => {
            if (!isAuthenticated) {
                window.location.href = 'auth.html';
            } else {
                splashScreen.style.opacity = '0';
                setTimeout(() => splashScreen.style.visibility = 'hidden', 500);
            }
        }, remainingDelay);
    }

    // Theme Management
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Defaulting to premium dark
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars"></i>';

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars"></i>';
    });

    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
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



    // --- VIEW MANAGEMENT ---
    let currentView = 'storefront';
    let previousView = 'storefront';

    function switchView(viewName) {
        if (viewName === currentView && viewName !== 'results') return;
        previousView = currentView;
        currentView = viewName;
        
        const storefrontSection = document.getElementById('storefront-section');
        const trendingSection = document.getElementById('trending-section');
        const resultsSection = document.getElementById('results-section');
        
        if (storefrontSection) storefrontSection.classList.add('d-none');
        if (trendingSection) trendingSection.classList.add('d-none');
        if (resultsSection) resultsSection.classList.add('d-none');
        
        if (viewName === 'storefront') {
            if (storefrontSection) storefrontSection.classList.remove('d-none');
            const homeLink = document.getElementById('nav-home-link');
            if (homeLink) homeLink.classList.add('fw-bold');
        } else if (viewName === 'results') {
            if (resultsSection) resultsSection.classList.remove('d-none');
            const homeLink = document.getElementById('nav-home-link');
            if (homeLink) homeLink.classList.remove('fw-bold');
        }
    }
    const navHomeLink = document.getElementById('nav-home-link');
    const btnBackFromResults = document.getElementById('btn-back-from-results');

    if (navHomeLink) {
        navHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('storefront');
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    }

    if (btnBackFromResults) {
        btnBackFromResults.addEventListener('click', () => {
            switchView(previousView === 'results' ? 'storefront' : previousView);
        });
    }

    // AUTH STATE LOGIC
    async function checkAuthStatus() {
        if (localStorage.getItem('access_token')) {
            try {
                const profile = await ApiService.getProfile();
                userMenu.classList.remove('d-none');
                navProfileItem.classList.remove('d-none');
                usernameCache = profile.username;
                updateGreetingText(); // Set initial greeting
                hideSplashOrRedirect(true);
            } catch (err) {
                // Token invalid or expired
                ApiService.logout();
                hideSplashOrRedirect(false);
            }
        } else {
            hideSplashOrRedirect(false);
        }
    }

    checkAuthStatus(); // Run on load

    // Modals and Login logic removed (handled in auth.html)

    // LOGOUT LOGIC
    btnLogout.addEventListener('click', async (e) => {
        e.preventDefault();
        await ApiService.logout();
        window.location.href = 'auth.html';
    });

    // Search Logic
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('btn-search');
    const imgUpload = document.getElementById('image-upload-input');
    const imgPreviewContainer = document.getElementById('image-preview-container');
    const imgPreview = document.getElementById('image-preview');
    const clearImgBtn = document.getElementById('btn-clear-image');
    const searchHistoryDropdown = document.getElementById('search-autocomplete-dropdown');
    const searchHistoryList = document.getElementById('recent-searches-list');
    const recentSearchesContainer = document.getElementById('recent-searches-container');
    const autocompleteDefaultState = document.getElementById('autocomplete-default-state');
    const autocompleteSuggestionsState = document.getElementById('autocomplete-suggestions-state');
    const autocompleteSuggestionsList = document.getElementById('autocomplete-suggestions-list');

    // Fetch and display search history in dropdown
    async function loadDropdownHistory() {
        if (!ApiService.isAuthenticated()) {
            recentSearchesContainer.classList.add('d-none');
            return;
        }
        try {
            const history = await ApiService.getSearchHistory();
            if (history.length === 0) {
                recentSearchesContainer.classList.add('d-none');
                return;
            }
            
            // Get up to 5 most recent text/hybrid searches
            const recent = history.filter(h => h.query_text).slice(0, 5);
            if (recent.length === 0) {
                recentSearchesContainer.classList.add('d-none');
                return;
            }
            
            recentSearchesContainer.classList.remove('d-none');

            searchHistoryList.innerHTML = recent.map(h => `
                <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center dropdown-history-item" style="cursor: pointer;" data-query="${h.query_text}">
                    <div class="d-flex align-items-center gap-2 text-truncate" style="max-width: 85%;">
                        <i class="bi bi-clock-history text-muted"></i>
                        <span class="text-truncate fw-medium">${h.query_text}</span>
                    </div>
                    <button class="btn btn-link text-muted p-0 text-decoration-none dropdown-delete-btn" data-id="${h.id}" title="Remove">
                        <i class="bi bi-x fs-5"></i>
                    </button>
                </div>
            `).join('');

            // Click to rerun
            document.querySelectorAll('.dropdown-history-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target.closest('.dropdown-delete-btn')) return;
                    searchInput.value = item.getAttribute('data-query');
                    searchHistoryDropdown.classList.add('d-none');
                    searchBtn.click();
                });
            });

            // Click to delete
            document.querySelectorAll('.dropdown-delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.getAttribute('data-id');
                    try {
                        await ApiService.deleteSearchHistory(id);
                        loadDropdownHistory(); // Reload dropdown
                    } catch (err) {
                        console.error('Failed to delete history item');
                    }
                });
            });
        } catch (e) {
            searchHistoryList.innerHTML = '<div class="p-3 text-danger small">Failed to load.</div>';
        }
    }

    // Enter key to search
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchHistoryDropdown.classList.add('d-none');
            searchBtn.click();
        }
    });

    // Autocomplete Logic
    let autocompleteTimeout = null;
    
    async function fetchAutocomplete(query) {
        if (!query) {
            autocompleteSuggestionsState.classList.add('d-none');
            autocompleteDefaultState.classList.remove('d-none');
            return;
        }
        
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/search/autocomplete/?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.length > 0) {
                autocompleteSuggestionsList.innerHTML = data.map(item => `
                    <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center autocomplete-item cursor-pointer" data-query="${item.name}">
                        <div class="d-flex align-items-center gap-2">
                            <i class="bi bi-search text-muted"></i>
                            <span>${item.name} <small class="text-muted ms-2">in ${item.category}</small></span>
                        </div>
                    </div>
                `).join('');
                
                document.querySelectorAll('.autocomplete-item').forEach(item => {
                    item.addEventListener('click', () => {
                        searchInput.value = item.getAttribute('data-query');
                        searchHistoryDropdown.classList.add('d-none');
                        searchBtn.click();
                    });
                });
            } else {
                autocompleteSuggestionsList.innerHTML = '<div class="p-3 text-muted text-center small">No suggestions found.</div>';
            }
            
            autocompleteDefaultState.classList.add('d-none');
            autocompleteSuggestionsState.classList.remove('d-none');
            
        } catch (err) {
            console.error('Autocomplete failed', err);
        }
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        searchHistoryDropdown.classList.remove('d-none');
        
        if (autocompleteTimeout) clearTimeout(autocompleteTimeout);
        
        autocompleteTimeout = setTimeout(() => {
            fetchAutocomplete(query);
        }, 300); // 300ms debounce
    });

    searchInput.addEventListener('focus', () => {
        searchHistoryDropdown.classList.remove('d-none');
        if (!searchInput.value.trim()) {
            autocompleteSuggestionsState.classList.add('d-none');
            autocompleteDefaultState.classList.remove('d-none');
            if (ApiService.isAuthenticated()) {
                loadDropdownHistory();
            }
        }
    });

    // Popular Searches Click
    document.querySelectorAll('.popular-search-badge').forEach(badge => {
        badge.addEventListener('click', (e) => {
            searchInput.value = e.target.innerText;
            searchHistoryDropdown.classList.add('d-none');
            searchBtn.click();
        });
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && searchHistoryDropdown && !searchHistoryDropdown.contains(e.target)) {
            searchHistoryDropdown.classList.add('d-none');
        }
    });
    
    let currentImageFile = null;

    imgUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            currentImageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                imgPreview.src = e.target.result;
                imgPreviewContainer.classList.remove('d-none');
            };
            reader.readAsDataURL(currentImageFile);
        }
    });

    clearImgBtn.addEventListener('click', () => {
        currentImageFile = null;
        imgUpload.value = '';
        imgPreviewContainer.classList.add('d-none');
    });

    // Voice Search Logic
    const voiceSearchBtn = document.getElementById('btn-voice-search');
    
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            voiceSearchBtn.classList.replace('text-muted', 'text-danger');
            searchInput.placeholder = "Listening...";
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            searchBtn.click(); // Automatically trigger search
        };

        recognition.onerror = function(event) {
            console.error("Speech recognition error", event.error);
            showToast("Microphone error: " + event.error, true);
        };

        recognition.onend = function() {
            voiceSearchBtn.classList.replace('text-danger', 'text-muted');
            searchInput.placeholder = "e.g., Minimalist beige office wear under ₹3000...";
        };

        voiceSearchBtn.addEventListener('click', () => {
            recognition.start();
        });
    } else {
        voiceSearchBtn.addEventListener('click', () => {
            showToast("Voice search is not supported in this browser.", true);
        });
    }

    // --- Advanced Filtering Logic ---
    let allSearchResults = [];
    let currentFilteredResults = [];
    
    const filterCategory = document.getElementById('filter-category');
    const filterGender = document.getElementById('filter-gender');
    const filterPriceMin = document.getElementById('filter-price-min');
    const filterPriceMax = document.getElementById('filter-price-max');
    const filterMaterial = document.getElementById('filter-material');
    const filterColor = document.getElementById('filter-color');
    const filterSale = document.getElementById('filter-sale');
    const filterTrending = document.getElementById('filter-trending');
    const btnApplyFilters = document.getElementById('btn-apply-filters');
    const btnClearFilters = document.getElementById('btn-clear-filters');

    function applyFilters() {
        const isSearching = allSearchResults && allSearchResults.length > 0;
        const targetArray = isSearching ? allSearchResults : [];
        
        if (!targetArray || targetArray.length === 0) return;

        const catVals = filterCategory.value ? filterCategory.value.toLowerCase().split('|') : [];
        const genderVals = filterGender.value ? filterGender.value.toLowerCase().split('|') : [];
        const minP = parseFloat(filterPriceMin.value) || 0;
        const maxP = parseFloat(filterPriceMax.value) || Infinity;
        const matVal = filterMaterial.value.toLowerCase();
        const colVal = filterColor.value.toLowerCase().trim();
        const isSale = filterSale.checked;

        currentFilteredResults = targetArray.filter(p => {
            const text = `${p.name} ${p.description} ${p.category ? p.category.name : ''} ${p.brand}`.toLowerCase();
            const price = parseFloat(p.price);

            if (price < minP || price > maxP) return false;
            if (catVals.length > 0 && !catVals.some(v => text.includes(v))) return false;
            if (genderVals.length > 0 && !genderVals.some(v => text.includes(v))) return false;
            if (matVal && !text.includes(matVal)) return false;
            if (colVal && !text.includes(colVal)) return false;
            if (isSale && price > 5000) return false;

            return true;
        });

        // Always show results in the masonry grid when filtering
        renderProducts(currentFilteredResults);
        document.getElementById('results-section').classList.remove('d-none');
        
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('filterOffcanvas'));
        if (offcanvas) offcanvas.hide();
        
        // Show empty state if needed
        const grid = document.getElementById('products-grid');
        if (currentFilteredResults.length === 0) {
            grid.innerHTML = '<div class="w-100 text-center py-5" style="grid-column: 1 / -1;"><h5 class="text-muted">No products match your selected filters.</h5><button class="btn btn-outline-primary mt-3" onclick="document.getElementById(\'btn-clear-filters\').click()">Clear Filters</button></div>';
        }
    }

    if (btnApplyFilters) btnApplyFilters.addEventListener('click', applyFilters);
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
            document.getElementById('advanced-filter-form').reset();
            const isSearching = allSearchResults && allSearchResults.length > 0;
            
            if (isSearching) {
                currentFilteredResults = [...allSearchResults];
                renderProducts(currentFilteredResults);
            } else {
                // If not searching, just reset to storefront view
                document.getElementById('results-section').classList.add('d-none');
                switchView('storefront');
            }
            
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('filterOffcanvas'));
            if (offcanvas) offcanvas.hide();
        });
    }

    // --- Search Execution Update ---
    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        let searchType = 'text';
        if (query && currentImageFile) searchType = 'hybrid';
        else if (!query && currentImageFile) searchType = 'image';
        
        if (!query && !currentImageFile) {
            showToast('Please enter a search term or upload an image.', true);
            return;
        }

        // Hide history dropdown
        searchHistoryDropdown.classList.add('d-none');

        // Show loading state
        const originalText = searchBtn.innerText;
        searchBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Searching...';
        searchBtn.disabled = true;

        try {
            allSearchResults = await ApiService.search(searchType, query, currentImageFile);
            currentFilteredResults = [...allSearchResults];
            renderProducts(currentFilteredResults);
            switchView('results');
        } catch (error) {
            showToast('Search failed. Please try again.', true);
        } finally {
            searchBtn.innerHTML = originalText;
            searchBtn.disabled = false;
        }
    });

    // --- Trending Logic Redesign ---
    let allTrendingProducts = [];
    const trendingGrid = document.getElementById('trending-grid');

    async function loadTrending() {
        try {
            await renderTrendingCategory('All');
        } catch (err) {
            console.error('Failed to load trending items:', err);
        }
    }

    async function renderTrendingCategory(category) {
        trendingGrid.innerHTML = '<div class="w-100 text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';
        
        try {
            let filtered = [];
            if (category === 'All' || category === 'Best Sellers') {
                filtered = await ApiService.getTrending();
            } else {
                const res = await ApiService.getProductsByCategory(category, 12);
                filtered = res.results || res;
            }

            trendingGrid.innerHTML = '';

            if (filtered.length === 0) {
                 trendingGrid.innerHTML = `<div class="w-100 text-center"><p class="text-muted">No items found for ${category}.</p></div>`;
                 return;
            }

        filtered.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'product-card glass-card';
            // Add staggered animation delay
            card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.05}s`;
            card.style.opacity = '0';
            
            const storeName = p.store ? p.store.name : 'AuraStyle';
            const externalUrl = p.external_url ? p.external_url : '#';
            
            card.innerHTML = `
                <div class="product-img-wrapper" style="height:300px;">
                    <img src="${p.image_url || 'https://via.placeholder.com/400x500?text=No+Image'}" alt="${p.name}" onload="this.classList.add('loaded')" class="product-image-click" data-image="${p.image_url || ''}">
                </div>
                <div class="product-info d-flex flex-column" style="height: calc(100% - 300px);">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <h6 class="fw-bold mb-0 text-truncate" style="max-width: 75%;" title="${p.name}">${p.name}</h6>
                        <span class="fs-6 fw-bold text-primary">₹${p.price}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <small class="text-muted">${p.brand || 'No Brand'} &bull; <strong>${storeName}</strong></small>
                    </div>
                    <div class="mt-auto d-flex gap-2">
                        <a href="${externalUrl}" target="_blank" class="btn btn-outline-primary flex-grow-1 rounded-pill btn-sm fw-bold">Buy Now</a>
                        <button class="btn btn-light border rounded-circle text-danger btn-add-fav" data-id="${p.id}" title="Add to Wishlist">
                            <i class="bi bi-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            trendingGrid.appendChild(card);
        });

        // Re-attach favorite listeners for the newly added buttons
        attachFavoriteListeners(trendingGrid);
        } catch (err) {
            console.error(err);
            trendingGrid.innerHTML = `<div class="w-100 text-center"><p class="text-muted">Failed to load items.</p></div>`;
        }
    }
    // Trending Tabs Event Listener
    document.querySelectorAll('.trending-category-tabs .nav-link').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.trending-category-tabs .nav-link').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.getAttribute('data-category');
            renderTrendingCategory(category);
        });
    });

    function attachFavoriteListeners(container) {
        container.querySelectorAll('.btn-add-fav').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const btnEl = e.target.closest('button');
                const id = btnEl.getAttribute('data-id');
                const icon = btnEl.querySelector('i');
                
                try {
                    await ApiService.addFavorite(id);
                    icon.classList.replace('bi-heart', 'bi-heart-fill');
                    showToast('Added to Wishlist!');
                } catch (err) {
                    showToast('Failed to add to Wishlist. Please log in.', true);
                }
            });
        });
    }

    function renderProducts(products) {
        const grid = document.getElementById('products-grid');
        grid.innerHTML = '';
        document.getElementById('results-count').innerText = `(${products.length})`;

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card glass-card';
            const storeName = p.store ? p.store.name : 'AuraStyle';
            const externalUrl = p.external_url ? p.external_url : '#';
            
            card.innerHTML = `
                ${p.similarity_score ? `<div class="similarity-badge">${p.similarity_score}% Match</div>` : ''}
                <div class="product-img-wrapper" style="height: 350px;">
                    <img src="${p.image_url || 'https://via.placeholder.com/400x500?text=No+Image'}" alt="${p.name}" onload="this.classList.add('loaded')" class="product-image-click" data-image="${p.image_url || ''}">
                </div>
                <div class="product-info">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                        <h5 class="fw-bold mb-0 text-truncate" style="max-width: 75%;" title="${p.name}">${p.name}</h5>
                        <span class="fs-6 fw-bold text-primary">₹${p.price}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <p class="text-muted small mb-0">${p.brand || 'No Brand'} &bull; <strong>${storeName}</strong></p>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="${externalUrl}" target="_blank" class="btn btn-outline-primary flex-grow-1 rounded-pill fw-bold">Buy Now</a>
                        <button class="btn btn-light border rounded-circle text-danger btn-add-fav" data-id="${p.id}" title="Add to Wishlist">
                            <i class="bi bi-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        attachFavoriteListeners(grid);
    }
    
    // --- Storefront Logic ---
    const STOREFRONT_CATEGORIES = ['Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Beauty & Personal Care'];
    const storefrontSection = document.getElementById('storefront-section');

    async function loadStorefront() {
        if (!storefrontSection) return;
        storefrontSection.innerHTML = '<h3 class="mb-4 fw-bold">Discover Collections</h3>';
        
        for (const category of STOREFRONT_CATEGORIES) {
            const catId = `storefront-cat-${category.replace(/[^a-zA-Z0-9]/g, '-')}`;
            const rowContainer = document.createElement('div');
            rowContainer.className = 'mb-5 position-relative';
            rowContainer.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="fw-bold mb-0">${category}</h4>
                    <div class="d-flex gap-2 d-none d-md-flex">
                        <button class="btn btn-outline-secondary rounded-circle btn-sm scroll-btn-left" data-target="${catId}"><i class="bi bi-chevron-left"></i></button>
                        <button class="btn btn-outline-secondary rounded-circle btn-sm scroll-btn-right" data-target="${catId}"><i class="bi bi-chevron-right"></i></button>
                    </div>
                </div>
                <div class="trending-horizontal-scroll scroll-smooth" id="${catId}">
                    <div class="product-card placeholder-glow"><div class="placeholder" style="height:350px; width:100%;"></div></div>
                    <div class="product-card placeholder-glow"><div class="placeholder" style="height:350px; width:100%;"></div></div>
                    <div class="product-card placeholder-glow"><div class="placeholder" style="height:350px; width:100%;"></div></div>
                </div>
            `;
            storefrontSection.appendChild(rowContainer);
            
            // Attach Scroll Listeners
            const leftBtn = rowContainer.querySelector('.scroll-btn-left');
            const rightBtn = rowContainer.querySelector('.scroll-btn-right');
            const scrollTarget = document.getElementById(catId);
            
            if (leftBtn && rightBtn && scrollTarget) {
                leftBtn.addEventListener('click', () => {
                    scrollTarget.scrollBy({ left: -400, behavior: 'smooth' });
                });
                rightBtn.addEventListener('click', () => {
                    scrollTarget.scrollBy({ left: 400, behavior: 'smooth' });
                });
            }
            
            try {
                const productsData = await ApiService.getProductsByCategory(category, 12);
                const products = productsData.results || productsData;
                const rowGrid = document.getElementById(`storefront-cat-${category.replace(/[^a-zA-Z0-9]/g, '-')}`);
                rowGrid.innerHTML = ''; 
                
                if (products && products.length > 0) {
                    products.forEach(p => {
                        const imageUrl = p.image_url || 'https://via.placeholder.com/400x500?text=No+Image';
                        const storeName = p.store ? p.store.name : 'AuraStyle';
                        const externalUrl = p.external_url || '#';
                        const card = document.createElement('div');
                        card.className = 'product-card glass-panel d-flex flex-column animate-fade-up';
                        card.innerHTML = `
                            <div class="position-relative">
                                <img src="${imageUrl}" class="product-image product-image-click" alt="${p.name}" data-image="${imageUrl}" style="cursor: zoom-in;" onerror="this.src='https://via.placeholder.com/400x500?text=Image+Not+Found'">
                                <span class="badge bg-danger position-absolute top-0 start-0 m-3 shadow-sm rounded-pill px-3 py-2">
                                    <i class="bi bi-tag-fill me-1"></i> ₹${p.price}
                                </span>
                            </div>
                            <div class="p-4 d-flex flex-column flex-grow-1">
                                <div class="flex-grow-1">
                                    <h5 class="fw-bold mb-2 text-truncate" title="${p.name}">${p.name}</h5>
                                    <p class="text-muted small mb-0">${p.brand || 'No Brand'} &bull; <strong>${storeName}</strong></p>
                                </div>
                                <div class="d-flex gap-2 mt-3">
                                    <a href="${externalUrl}" target="_blank" class="btn btn-outline-primary flex-grow-1 rounded-pill fw-bold">Buy Now</a>
                                    <button class="btn btn-light border rounded-circle text-danger btn-add-fav" data-id="${p.id}" title="Add to Wishlist">
                                        <i class="bi bi-heart"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                        rowGrid.appendChild(card);
                    });
                    attachFavoriteListeners(rowGrid);
                } else {
                    rowGrid.innerHTML = '<p class="text-muted small">No items found.</p>';
                }
            } catch (e) {
                console.error('Failed to load category', category, e);
                const rowGrid = document.getElementById(`storefront-cat-${category.replace(/[^a-zA-Z0-9]/g, '-')}`);
                if (rowGrid) rowGrid.innerHTML = '<p class="text-danger small">Failed to load items. Please try again.</p>';
            }
        }
    }

    // Load categories on page load
    loadStorefront();
    switchView('storefront');

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

    // Auto-run search if ?q= is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    if (qParam) {
        searchInput.value = qParam;
        // Slight delay to ensure auth state is ready
        setTimeout(() => searchBtn.click(), 800);
    }
});
