/**
 * Classes Page filter logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterGroups = {
        subject: 'all',
        age: 'all',
        day: 'all'
    };

    const subjectBtns = document.querySelectorAll('#filter-subject .filter-btn');
    const ageBtns = document.querySelectorAll('#filter-age .filter-btn');
    const dayBtns = document.querySelectorAll('#filter-day .filter-btn');

    const cards = document.querySelectorAll('.class-card');
    const noResults = document.getElementById('no-results');

    function updateFilters() {
        let visibleCount = 0;

        cards.forEach(card => {
            const matchSubject = filterGroups.subject === 'all' || card.getAttribute('data-subject') === filterGroups.subject;
            const matchAge = filterGroups.age === 'all' || card.getAttribute('data-age') === filterGroups.age;
            const matchDay = filterGroups.day === 'all' || card.getAttribute('data-day') === filterGroups.day;

            if (matchSubject && matchAge && matchDay) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        if (visibleCount === 0) {
            noResults.classList.add('active');
        } else {
            noResults.classList.remove('active');
        }
    }

    function bindGroup(buttons, key) {
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from siblings
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                filterGroups[key] = btn.getAttribute('data-val');
                updateFilters();
            });
        });
    }

    bindGroup(subjectBtns, 'subject');
    bindGroup(ageBtns, 'age');
    bindGroup(dayBtns, 'day');

    // Make resetFilters available globally
    window.resetFilters = function (e) {
        if (e) e.preventDefault();

        [subjectBtns, ageBtns, dayBtns].forEach(group => {
            group.forEach(btn => {
                if (btn.getAttribute('data-val') === 'all') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });

        filterGroups.subject = 'all';
        filterGroups.age = 'all';
        filterGroups.day = 'all';
        updateFilters();
    };
});
