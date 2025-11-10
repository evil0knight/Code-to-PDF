const printBtn = document.getElementById('print');
const codeTextArea = document.getElementsByTagName('textarea')[0];
const code = document.getElementById('code');
const documentNameInput = document.getElementById('document-name-input');
const languageSelector = document.getElementById('languages');
const codeLines = document.getElementById('line-nums');
const themeStylesheet = document.getElementById('theme-style');
const themeSelector = document.getElementById('themes');
const codeContainer = document.getElementById('code-container');

// File upload mode elements
const textModeBtn = document.getElementById('text-mode-btn');
const fileModeBtn = document.getElementById('file-mode-btn');
const textMode = document.getElementById('text-mode');
const fileMode = document.getElementById('file-mode');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const folderInput = document.getElementById('folder-input');
const selectFilesBtn = document.getElementById('select-files-btn');
const selectFolderBtn = document.getElementById('select-folder-btn');
const fileList = document.getElementById('file-list');
const fileListContainer = document.getElementById('file-list-container');
const conversionOptions = document.getElementById('conversion-options');
const convertFilesBtn = document.getElementById('convert-files-btn');
const clearFilesBtn = document.getElementById('clear-files-btn');
const themeSelectorFile = document.getElementById('themes-file');

let selectedLanguage = localStorage.getItem('language') || 'javascript';
let selectedTheme = localStorage.getItem('theme') || 'github-dark';
let codeText = localStorage.getItem('code') || 'console.log("Hello World")';

// File upload state
let uploadedFiles = [];
let draggedElement = null;

// File extension to language mapping
const extensionToLanguage = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'json': 'json',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'css',
    'sass': 'css',
    'php': 'php',
    'py': 'python',
    'r': 'r',
    'c': 'c',
    'h': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'hpp': 'cpp',
    'hxx': 'cpp',
    'cs': 'cs',
    'rs': 'rust',
    'go': 'go',
    'java': 'java',
    'kt': 'kotlin',
    'kts': 'kotlin',
    'swift': 'swift',
    's': 'armasm',
    'asm': 'x86asm'
};

// Set up the initial state
themeStylesheet.setAttribute('href', getStylesheet(selectedTheme));
themeSelector.value = selectedTheme;
code.classList.add('hljs', `language-${selectedLanguage}`);
escaped = escapeHtml(codeText);
code.innerHTML = escaped;
codeTextArea.value = codeText;
languageSelector.value = selectedLanguage;
hljs.configure({
    languages: ['java', 'javascript', 'html', 'typescript', 'cpp']
});

updateCode();

// Attach event listeners
printBtn.addEventListener('click', () => {
    updateCode();

    // Check PDF mode
    const pdfMode = document.querySelector('input[name="pdf-mode"]:checked').value;

    if (pdfMode === 'text') {
        // Text mode - generate text-based PDF
        const lines = codeTextArea.value.split('\n');
        const numLines = lines.length;
        const lineNumWidth = Math.floor(Math.log10(numLines)) + 1;

        const formattedContent = lines.map((line, i) => {
            const lineNum = (i + 1).toString().padStart(lineNumWidth, ' ');
            return `${lineNum} | ${line}`;
        }).join('\n');

        // Check if dark theme is selected
        let optGroup = themeSelector.options[themeSelector.selectedIndex].parentNode;
        const isDarkTheme = optGroup.label === 'Dark';

        const pdf = generateTextPDF(formattedContent, documentNameInput.value || 'Code', isDarkTheme);
        pdf.save((documentNameInput.value || 'Code') + '.pdf');
    } else {
        // Image mode - use print
        let optGroup = themeSelector.options[themeSelector.selectedIndex].parentNode;
        const lineNumbers = document.querySelectorAll('.line-number');
        const root = document.documentElement;

        if (optGroup.label === 'Dark') {
            root.style.setProperty('--border-thickness', '0px');
            for (let i = 0; i < lineNumbers.length; i++) {
                lineNumbers[i].style.backgroundColor = '#353b48';
                lineNumbers[i].style.color = '#dfe6e9';
            }
        } else {
            root.style.setProperty('--border-thickness', '1px');
            for (let i = 0; i < lineNumbers.length; i++) {
                lineNumbers[i].style.backgroundColor = '#dcdde1';
                lineNumbers[i].style.color = '#2d3436';
            }
        }
        document.title = documentNameInput.value || 'Code';
        window.print();
        document.title = 'Convert Code to PDF Online: Free Tool for Programming Languages';
    }
});

