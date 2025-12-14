$(document).ready(function() {
  // Search functionality
  const $searchInput = $('.search-bar input');
  const $clearButton = $('.clear-button');
  const $searchResults = $('.search-results');
  const $searchButton = $('.search-button');

  // Toggle clear button
  function toggleClearButton() {
      $clearButton.toggle($searchInput.val().length > 0);
  }

  // Clear search
  $clearButton.on('click', function() {
      $searchInput.val('').focus();
      $searchResults.removeClass('show');
      toggleClearButton();
  });

  // Input handling
  $searchInput.on('input', function() {
      toggleClearButton();
      if ($(this).val().trim().length === 0) {
          $searchResults.removeClass('show');
      }
  });

  // Perform search
  function performSearch(query) {
      if (query.length > 0) {
          // Simulated search results - replace with real API call
          const results = [
              "Hostel A - Room 101",
              "Hostel B - Room 205",
              "User: John Doe"
          ];
          
          $searchResults.html(
              results.map(result => `<div class="search-result-item">${result}</div>`).join('')
          ).addClass('show');
      } else {
          $searchResults.removeClass('show');
      }
  }

  // Search triggers
  $searchButton.on('click', () => performSearch($searchInput.val().trim()));
  $searchInput.on('keyup', function(e) {
      if (e.key === 'Enter' || $(this).val().length > 2) {
          performSearch($(this).val().trim());
      }
  });

  // Click outside handler
  $(document).on('click', function(e) {
      if (!$(e.target).closest('.search-container').length) {
          $searchResults.removeClass('show');
      }
  });

  // Keep other existing code (smooth scroll, auth, etc.)
  // ...
});