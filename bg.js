const fs = require('fs');
const path = require('path');

function updateIndex() {
    const file = path.join(__dirname, 'index.html');
    let html = fs.readFileSync(file, 'utf8');

    // 1. Hero
    html = html.replace(/<section class="section bg-offwhite hero">/, '<section class="section bg-accent hero">');
    // 6. Pricing (was pricing-section-skysmart)
    html = html.replace(/<section id="pricing" class="section pricing-section-skysmart">/, '<section id="pricing" class="section bg-white">');

    // We expect sections with bg-white or bg-offwhite. Let's make sure order matches:
    // How it works: bg-white
    // Upcoming classes: bg-offwhite
    // Subjects: bg-white
    // Tutors preview: bg-offwhite
    // Pricing: bg-white
    // FAQ: bg-offwhite

    // In current index.html, we have:
    // Section 2: <section class="section bg-white"> (How it works)
    // Section 3: <section class="section bg-offwhite"> (Upcoming classes)
    // Section 4: <section class="section bg-white"> (Subjects)
    // Section 5: <section class="section bg-offwhite"> (Tutors preview)
    // Section 8: <section class="section bg-offwhite"> (FAQ)
    // Wait, let's verify if section 8 is bg-offwhite. "FAQ" -> Yes.
    // So the existing classes are already matching the F5F0FF and FFFFFF sequence perfectly EXCEPT pricing needed bg-white and hero needed bg-accent!

    fs.writeFileSync(file, html, 'utf8');
}

function alternateSections(file) {
    let html = fs.readFileSync(file, 'utf8');

    // In secondary pages (classes, tutors, subjects), we usually have:
    // 1. Hero: <section class="section bg-offwhite" ...>
    // 2. Content: <section class="section bg-white">
    // Some might have more. Let's enforce alternating bg.
    // Instead of regex hacking, let's just make hero bg-accent, content bg-offwhite.
    // Wait, if we make hero F5F0FF, content FFFFFF, that alternates and has no two F5F0FF together.

    let isOffwhite = true; // First section F5F0FF

    html = html.replace(/<section\s+(?:id="[^"]*"\s+)?class="section[^>]*>/g, (match) => {
        // Strip out existing bg colors
        let newMatch = match.replace(/\s*bg-(white|offwhite|gray|primary|secondary|accent|navy)\s*/, ' ');
        // Inject new
        let bgClass = isOffwhite ? "bg-offwhite" : "bg-white";

        // Some sections have their own colors like .quiz-section or .final-cta, 
        // but those are mostly index.html or quiz.html.
        // If it's the hero, usually the first match

        // add bgClass
        newMatch = newMatch.replace(/class="/, `class="${bgClass} `);
        // clean up spaces
        newMatch = newMatch.replace(/\s+/, ' ').replace(/ "\s*>/, '">');

        isOffwhite = !isOffwhite;
        return newMatch;
    });

    fs.writeFileSync(file, html, 'utf8');
}

updateIndex();

['classes.html', 'tutors.html', 'subjects.html'].forEach(f => {
    alternateSections(path.join(__dirname, f));
});

console.log("Updated HTML backgrounds");