codeTextArea.addEventListener('input', () => {
    codeText = codeTextArea.value;
    localStorage.setItem('code', codeText);
    code.innerHTML = escapeHtml(codeText);
});

languageSelector.addEventListener('change', () => {
    code.classList.remove(`language-${selectedLanguage}`);
    selectedLanguage = languageSelector.value;
    localStorage.setItem('language', selectedLanguage);
    code.classList.add(`language-${selectedLanguage}`);
});

themeSelector.addEventListener('change', () => {
    selectedTheme = themeSelector.value;
    themeStylesheet.href = getStylesheet(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
});

// Helper functions
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getStylesheet(style) {
    return `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/${style}.min.css`;
}

function createCodeLine(lineNumber, lineContent) {
    lineContent = lineContent || ' ';
    const code = `<code id="code" class="hljs language-${selectedLanguage}">${lineContent}</code>`;
    return `<div class="code-line"><span class="line-number">${lineNumber}</span><pre class="code-pre">${code}</pre></div>`;
}

function updateCode() {
    const lines = codeTextArea.value.split('\n');
    const numLines = lines.length;
    let formattedCode = '';

    for (let i = 0; i < lines.length; i++) {
        const lineNumber = (i + 1).toString().padStart(Math.floor(Math.log10(numLines)) + 1, ' ');
        const lineContent = escapeHtml(lines[i]);
        const codeLine = createCodeLine(lineNumber, lineContent);
        formattedCode += codeLine;
    }

    codeContainer.innerHTML = formattedCode;
    hljs.highlightAll();
}

// ============ FILE UPLOAD MODE FUNCTIONS ============

// Mode switching - Add null checks
if (textModeBtn && fileModeBtn && textMode && fileMode) {
    textModeBtn.addEventListener('click', () => {
        textModeBtn.classList.add('active');
        fileModeBtn.classList.remove('active');
        textMode.classList.add('active');
        fileMode.classList.remove('active');
    });

    fileModeBtn.addEventListener('click', () => {
        fileModeBtn.classList.add('active');
        textModeBtn.classList.remove('active');
        fileMode.classList.add('active');
        textMode.classList.remove('active');
    });
} else {
    console.error('Mode switching elements not found:', {
        textModeBtn, fileModeBtn, textMode, fileMode
    });
}

// Get file extension
function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

// Detect language from filename
function detectLanguage(filename) {
    const ext = getFileExtension(filename);
    return extensionToLanguage[ext] || 'javascript';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Handle file selection
function handleFiles(files) {
    Array.from(files).forEach(file => {
        // Get file path (webkitRelativePath for folders, name for individual files)
        const filePath = file.webkitRelativePath || file.name;

        // Only process supported file types
        const ext = getFileExtension(file.name);
        if (!extensionToLanguage[ext]) {
            console.log(`Skipping unsupported file: ${filePath}`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = {
                id: Date.now() + Math.random(),
                name: file.name,
                path: filePath,  // Store full path
                size: file.size,
                content: e.target.result,
                language: detectLanguage(file.name)
            };
            uploadedFiles.push(fileData);
            renderFileList();
        };
        reader.readAsText(file);
    });
}

// Render file list
function renderFileList() {
    if (uploadedFiles.length === 0) {
        fileListContainer.style.display = 'none';
        conversionOptions.style.display = 'none';
        return;
    }

    fileListContainer.style.display = 'block';
    conversionOptions.style.display = 'block';

    fileList.innerHTML = '';
    uploadedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.draggable = true;
        li.dataset.id = file.id;

        li.innerHTML = `
            <span class="file-item-drag-handle">☰</span>
            <div class="file-item-info">
                <span class="file-item-name">${file.path}</span>
                <span class="file-item-type">${file.language}</span>
                <span class="file-item-meta">${formatFileSize(file.size)}</span>
            </div>
            <button class="file-item-remove" data-id="${file.id}">Remove</button>
        `;

        // Drag and drop for reordering
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);

        // Remove file
        li.querySelector('.file-item-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFile(file.id);
        });

        fileList.appendChild(li);
    });
}

