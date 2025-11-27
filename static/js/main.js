document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const uploadContent = document.querySelector('.upload-content');
    const predictBtn = document.getElementById('predict-btn');
    const resetBtn = document.getElementById('reset-btn');
    const loading = document.getElementById('loading');
    const resultSection = document.getElementById('result-section');

    // UI Elements for results
    const topPrediction = document.getElementById('top-prediction');
    const confidenceScore = document.getElementById('confidence-score');
    const infoCharacteristics = document.getElementById('info-characteristics');
    const infoRisks = document.getElementById('info-risks');
    const infoPrevention = document.getElementById('info-prevention');
    const infoImpact = document.getElementById('info-impact');
    const otherList = document.getElementById('other-list');

    // Handle Click Upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Handle Drag & Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // Handle File Selection
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            uploadContent.classList.add('hidden');
            predictBtn.classList.remove('hidden');
            resetBtn.classList.remove('hidden');
            resultSection.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    // Handle Prediction
    predictBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) return;

        // UI State: Loading
        predictBtn.classList.add('hidden');
        loading.classList.remove('hidden');
        resultSection.classList.add('hidden');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                displayResults(data);
            } else {
                alert('Error: ' + (data.error || 'Something went wrong'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        } finally {
            loading.classList.add('hidden');
        }
    });

    // Handle Reset
    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        imagePreview.src = '';
        imagePreview.classList.add('hidden');
        uploadContent.classList.remove('hidden');
        predictBtn.classList.add('hidden');
        resetBtn.classList.add('hidden');
        resultSection.classList.add('hidden');
    });

    function displayResults(data) {
        resultSection.classList.remove('hidden');

        // Populate Top Result
        topPrediction.textContent = data.top_match.replace(/_/g, ' ');
        confidenceScore.textContent = `${data.predictions[0].confidence.toFixed(1)}%`;

        // Populate Info
        infoCharacteristics.textContent = data.info.characteristics;
        infoRisks.textContent = data.info.risks;
        infoPrevention.textContent = data.info.prevention;
        infoImpact.textContent = data.info.impact;

        // Populate Other Predictions
        otherList.innerHTML = '';
        data.predictions.slice(1).forEach(pred => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${pred.label.replace(/_/g, ' ')}</span>
                <span>${pred.confidence.toFixed(1)}%</span>
            `;
            otherList.appendChild(li);
        });

        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }
});
