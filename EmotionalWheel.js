document.addEventListener('DOMContentLoaded', function() {
    const svg = document.querySelector('#emotional-wheel svg');
    const emotionName = document.getElementById('emotion-name');
    const emotionDescription = document.getElementById('emotion-description');
    const body = document.body;
    const spinButton = document.getElementById('spin-wheel');

    const emotions = [
        { name: 'Joy', color: '#FFFF00', opposite: 'Sadness', secondary: ['Optimism', 'Love'], tertiary: ['Ecstasy', 'Serenity'] },
        { name: 'Trust', color: '#98FB98', opposite: 'Disgust', secondary: ['Acceptance', 'Admiration'], tertiary: ['Love', 'Trust'] },
        { name: 'Fear', color: '#90EE90', opposite: 'Anger', secondary: ['Apprehension', 'Terror'], tertiary: ['Panic', 'Horror'] },
        { name: 'Surprise', color: '#87CEFA', opposite: 'Anticipation', secondary: ['Amazement', 'Distraction'], tertiary: ['Confusion', 'Shock'] },
        { name: 'Sadness', color: '#4169E1', opposite: 'Joy', secondary: ['Sorrow', 'Disappointment'], tertiary: ['Grief', 'Despair'] },
        { name: 'Disgust', color: '#9370DB', opposite: 'Trust', secondary: ['Loathing', 'Contempt'], tertiary: ['Revulsion', 'Aversion'] },
        { name: 'Anger', color: '#FF0000', opposite: 'Fear', secondary: ['Annoyance', 'Rage'], tertiary: ['Fury', 'Irritation'] },
        { name: 'Anticipation', color: '#FFA500', opposite: 'Surprise', secondary: ['Interest', 'Eagerness'], tertiary: ['Hope', 'Excitement'] }
    ];

    let wheelGroup;

    function createWheel() {
        wheelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        wheelGroup.setAttribute('transform-origin', '250 250'); // Set the transform origin to the center of the SVG
        svg.appendChild(wheelGroup);

        const centerX = 250;
        const centerY = 250;
        const radius = 200;
        const textRadius = radius * 0.7; // Increased to move text more towards the center

        emotions.forEach((emotion, index) => {
            const angle = ((index / emotions.length) * 2 * Math.PI) + (Math.PI / 2);
            const sliceAngle = (2 * Math.PI) / emotions.length;
            const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
            const sweepFlag = 1;

            const startX = centerX + radius * Math.cos(angle - sliceAngle / 2);
            const startY = centerY + radius * Math.sin(angle - sliceAngle / 2);
            const endX = centerX + radius * Math.cos(angle + sliceAngle / 2);
            const endY = centerY + radius * Math.sin(angle + sliceAngle / 2);

            const d = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY} Z`;

            const slice = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            slice.setAttribute('d', d);
            slice.setAttribute('fill', emotion.color);
            slice.setAttribute('stroke', '#fff');
            slice.setAttribute('stroke-width', '2');

            slice.addEventListener('click', () => {
                emotionName.textContent = emotion.name;
                emotionDescription.textContent = `${emotion.name} is opposite to ${emotion.opposite}. Secondary emotions include: ${emotion.secondary.join(', ')}.`;
                
                // Change background color of the whole body
                const lighterColor = getLighterColor(emotion.color, 0.85);
                body.style.backgroundColor = lighterColor;
            });

            wheelGroup.appendChild(slice);

            const textX = centerX + textRadius * Math.cos(angle);
            const textY = centerY + textRadius * Math.sin(angle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', textX);
            text.setAttribute('y', textY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('fill', '#333');
            text.setAttribute('font-size', '16');
            text.setAttribute('font-family', 'Playfair Display, serif');
            text.setAttribute('font-weight', '700');
            text.textContent = emotion.name;

            wheelGroup.appendChild(text);
        });

        // Add an indicator at the bottom of the wheel
        const indicator = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        indicator.setAttribute('d', 'M 250 460 L 240 440 L 260 440 Z');
        indicator.setAttribute('fill', '#333');
        indicator.setAttribute('stroke', '#fff');
        indicator.setAttribute('stroke-width', '2');
        svg.appendChild(indicator);
    }

    createWheel();

    function updateEmotionInfo(emotion) {
        emotionName.textContent = emotion.name;
        emotionDescription.textContent = `${emotion.name} is opposite to ${emotion.opposite}. Secondary emotions include: ${emotion.secondary.join(', ')}.`;
        
        const lighterColor = getLighterColor(emotion.color, 0.85);
        body.style.backgroundColor = lighterColor;

        // Reset all slices
        wheelGroup.querySelectorAll('path').forEach((slice) => {
            slice.setAttribute('stroke', '#fff');
            slice.setAttribute('stroke-width', '2');
        });

        // Highlight the selected emotion
        const slices = wheelGroup.querySelectorAll('path');
        slices.forEach((slice, index) => {
            if (index === emotions.indexOf(emotion)) {
                slice.setAttribute('stroke', '#333');
                slice.setAttribute('stroke-width', '4');
            } else {
                slice.setAttribute('stroke', '#fff');
                slice.setAttribute('stroke-width', '2');
            }
        });
    }

    function spinWheel() {
        const rotations = 5 + Math.random() * 5; // 5 to 10 full rotations
        const duration = 5000; // 5 seconds
        const finalAngle = rotations * 360 + Math.random() * 360;
        
        // Ensure clockwise rotation
        wheelGroup.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
        wheelGroup.style.transform = `rotate(${-finalAngle}deg)`; // Negative angle for clockwise rotation

        setTimeout(() => {
            // Calculate the index of the emotion at the bottom of the wheel
            const bottomAngle = finalAngle % 360;
            const sliceAngle = 360 / emotions.length;
            const selectedIndex = (emotions.length - Math.floor(bottomAngle / sliceAngle)) % emotions.length;
            const selectedEmotion = emotions[selectedIndex];
            
            console.log('Final Angle:', finalAngle);
            console.log('Bottom Angle:', bottomAngle);
            console.log('Selected Index:', selectedIndex);
            console.log('Selected Emotion:', selectedEmotion.name);
            
            updateEmotionInfo(selectedEmotion);
        }, duration);
    }

    spinButton.addEventListener('click', spinWheel);

    // Function to create a lighter version of a color
    function getLighterColor(hex, factor) {
        // Remove the # if present
        hex = hex.replace(/^#/, '');

        // Parse the hex color
        let r = parseInt(hex.slice(0, 2), 16);
        let g = parseInt(hex.slice(2, 4), 16);
        let b = parseInt(hex.slice(4, 6), 16);

        // Make the color lighter
        r = Math.min(255, Math.round(r + (255 - r) * factor));
        g = Math.min(255, Math.round(g + (255 - g) * factor));
        b = Math.min(255, Math.round(b + (255 - b) * factor));

        // Convert back to hex
        return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    }
});
