document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    const clearButton = document.querySelector('.clear-button');
    const searchResults = document.querySelector('.search-results');
    
    // Clear search input
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        searchResults.classList.remove('show');
        searchInput.focus();
    });
    
    // Show/hide clear button
    searchInput.addEventListener('input', function() {
        clearButton.style.display = this.value ? 'block' : 'none';
    });
    
    // Search functionality (example)
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter' || this.value.length > 2) {
            // Here you would typically make an AJAX call
            // For demo, we'll just show some dummy results
            if (this.value) {
                searchResults.innerHTML = `
                    <div class="search-result-item">Hostel A - Room 101</div>
                    <div class="search-result-item">Hostel B - Room 205</div>
                    <div class="search-result-item">User: John Doe</div>
                `;
                searchResults.classList.add('show');
            } else {
                searchResults.classList.remove('show');
            }
        }
    });
    
    // Close results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('show');
        }
    });
});