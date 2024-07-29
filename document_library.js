document.addEventListener('DOMContentLoaded', function() {
    const documentLibrary = {
        "Onboarding Guides": {
            "Guide 1": "guide1.pdf",
            "Guide 2": "guide2.pdf"
        },
        "Technical Manuals": {
            "Manual 1": "manual1.pdf",
            "Manual 2": "manual2.pdf"
        }
    };

    const libraryContainer = document.getElementById('documentLibrary');
    buildLibraryTree(documentLibrary, libraryContainer);
});

function buildLibraryTree(library, parentElement) {
    const ul = document.createElement('ul');
    for (const key in library) {
        const li = document.createElement('li');
        if (typeof library[key] === 'string') {
            const a = document.createElement('a');
            a.href = library[key];
            a.textContent = key;
            a.target = '_blank';
            li.appendChild(a);
        } else {
            const span = document.createElement('span');
            span.textContent = key;
            span.className = 'folder';
            span.addEventListener('click', () => {
                const subUl = li.querySelector('ul');
                if (subUl) {
                    subUl.style.display = subUl.style.display === 'none' ? 'block' : 'none';
                }
            });
            li.appendChild(span);
            buildLibraryTree(library[key], li);
        }
        ul.appendChild(li);
    }
    parentElement.appendChild(ul);
}