// Drag and drop handlers for file reordering
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    const afterElement = getDragAfterElement(fileList, e.clientY);
    if (afterElement == null) {
        fileList.appendChild(draggedElement);
    } else {
        fileList.insertBefore(draggedElement, afterElement);
    }

    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    // Update the uploadedFiles array based on new order
    const newOrder = Array.from(fileList.children).map(li => {
        const id = parseFloat(li.dataset.id);
        return uploadedFiles.find(f => f.id === id);
    });
    uploadedFiles = newOrder;

    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.file-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Remove file from list
function removeFile(id) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== id);
    renderFileList();
}

// Clear all files
if (clearFilesBtn) {
    clearFilesBtn.addEventListener('click', () => {
        uploadedFiles = [];
        renderFileList();
    });
}

// Drop zone events
if (dropZone && fileInput && folderInput && selectFilesBtn && selectFolderBtn) {
    let buttonClickFlag = false;

    // Button click handlers
    selectFilesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        buttonClickFlag = true;
        setTimeout(() => { buttonClickFlag = false; }, 100);
        fileInput.click();
    });

    selectFolderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        buttonClickFlag = true;
        setTimeout(() => { buttonClickFlag = false; }, 100);
        folderInput.click();
    });

    // Drop zone click - only trigger on background clicks
    dropZone.addEventListener('click', (e) => {
        // Don't trigger if button was just clicked
        if (buttonClickFlag) {
            return;
        }

        // Check if click came from button or button container
        const clickedElement = e.target;
        const isButton = clickedElement === selectFilesBtn || clickedElement === selectFolderBtn;
        const isInsideButtons = clickedElement.closest('.upload-buttons') !== null;

        if (isButton || isInsideButtons) {
            return; // Don't handle if clicking buttons
        }

        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');

        // Handle both files and folders from drag-and-drop
        const items = e.dataTransfer.items;
        if (items) {
            const files = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i].webkitGetAsEntry();
                if (item) {
                    if (item.isFile) {
                        items[i].getAsFile() && files.push(items[i].getAsFile());
                    } else if (item.isDirectory) {
                        // For folder drops, we'll read all files recursively
                        readDirectory(item, files);
                    }
                }
            }
            // Wait a bit for recursive reading to complete
            setTimeout(() => handleFiles(files), 500);
        } else {
            handleFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Reset input
    });

    folderInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        folderInput.value = ''; // Reset input
    });
}

// Helper function to read directory recursively
function readDirectory(dirEntry, filesArray) {
    const dirReader = dirEntry.createReader();
    dirReader.readEntries((entries) => {
        entries.forEach((entry) => {
            if (entry.isFile) {
                entry.file((file) => {
                    // Add relative path
                    Object.defineProperty(file, 'webkitRelativePath', {
                        value: entry.fullPath.substring(1), // Remove leading /
                        writable: false
                    });
                    filesArray.push(file);
                });
            } else if (entry.isDirectory) {
                readDirectory(entry, filesArray);
            }
        });
    });
}

// Convert files to PDF
if (convertFilesBtn && themeSelectorFile) {
    convertFilesBtn.addEventListener('click', async () => {
        const conversionMode = document.querySelector('input[name="conversion-mode"]:checked').value;
        const pdfMode = document.querySelector('input[name="pdf-mode-file"]:checked').value;
        const selectedThemeFile = themeSelectorFile.value;

        // Update theme (only needed for image mode)
        if (pdfMode === 'image') {
            themeStylesheet.href = getStylesheet(selectedThemeFile);
        }

        if (pdfMode === 'text') {
            // Text mode
            if (conversionMode === 'separate') {
                await convertSeparatePDFsText();
            } else {
                await generateMergedTextPDF();
            }
        } else {
            // Image mode
            if (conversionMode === 'separate') {
                await convertSeparatePDFs();
            } else {
                await convertMergedPDF();
            }
        }
    });
}

