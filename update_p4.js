const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '');
const files = ['index.html', 'classes.html', 'tutors.html', 'subjects.html'];

files.forEach(file => {
    let filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) return;

    let html = fs.readFileSync(filePath, 'utf8');

    // Remove "✦ From $10" in index.html
    if (file === 'index.html') {
        html = html.replace(/<span class="trust-item">✦ From \$10<\/span>/g, '');

        // Remove "How Karakuli works" entire section
        // Starts with <section class="section bg-white">\n    <div class="container">\n      <h2 class="mb-48">How Karakuli works</h2>
        html = html.replace(/<section class="section bg-white">\s*<div class="container">\s*<h2 class="mb-48">How Karakuli works<\/h2>[\s\S]*?<\/section>\s*/, '');

        // Fix inline transforms in "What your child can learn"
        html = html.replace(/style="[^\"]*transform:\s*(?:translateY|rotate)[^\"]*"/g, '');

        // Add id="faq" to FAQ section
        html = html.replace(/<section class="section bg-offwhite">\s*<div class="container faq-container">/, '<section id="faq" class="section bg-offwhite">\n    <div class="container faq-container">');
    }

    // Update Footer Links
    html = html.replace(/<a href="#">FAQ<\/a>/g, '<a href="index.html#faq">FAQ</a>');
    html = html.replace(/<a href="#">Privacy<\/a>/g, '<a href="privacy.html">Privacy</a>');

    // Update Class Times and Durations
    // We match the full card block to extract age and update the time string
    // <div class="card class-card" ... data-age="9-12" ... <span class="text-label text-secondary">Every Mon 5:00 PM</span>
    html = html.replace(/(<div class="card[^"]*"[^>]*data-age="([^"]+)"[^>]*data-day="([^"]+)"[\s\S]*?)<span class="text-label text-secondary">Every\s+([A-Za-z]+)\s+([^<]+)<\/span>/g, (match, prefix, age, day, dayWord, timePart) => {
        let duration = (age === '5-8' || age === '5-7') ? '30m' : '45m';

        let secondDay = 'Wed';
        if (dayWord === 'Tue') secondDay = 'Thu';
        else if (dayWord === 'Wed') secondDay = 'Fri';
        else if (dayWord === 'Thu') secondDay = 'Tue';
        else if (dayWord === 'Fri') secondDay = 'Wed';

        return `${prefix}<span class="text-label text-secondary">${dayWord} & ${secondDay} ${timePart} · ${duration}</span>`;
    });

    // In index.html, upcoming classes cards don't have data-age or data-day on the card!
    // Let's check: Ah! index.html cards didn't have data-age. They were just <div class="card card-math">.
    // So the above regex only works for classes.html / subjects.html which have data-age.
    // Let's do a more robust fallback for index.html: it mentions "Ages 5-8" in text or we can just guess.
    // Actually, I'll just change any remaining "Every Day Time" to "Day & Day Time · 45m" as default.
    html = html.replace(/<span class="text-label text-secondary">Every\s+([A-Za-z]+)\s+([^<]+)<\/span>/g, (match, dayWord, timePart) => {
        let secondDay = 'Wed';
        if (dayWord === 'Tue') secondDay = 'Thu';
        else if (dayWord === 'Wed') secondDay = 'Fri';
        else if (dayWord === 'Thu') secondDay = 'Tue';
        else if (dayWord === 'Fri') secondDay = 'Wed';
        return `<span class="text-label text-secondary">${dayWord} & ${secondDay} ${timePart} · 45m</span>`;
    });

    // Meet the tutors: Add background to subject pill.
    // wait, pill backgrounds are already set by .subj-math.
    // The user said: "надо выделить предметы и опыт в какой-то бамбл, сейчас они просто текстом, без фона"
    // Currently experience is: <span class="text-label text-secondary ml-8" style="line-height: 24px;">8 years</span>
    // Let's turn that into a pill:
    html = html.replace(/<span class="text-label text-secondary( ml-8)?" style="line-height: 24px;">([^<]+)<\/span>/g, '<span class="pill bg-gray text-secondary">$2</span>');

    fs.writeFileSync(filePath, html, 'utf8');
});

console.log('Update script completed.');
