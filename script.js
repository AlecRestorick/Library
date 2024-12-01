








const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreInput = document.getElementById('genre');
const pagesInput = document.getElementById('pages');
const publicationYearInput = document.getElementById('year');
const bookList = document.getElementById('bookList');

let myLibrary = JSON.parse(localStorage.getItem('libraryBooks')) || [];

function Book(title, author, genre, pages, year, readYesNo) {
    this.id = Date.now().toString();
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.pages = pages;
    this.year = year;
    this.readYesNo = readYesNo;
}

function saveToLocalStorage() {
    localStorage.setItem('libraryBooks', JSON.stringify(myLibrary));
}

function renderBook(book) {

    const bookCard = document.createElement('li');
    bookCard.classList.add('book-card');
    bookCard.dataset.bookId = book.id;

    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('book-details');

    const titleElement = document.createElement('h3');
    titleElement.textContent = book.title;

    const authorElement = document.createElement('p');
    authorElement.textContent = `Author: ${book.author}`;

    const genreElement = document.createElement('p');
    genreElement.textContent = `Genre: ${book.genre}`;

    const pagesElement = document.createElement('p');
    pagesElement.textContent = `Pages: ${book.pages}`;

    const yearElement = document.createElement('p');
    yearElement.textContent = `Published: ${book.year}`;

    const readStatusElement = document.createElement('p');
    readStatusElement.textContent = `Read: ${book.readYesNo}`;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('book-card-buttons');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-book');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-book');

    const toggleReadButton = document.createElement('button');
    toggleReadButton.textContent = 'Toggle Read Status';
    toggleReadButton.classList.add('toggle-read');

    editButton.addEventListener('click', () => {
        convertCardToEditForm(bookCard, book);
    });

    deleteButton.addEventListener('click', () => {
        myLibrary = myLibrary.filter(b => b.id !== book.id);
        saveToLocalStorage();
        bookCard.remove();
    });

    toggleReadButton.addEventListener('click', () => {
        const bookIndex = myLibrary.findIndex(b => b.id === book.id);
        if (bookIndex !== -1) {
            myLibrary[bookIndex].readYesNo = 
                myLibrary[bookIndex].readYesNo === 'Yes' ? 'No' : 'Yes';
            readStatusElement.textContent = 
                `Read: ${myLibrary[bookIndex].readYesNo}`;
            saveToLocalStorage();
        }
    });

    detailsContainer.append(
        titleElement, 
        authorElement, 
        genreElement, 
        pagesElement, 
        yearElement, 
        readStatusElement
    );

    buttonContainer.append(
        editButton, 
        deleteButton, 
        toggleReadButton
    );

    bookCard.append(detailsContainer, buttonContainer);

    bookList.appendChild(bookCard);
}

function convertCardToEditForm(bookCard, book) {

    const editForm = document.createElement('form');
    editForm.classList.add('edit-book-form');

    const createEditInput = (label, value, type = 'text') => {
        const container = document.createElement('div');
        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.required = true;

        container.append(labelElement, input);
        return { container, input };
    };

    const titleInput = createEditInput('Title:', book.title);
    const authorInput = createEditInput('Author:', book.author);
    const genreInput = createEditInput('Genre:', book.genre);
    const pagesInput = createEditInput('Pages:', book.pages, 'number');
    const yearInput = createEditInput('Year:', book.year, 'number');

    const readStatusContainer = document.createElement('div');
    const readStatusLabel = document.createElement('label');
    readStatusLabel.textContent = 'Read:';

    const readYesRadio = document.createElement('input');
    readYesRadio.type = 'radio';
    readYesRadio.name = `readStatus-${book.id}`;
    readYesRadio.value = 'Yes';
    readYesRadio.checked = book.readYesNo === 'Yes';

    const readNoRadio = document.createElement('input');
    readNoRadio.type = 'radio';
    readNoRadio.name = `readStatus-${book.id}`;
    readNoRadio.value = 'No';
    readNoRadio.checked = book.readYesNo === 'No';

    const readYesLabel = document.createElement('label');
    readYesLabel.append(readYesRadio, document.createTextNode('Yes'));

    const readNoLabel = document.createElement('label');
    readNoLabel.append(readNoRadio, document.createTextNode('No'));

    readStatusContainer.append(readStatusLabel, readYesLabel, readNoLabel);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.type = 'submit';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.type = 'button';

    editForm.append(
        titleInput.container,
        authorInput.container,
        genreInput.container,
        pagesInput.container,
        yearInput.container,
        readStatusContainer,
        saveButton,
        cancelButton
    );

    bookCard.replaceChildren(editForm);

    cancelButton.addEventListener('click', () => {
        bookCard.replaceChildren();
        renderBook(book);
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const bookIndex = myLibrary.findIndex(b => b.id === book.id);
        if (bookIndex !== -1) {
            myLibrary[bookIndex] = {
                ...myLibrary[bookIndex],
                title: titleInput.input.value,
                author: authorInput.input.value,
                genre: genreInput.input.value,
                pages: pagesInput.input.value,
                year: yearInput.input.value,
                readYesNo: document.querySelector(`input[name="readStatus-${book.id}"]:checked`).value
            };

            bookCard.remove();

            saveToLocalStorage();

            bookCard.replaceChildren();
            renderBook(myLibrary[bookIndex]);
        }
    });
}

function addBookToLibrary(event) {
    event.preventDefault();

    const title = titleInput.value;
    const author = authorInput.value;
    const genre = genreInput.value;
    const pages = pagesInput.value;
    const year = publicationYearInput.value;
    
    const readYesNo = document.querySelector('input[name="readYesNo"]:checked')?.value || 'Not specified';

    const newBook = new Book(title, author, genre, pages, year, readYesNo);

    myLibrary.push(newBook);

    saveToLocalStorage();

    renderBook(newBook);

    bookForm.reset();
}

function renderLibrary() {
    bookList.replaceChildren();
    
    myLibrary.forEach(renderBook);
}

bookForm.addEventListener('submit', addBookToLibrary);

renderLibrary();


document.addEventListener('DOMContentLoaded', () => {
    const openLibraryBtn = document.getElementById('openLibraryBtn');
    const libraryContainer = document.getElementById('libraryContainer');
    const libraryToggleWrapper = document.querySelector('.library-toggle-wrapper');

    openLibraryBtn.addEventListener('click', () => {
        if (libraryContainer.style.display === 'none' || libraryContainer.style.display === '') {

            libraryContainer.style.display = 'block';
            libraryToggleWrapper.classList.add('library-open');
            openLibraryBtn.textContent = 'Close Library';
            

            renderLibrary();
        } else {

            libraryContainer.style.display = 'none';
            libraryToggleWrapper.classList.remove('library-open');
            openLibraryBtn.textContent = 'Open Library';
        }
    });
});