// Convert each file to separate PDF
async function convertSeparatePDFs() {
    const totalFiles = uploadedFiles.length;

    for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        console.log(`Converting ${i + 1}/${totalFiles}: ${file.path}`);
        await convertSingleFileToPDF(file);

        // Add delay between downloads
        if (i < uploadedFiles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    alert(`Successfully generated ${totalFiles} PDF file(s)!`);
}

// Convert each file to separate PDF (text mode)
async function convertSeparatePDFsText() {
    const totalFiles = uploadedFiles.length;

    for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        console.log(`Converting ${i + 1}/${totalFiles}: ${file.path}`);
        await generateTextPDFForFile(file);

        // Add delay between downloads
        if (i < uploadedFiles.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    alert(`Successfully generated ${totalFiles} text PDF file(s)!`);
}

// Convert single file to PDF using jsPDF
async function convertSingleFileToPDF(file) {
    // Update code display
    selectedLanguage = file.language;
    code.classList.remove(...code.classList);
    code.classList.add('hljs', `language-${selectedLanguage}`);

    const lines = file.content.split('\n');
    const numLines = lines.length;
    let formattedCode = '';

    for (let i = 0; i < lines.length; i++) {
        const lineNumber = (i + 1).toString().padStart(Math.floor(Math.log10(numLines)) + 1, ' ');
        const lineContent = escapeHtml(lines[i]);
        const codeLine = createCodeLine(lineNumber, lineContent);
        formattedCode += codeLine;
    }

    codeContainer.innerHTML = formattedCode;

    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));

    hljs.highlightAll();

    // Apply theme styles
    applyPrintStyles();

    // Wait longer for rendering and theme to load
    await new Promise(resolve => setTimeout(resolve, 800));

    // Determine background color based on theme
    const optGroup = themeSelectorFile.options[themeSelectorFile.selectedIndex].parentNode;
    const isDarkTheme = optGroup.label === 'Dark';
    const backgroundColor = isDarkTheme ? '#1e1e1e' : '#ffffff';

    // Generate PDF using html2canvas and jsPDF
    try {
        // Make sure container and its parent are visible and have dimensions
        const printArea = document.getElementById('print-area');
        printArea.style.display = 'block';
        printArea.style.visibility = 'visible';
        printArea.style.position = 'relative';

        codeContainer.style.display = 'block';
        codeContainer.style.position = 'relative';
        codeContainer.style.visibility = 'visible';

        const canvas = await html2canvas(codeContainer, {
            scale: 1.5,  // Reduced scale for better stability
            useCORS: true,
            logging: false,
            backgroundColor: backgroundColor,
            removeContainer: false,
            imageTimeout: 15000,
            foreignObjectRendering: false,
            allowTaint: false
        });

        // Validate canvas
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas generation failed - invalid dimensions');
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.95);  // Use JPEG instead of PNG

        // Validate image data
        if (!imgData || imgData === 'data:,') {
            throw new Error('Failed to generate image data');
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
        }

        // Save PDF
        const pdfPath = file.path.replace(/\.[^/.]+$/, '') + '.pdf';
        const pdfName = pdfPath.replace(/[\/\\]/g, '_');
        pdf.save(pdfName);

        console.log(`Successfully generated PDF for ${file.path}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        console.error('File:', file.name);
        console.error('Container dimensions:', codeContainer.offsetWidth, 'x', codeContainer.offsetHeight);
        alert(`Failed to generate PDF for ${file.name}: ${error.message}\nTry using fewer files or smaller files.`);
    }
}

// Old function kept for text mode compatibility
function convertSingleFile(file) {
    return new Promise((resolve) => {
        // Update code display
        selectedLanguage = file.language;
        code.classList.remove(...code.classList);
        code.classList.add('hljs', `language-${selectedLanguage}`);

        const lines = file.content.split('\n');
        const numLines = lines.length;
        let formattedCode = '';

        for (let i = 0; i < lines.length; i++) {
            const lineNumber = (i + 1).toString().padStart(Math.floor(Math.log10(numLines)) + 1, ' ');
            const lineContent = escapeHtml(lines[i]);
            const codeLine = createCodeLine(lineNumber, lineContent);
            formattedCode += codeLine;
        }

        codeContainer.innerHTML = formattedCode;
        hljs.highlightAll();

        // Apply theme styles
        applyPrintStyles();

        // Set document title
        const originalTitle = document.title;
        document.title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

        // Small delay to ensure rendering is complete
        setTimeout(() => {
            window.print();
            document.title = originalTitle;
            resolve();
        }, 100);
    });
}

// Convert all files to merged PDF
async function convertMergedPDF() {
    let allContent = '';
    let totalLines = 0;

    // Calculate total lines for proper numbering
    uploadedFiles.forEach(file => {
        totalLines += file.content.split('\n').length + 3; // +3 for headers
    });

    const numDigits = Math.floor(Math.log10(totalLines)) + 1;
    let currentLine = 1;

    uploadedFiles.forEach((file, fileIndex) => {
        // Add file separator
        if (fileIndex > 0) {
            const separator = `\n${'='.repeat(50)}\n`;
            const separatorLines = separator.split('\n');
            separatorLines.forEach(line => {
                const lineNumber = currentLine.toString().padStart(numDigits, ' ');
                allContent += createCodeLine(lineNumber, escapeHtml(line));
                currentLine++;
            });
        }

        // Add file header
        const header = `File: ${file.path}`;
        const lineNumber = currentLine.toString().padStart(numDigits, ' ');
        allContent += createCodeLine(lineNumber, escapeHtml(header));
        currentLine++;

        const divider = '='.repeat(50);
        const dividerLineNumber = currentLine.toString().padStart(numDigits, ' ');
        allContent += createCodeLine(dividerLineNumber, escapeHtml(divider));
        currentLine++;

        // Add file content
        const lines = file.content.split('\n');
        lines.forEach(line => {
            const lineNumber = currentLine.toString().padStart(numDigits, ' ');
            const lineContent = escapeHtml(line);
            allContent += `<div class="code-line"><span class="line-number">${lineNumber}</span><pre class="code-pre"><code class="hljs language-${file.language}">${lineContent}</code></pre></div>`;
            currentLine++;
        });
    });

    codeContainer.innerHTML = allContent;

    // Wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 100));

    hljs.highlightAll();

    // Apply theme styles
    applyPrintStyles();

    // Wait longer for rendering and theme to load
    await new Promise(resolve => setTimeout(resolve, 800));

    // Determine background color based on theme
    const optGroup = themeSelectorFile.options[themeSelectorFile.selectedIndex].parentNode;
    const isDarkTheme = optGroup.label === 'Dark';
    const backgroundColor = isDarkTheme ? '#1e1e1e' : '#ffffff';

    // Generate merged PDF using html2canvas and jsPDF
    try {
        // Make sure container and its parent are visible and have dimensions
        const printArea = document.getElementById('print-area');
        printArea.style.display = 'block';
        printArea.style.visibility = 'visible';
        printArea.style.position = 'relative';

        codeContainer.style.display = 'block';
        codeContainer.style.position = 'relative';
        codeContainer.style.visibility = 'visible';

        const canvas = await html2canvas(codeContainer, {
            scale: 1.5,  // Reduced scale for better stability
            useCORS: true,
            logging: false,
            backgroundColor: backgroundColor,
            removeContainer: false,
            imageTimeout: 15000,
            foreignObjectRendering: false,
            allowTaint: false
        });

        // Validate canvas
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas generation failed - invalid dimensions');
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.95);  // Use JPEG instead of PNG

        // Validate image data
        if (!imgData || imgData === 'data:,') {
            throw new Error('Failed to generate image data');
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;

        // Add additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pageHeight;
        }

        // Download merged PDF
        pdf.save('Merged-Code.pdf');
        console.log('Successfully generated merged PDF');
        alert('Successfully generated merged PDF!');
    } catch (error) {
        console.error('Error generating merged PDF:', error);
        console.error('Container dimensions:', codeContainer.offsetWidth, 'x', codeContainer.offsetHeight);
        alert(`Failed to generate merged PDF: ${error.message}\nTry using fewer files or smaller files.`);
    }
}

// Apply print styles based on theme
function applyPrintStyles() {
    let optGroup = themeSelectorFile.options[themeSelectorFile.selectedIndex].parentNode;
    const lineNumbers = document.querySelectorAll('.line-number');
    const root = document.documentElement;

    if (optGroup.label === 'Dark') {
        root.style.setProperty('--border-thickness', '0px');
        for (let i = 0; i < lineNumbers.length; i++) {
            lineNumbers[i].style.backgroundColor = '#353b48';
            lineNumbers[i].style.color = '#dfe6e9';
        }
    } else {
        root.style.setProperty('--border-thickness', '1px');
        for (let i = 0; i < lineNumbers.length; i++) {
            lineNumbers[i].style.backgroundColor = '#dcdde1';
            lineNumbers[i].style.color = '#2d3436';
        }
    }
}

// Generate text-based PDF (selectable text)
function generateTextPDF(content, fileName = 'Code.pdf', isDarkTheme = false) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Set monospace font
    pdf.setFont('courier');
    pdf.setFontSize(9);

    const lines = content.split('\n');
    const pageHeight = 297; // A4 height in mm
    const pageWidth = 210; // A4 width in mm
    const marginLeft = 10;
    const marginTop = 10;
    const lineHeight = 4.5; // Line height in mm
    const maxLinesPerPage = Math.floor((pageHeight - marginTop * 2) / lineHeight);

    // Set colors based on theme
    let backgroundColor, textColor;
    if (isDarkTheme) {
        backgroundColor = [30, 30, 30]; // #1e1e1e
        textColor = [223, 230, 233]; // #dfe6e9
    } else {
        backgroundColor = [255, 255, 255]; // #ffffff
        textColor = [45, 52, 54]; // #2d3436
    }

    let currentPage = 1;
    let currentLine = 0;

    // Calculate line number width
    const maxLineNum = lines.length;
    const lineNumWidth = maxLineNum.toString().length;

    // Helper function to add background to current page
    function addPageBackground() {
        pdf.setFillColor(...backgroundColor);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');
        pdf.setTextColor(...textColor);
    }

    // Add background to first page
    addPageBackground();

    for (let i = 0; i < lines.length; i++) {
        if (currentLine >= maxLinesPerPage) {
            pdf.addPage();
            currentPage++;
            currentLine = 0;
            // Add background to new page
            addPageBackground();
        }

        const yPosition = marginTop + (currentLine + 1) * lineHeight;
        const lineNum = (i + 1).toString().padStart(lineNumWidth, ' ');
        const lineText = `${lineNum} | ${lines[i]}`;

        // Truncate long lines to fit page width
        const maxChars = Math.floor((pageWidth - marginLeft * 2) / 2.1); // Approximate chars per line
        const truncatedText = lineText.length > maxChars ? lineText.substring(0, maxChars) : lineText;

        pdf.text(truncatedText, marginLeft, yPosition);
        currentLine++;
    }

    return pdf;
}

// Generate text-based PDF for file upload mode
async function generateTextPDFForFile(file) {
    const lines = file.content.split('\n');
    const maxLineNum = lines.length;
    const lineNumWidth = maxLineNum.toString().length;

    // Format content with line numbers
    const formattedContent = lines.map((line, i) => {
        const lineNum = (i + 1).toString().padStart(lineNumWidth, ' ');
        return `${lineNum} | ${line}`;
    }).join('\n');

    // Check if dark theme is selected
    let optGroup = themeSelectorFile.options[themeSelectorFile.selectedIndex].parentNode;
    const isDarkTheme = optGroup.label === 'Dark';

    const pdf = generateTextPDF(formattedContent, file.name, isDarkTheme);
    const pdfPath = file.path.replace(/\.[^/.]+$/, '') + '.pdf';
    const pdfName = pdfPath.replace(/[\/\\]/g, '_');
    pdf.save(pdfName);

    console.log(`Successfully generated text PDF for ${file.path}`);
}

// Generate merged text-based PDF
async function generateMergedTextPDF() {
    let allContent = '';

    uploadedFiles.forEach((file, fileIndex) => {
        // Add file separator
        if (fileIndex > 0) {
            allContent += '\n' + '='.repeat(80) + '\n';
        }

        // Add file header
        allContent += `File: ${file.path}\n`;
        allContent += '='.repeat(80) + '\n';

        // Add file content
        allContent += file.content + '\n';
    });

    // Check if dark theme is selected
    let optGroup = themeSelectorFile.options[themeSelectorFile.selectedIndex].parentNode;
    const isDarkTheme = optGroup.label === 'Dark';

    const pdf = generateTextPDF(allContent, 'Merged-Code.pdf', isDarkTheme);
    pdf.save('Merged-Code.pdf');
    console.log('Successfully generated merged text PDF');
    alert('Successfully generated merged text PDF!');
}




