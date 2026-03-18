const fs = require('fs');
const path = require('path');

function updateClassesHtml() {
    const file = path.join(__dirname, 'classes.html');
    let html = fs.readFileSync(file, 'utf8');

    // Make Logo Link point to index
    html = html.replace(/href="\/" class="brand-logo"/g, 'href="index.html" class="brand-logo"');

    // Update the class cards
    html = html.replace(/<div class="card class-card" data-subject="([^"]+)"/g, (match, subject) => {
        return `<div class="card class-card card-${subject.toLowerCase()}" data-subject="${subject}"`;
    });

    // Add card-illustration after the paragraph
    html = html.replace(/(<p class="text-small text-secondary mb-24"[\s\S]*?<\/p>)/g, `$1\n                    <div class="card-illustration mb-24">\n                        <div class="blob-inner blob-inner-1"></div><div class="blob-inner blob-inner-2"></div>\n                    </div>`);

    // Remove border-top from the footer and push to bottom
    html = html.replace(/border-top: 1px solid var\(--border\); padding-top: 16px;/g, 'padding-top: 16px; margin-top: auto;');

    fs.writeFileSync(file, html, 'utf8');
}

function updateTutorsHtml() {
    const file = path.join(__dirname, 'tutors.html');
    let html = fs.readFileSync(file, 'utf8');

    // Make Logo Link point to index
    html = html.replace(/href="\/" class="brand-logo"/g, 'href="index.html" class="brand-logo"');

    // Tutor cards:
    // We need to figure out their primary subject.
    // The structure is: <div class="card tutor-card-large"> ... <span class="pill subj-math">Math</span>
    // I can do a regex to extract the first pill subject.
    let count = 0;
    html = html.replace(/<div class="card tutor-card-large">([\s\S]*?)<\/div>\s*<!-- Tutor/g, (match, inner) => {
        let subjectMatch = inner.match(/<span class="pill subj-([^"]+)">/);
        let subject = subjectMatch ? subjectMatch[1] : 'math';

        let newInner = inner.replace(/<img src="([^"]+)" alt="([^"]+)" class="tutor-img-large">/g,
            '<div class="tutor-avatar-wrapper" style="width: 96px; height: 96px;"><img src="$1" alt="$2" class="tutor-img-large"></div>'
        );
        count++;
        return `<div class="card tutor-card-large card-${subject}">${newInner}</div>\n        <!-- Tutor`;
    });

    // For the very last one, since it doesn't have <!-- Tutor after it, we replace it using a different trick or just a global replace if we do it cleanly.
    // Let's just do it directly.
    let cards = html.split('<div class="card tutor-card-large">');
    if (cards.length > 1) {
        let newHtml = cards[0];
        for (let i = 1; i < cards.length; i++) {
            let chunk = cards[i];
            let subjectMatch = chunk.match(/<span class="pill subj-([^"]+)">/);
            let subject = subjectMatch ? subjectMatch[1] : 'math';

            chunk = chunk.replace(/<img src="([^"]+)" alt="([^"]+)" class="tutor-img-large">/g,
                '<div class="tutor-avatar-wrapper" style="width: 96px; height: 96px;"><img src="$1" alt="$2" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"></div>'
            );
            newHtml += `<div class="card tutor-card-large card-${subject}">` + chunk;
        }
        html = newHtml;
    }

    fs.writeFileSync(file, html, 'utf8');
}

function updateSubjectsHtml() {
    const file = path.join(__dirname, 'subjects.html');
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/href="\/" class="brand-logo"/g, 'href="index.html" class="brand-logo"');

    // In subjects, there are class preview cards at the bottom of each section
    html = html.replace(/<div class="card class-card">([\s\S]*?)<span class="pill subj-([^"]+)">/g,
        '<div class="card class-card card-$2">$1<span class="pill subj-$2">'
    );

    html = html.replace(/(<p class="text-small text-secondary mb-24"[\s\S]*?<\/p>)/g, `$1\n                                <div class="card-illustration mb-24">\n                                    <div class="blob-inner blob-inner-1"></div><div class="blob-inner blob-inner-2"></div>\n                                </div>`);
    html = html.replace(/border-top: 1px solid var\(--border\); padding-top: 16px;/g, 'padding-top: 16px; margin-top: auto;');

    fs.writeFileSync(file, html, 'utf8');
}

updateClassesHtml();
updateTutorsHtml();
updateSubjectsHtml();
console.log("Updated HTML files");
