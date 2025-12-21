/* WineCalc - Search Manager */

import { StateManager } from './app-state.js';

/**
 * Search functionality for filtering calculators
 */
export const SearchManager = {
    /**
     * Initialize search functionality
     */
    initialize() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) {
            console.warn('Search input not found');
            return;
        }

        // Debounced search function
        const debouncedSearch = window.WineCalcUtils.debounce((query) => {
            this.filterCalculators(query);
        }, 300);

        // Listen for input changes
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            StateManager.updateState('searchQuery', query);
            debouncedSearch(query);
        });

        console.log('Search manager initialized');
    },

    /**
     * Filter calculator cards based on search query
     */
    filterCalculators(query) {
        const cards = document.querySelectorAll('.calculator-card');
        const noResults = document.getElementById('noResults');
        let visibleCount = 0;

        cards.forEach(card => {
            const isVisible = this.matchesQuery(card, query);

            if (isVisible) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide "no results" message
        this.toggleNoResults(noResults, visibleCount, query);

        // Hide/show category sections
        this.toggleCategorySections();

        console.log(`Search: "${query}" - ${visibleCount} results`);
    },

    /**
     * Check if card matches search query
     */
    matchesQuery(card, query) {
        if (!query || query === '') return true;

        const searchableFields = [
            card.dataset.name,
            card.querySelector('.card-title')?.textContent,
            card.querySelector('.card-text')?.textContent,
            card.dataset.category,
            card.dataset.keywords
        ];

        const searchText = searchableFields
            .filter(field => field)
            .join(' ')
            .toLowerCase();

        const terms = query.split(' ').filter(t => t.length > 0);
        return terms.every(term => searchText.includes(term));
    },

    /**
     * Toggle "no results" message visibility
     */
    toggleNoResults(element, visibleCount, query) {
        if (!element) return;

        if (visibleCount === 0 && query !== '') {
            element.classList.remove('d-none');
        } else {
            element.classList.add('d-none');
        }
    },

    /**
     * Hide/show category sections based on visible cards
     */
    toggleCategorySections() {
        document.querySelectorAll('section').forEach(section => {
            const visibleCards = section.querySelectorAll(
                '.calculator-card:not([style*="display: none"])'
            );

            if (visibleCards.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = '';
            }
        });
    },

    /**
     * Clear search
     */
    clear() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            this.filterCalculators('');
            StateManager.updateState('searchQuery', '');
        }
    }
};
