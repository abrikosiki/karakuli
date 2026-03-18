const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '');
const files = ['index.html', 'classes.html', 'tutors.html', 'subjects.html', 'quiz.html', 'welcome.html'];

files.forEach(file => {
    let filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Change email in footer
    html = html.replace(/hello@karakuli\.com/g, 'karakuli.art@gmail.com');

    // If it's index.html, do specific replacing
    if (file === 'index.html') {
        // Hero background
        html = html.replace(/<section class="section bg-accent hero">/g, '<section class="section bg-offwhite hero">');

        // Remove Final CTA section completely
        html = html.replace(/<!-- SECTION 9: FINAL CTA -->[\s\S]*?<!-- SHARED FOOTER -->/, '<!-- SHARED FOOTER -->');

        // Note: The structure is:
        // <!-- SECTION 9: FINAL CTA -->
        // <section class="final-cta"> ... </section>
        // <!-- SHARED FOOTER -->
    }

    // Pricing button update (Pricing exists in index, classes, tutors, subjects)
    // Replace "Start with a trial first" with "Buy 600 credits"
    // Also change button style if we want? The Russian is "сделать так, что оформить покупку на эти кредиты"
    // Let's use "Buy 600 credits" and btn-primary
    html = html.replace(/<a href="#stripe-link" class="btn btn-secondary btn-full">Start with a trial first<\/a>/g, '<a href="#stripe-link" class="btn btn-primary btn-full">Buy 600 credits</a>');

    fs.writeFileSync(filePath, html, 'utf8');
});

console.log('HTML files successfully updated.');
