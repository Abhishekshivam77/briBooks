let coverImageUrl = '';
let backCoverImageUrl = '';
let pages = [];

// Cloudinary setup
const cloudinaryUrl = 'cloudinary://771571764972439:2rC6OEPe08BMDCA1XnqlQj47x6Q@davn0t4sj';
const uploadPreset = 'ydavn0t4sj';

// Image upload event listeners
document.getElementById('cover-image-upload').addEventListener('change', () => {
    uploadImage('cover-image-upload', (url) => {
        coverImageUrl = url;
        updateCoverPreview();
    });
});

document.getElementById('back-cover-image-upload').addEventListener('change', () => {
    uploadImage('back-cover-image-upload', (url) => {
        backCoverImageUrl = url;
        updateBackCoverPreview();
    });
});

document.getElementById('page-image-upload').addEventListener('change', () => {
    uploadImage('page-image-upload', (url) => {
        pages.push({
            backgroundImage: url,
            title: '',
            content: ''
        });
        renderPagesPreview();
        saveProgress();
    });
});

// Update cover preview
function updateCoverPreview() {
    const coverPreview = document.getElementById('cover-preview');
    coverPreview.style.backgroundImage = `url(${coverImageUrl})`;
    document.getElementById('cover-book-title-preview').innerText = document.getElementById('cover-book-title').value;
    document.getElementById('cover-author-name-preview').innerText = document.getElementById('cover-author-name').value;
}

// Update back cover preview
function updateBackCoverPreview() {
    const backCoverPreview = document.getElementById('back-cover-preview');
    backCoverPreview.style.backgroundImage = `url(${backCoverImageUrl})`;
    document.getElementById('back-cover-heading-preview').innerText = document.getElementById('back-cover-heading').value;
    document.getElementById('back-cover-details-preview').innerText = document.getElementById('back-cover-details').value;
}

// Add page function
function addPage() {
    const pageTitle = document.getElementById('page-title').value;
    const pageContent = document.getElementById('page-content').value;
    if (pages.length > 0 && (pageTitle || pageContent)) {
        pages[pages.length - 1].title = pageTitle;
        pages[pages.length - 1].content = pageContent;
        document.getElementById('page-title').value = '';
        document.getElementById('page-content').value = '';
        renderPagesPreview();
        saveProgress();
    }
}

// Save progress function
function saveProgress() {
    localStorage.setItem('bookData', JSON.stringify({
        coverImageUrl,
        backCoverImageUrl,
        pages
    }));
}

// Load progress function
function loadProgress() {
    const savedData = JSON.parse(localStorage.getItem('bookData'));
    if (savedData) {
        coverImageUrl = savedData.coverImageUrl;
        backCoverImageUrl = savedData.backCoverImageUrl;
        pages = savedData.pages || [];
        updateCoverPreview();
        updateBackCoverPreview();
        renderPagesPreview();
    }
}

// Clear all fields function
function clearAllFields() {
    document.getElementById('cover-book-title').value = '';
    document.getElementById('cover-author-name').value = '';
    document.getElementById('back-cover-heading').value = '';
    document.getElementById('back-cover-details').value = '';
    document.getElementById('page-title').value = '';
    document.getElementById('page-content').value = '';
    coverImageUrl = '';
    backCoverImageUrl = '';
    pages = [];
    updateCoverPreview();
    updateBackCoverPreview();
    renderPagesPreview();
    localStorage.removeItem('bookData');
}

// Generate PDF function
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cover page
    if (coverImageUrl) {
        doc.addImage(coverImageUrl, 'JPEG', 0, 0, 210, 297);
        doc.setFontSize(30);
        doc.setTextColor(255, 255, 255);
        doc.text(document.getElementById('cover-book-title').value, 105, 50, null, null, 'center');
        doc.setFontSize(20);
        doc.text(document.getElementById('cover-author-name').value, 105, 260, null, null, 'center');
        doc.addPage();
    }

    // Content pages
    pages.forEach(page => {
        if (page.backgroundImage) {
            doc.addImage(page.backgroundImage, 'JPEG', 0, 0, 210, 297);
        }
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text(page.title, 10, 20);
        doc.setFontSize(16);
        doc.text(page.content, 10, 40);
        doc.addPage();
    });

    // Back cover page
    if (backCoverImageUrl) {
        doc.addImage(backCoverImageUrl, 'JPEG', 0, 0, 210, 297);
        doc.setFontSize(30);
        doc.setTextColor(255, 255, 255);
        doc.text(document.getElementById('back-cover-heading').value, 105, 50, null, null, 'center');
        doc.setFontSize(16);
        doc.text(document.getElementById('back-cover-details').value, 105, 260, null, null, 'center');
    }

    doc.save('book.pdf');
    clearAllFields();
}

// Render pages preview function
function renderPagesPreview() {
    const pagesPreview = document.getElementById('pages-preview');
    pagesPreview.innerHTML = '';
    pages.forEach(page => {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'book-page';
        pageDiv.style.backgroundImage = `url(${page.backgroundImage})`;
        pageDiv.innerHTML = `
            <h2>${page.title}</h2>
            <p>${page.content}</p>
        `;
        pagesPreview.appendChild(pageDiv);
    });
}

// Event listener for real-time updates as user types
document.getElementById('cover-book-title').addEventListener('input', updateCoverPreview);
document.getElementById('cover-author-name').addEventListener('input', updateCoverPreview);
document.getElementById('back-cover-heading').addEventListener('input', updateBackCoverPreview);
document.getElementById('back-cover-details').addEventListener('input', updateBackCoverPreview);
document.getElementById('page-title').addEventListener('input', renderPagesPreview);
document.getElementById('page-content').addEventListener('input', renderPagesPreview);

// Call loadProgress when the app initializes
window.onload = loadProgress;
