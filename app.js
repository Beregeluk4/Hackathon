// Check for browser support
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!('SpeechRecognition' in window)) {
    alert('Your browser does not support Speech Recognition API. Please try with a supported browser like Google Chrome.');
} else {
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;

    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const output = document.getElementById('output');
    const recognizedText = document.getElementById('recognized-text');
    const languageSelect = document.getElementById('language');

    let sentences = []; // Array to store recognized sentences

    // Set the recognition language based on the dropdown selection
    languageSelect.addEventListener('change', (event) => {
        recognition.lang = event.target.value;
    });

    // Set initial language
    recognition.lang = languageSelect.value;

    startBtn.addEventListener('click', () => {
        recognition.start();
    });

    stopBtn.addEventListener('click', () => {
        recognition.stop();
    });

    recognition.addEventListener('result', (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        output.textContent = interimTranscript;

        // Check if the final transcript is a complete sentence (ends with a punctuation mark)
        if (finalTranscript.trim() !== '' && isSentenceComplete(finalTranscript)) {
            saveSentence(finalTranscript);
        }
    });

    recognition.addEventListener('end', () => {
        console.log('Speech recognition service disconnected');
    });

    recognition.addEventListener('error', (event) => {
        console.error('Speech recognition error detected: ', event);
        alert('Speech recognition error detected: ' + event.error + '\nMessage: ' + event.message + '\nType: ' + event.type);
    });

    function saveSentence(sentence) {
        // Add the sentence to the array
        sentences.push(sentence);
        
        // Update UI to display all saved sentences
        recognizedText.innerHTML = sentences.map(sentence => `<p>${sentence}</p>`).join('');
        recognizedText.scrollTop = recognizedText.scrollHeight; // Scroll to bottom
        
        // Optionally, you can save the sentences to local storage or send them to a server
        console.log('Saved Sentence:', sentence);
    }

    function isSentenceComplete(sentence) {
        // Check if the sentence ends with a punctuation mark
        const lastChar = sentence.trim().slice(-1);
        return lastChar === '.' || lastChar === '?' || lastChar === '!';
    }
}
