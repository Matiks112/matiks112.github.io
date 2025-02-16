const sections = document.querySelectorAll('.section');
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSectionId = button.id.replace('-btn', '');
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(targetSectionId).classList.add('active');
    });
});

function toggleElement(checkboxId, elementId) {
    const checkbox = document.getElementById(checkboxId);
    const element = document.getElementById(elementId);
    element.style.display = checkbox.checked ? 'block' : 'none';
}

// Event listeners for showing/hiding elements (MS)
document.getElementById('ms-block').addEventListener('change', () => toggleElement('ms-block', 'ms-block-message'));
document.getElementById('ms-alert').addEventListener('change', () => toggleElement('ms-alert', 'ms-alert-channel'));
document.getElementById('ms-timeout').addEventListener('change', () => toggleElement('ms-timeout', 'ms-timeout-duration'));

// Event listeners for showing/hiding elements (SSC)
document.getElementById('ssc-block').addEventListener('change', () => toggleElement('ssc-block', 'ssc-block-message'));
document.getElementById('ssc-alert').addEventListener('change', () => toggleElement('ssc-alert', 'ssc-alert-channel'));

// Event listeners for showing/hiding elements (CFW)
document.getElementById('cfw-block').addEventListener('change', () => toggleElement('cfw-block', 'cfw-block-message'));
document.getElementById('cfw-alert').addEventListener('change', () => toggleElement('cfw-alert', 'cfw-alert-channel'));

// Event listeners for showing/hiding elements (CW)
document.getElementById('cw-block').addEventListener('change', () => toggleElement('cw-block', 'cw-block-message'));
document.getElementById('cw-alert').addEventListener('change', () => toggleElement('cw-alert', 'cw-alert-channel'));
document.getElementById('cw-timeout').addEventListener('change', () => toggleElement('cw-timeout', 'cw-timeout-duration'));


function generateMetadata(sectionId) {
    let rule = {
        enabled: true,
        actions: [],
        trigger_metadata: {}
    };

    switch (sectionId) {
        case 'ms': // Mention Spam
            rule.name = "Mention Spam Rule";
            rule.trigger_type = 5; // MENTION_SPAM
            rule.event_type = 1; // MESSAGE_SEND
            rule.trigger_metadata.mention_total_limit = parseInt(document.getElementById('ms-limit').value);
            rule.trigger_metadata.mention_raid_protection_enabled = false; // Currently unused

            if (document.getElementById('ms-block').checked) {
                rule.actions.push({
                    type: 1, // BLOCK_MESSAGE
                    metadata: { custom_message: document.getElementById('ms-block-message').value }
                });
            }
            if (document.getElementById('ms-alert').checked) {
                rule.actions.push({
                    type: 2, // SEND_ALERT_MESSAGE
                    metadata: { channel_id: document.getElementById('ms-alert-channel').value }
                });
            }
            if (document.getElementById('ms-timeout').checked) {
                rule.actions.push({
                    type: 3, // TIMEOUT
                    metadata: { duration_seconds: parseDuration(document.getElementById('ms-timeout-duration').value) }
                });
            }
            rule.exempt_channels = document.getElementById('ms-allowed').value.split(',').map(id => id.trim());
            rule.exempt_roles = document.getElementById('ms-roles').value.split(',').map(id => id.trim());
            break;
        case 'ssc': // Suspected Spam
            rule.name = "Suspected Spam Rule";
            rule.trigger_type = 3; // SPAM
            rule.event_type = 1; // MESSAGE_SEND

            if (document.getElementById('ssc-block').checked) {
                rule.actions.push({
                    type: 1, // BLOCK_MESSAGE
                    metadata: { custom_message: document.getElementById('ssc-block-message').value }
                });
            }
            if (document.getElementById('ssc-alert').checked) {
                rule.actions.push({
                    type: 2, // SEND_ALERT_MESSAGE
                    metadata: { channel_id: document.getElementById('ssc-alert-channel').value }
                });
            }
            rule.exempt_channels = document.getElementById('ssc-allowed').value.split(',').map(id => id.trim());
            rule.exempt_roles = document.getElementById('ssc-roles').value.split(',').map(id => id.trim());
            break;
        case 'cfw': // Common Words
            rule.name = "Common Words Rule";
            rule.trigger_type = 1; // KEYWORD
            rule.event_type = 1; // MESSAGE_SEND
            rule.trigger_metadata.keyword_filter = [];

            const addWord = (word) => {
                if (rule.trigger_metadata.keyword_filter.length < 1000 && word.length <= 60) {
                    rule.trigger_metadata.keyword_filter.push(word);
                } else {
                    alert("Keyword filter limit reached or word too long: " + word);
                }
            };
        
            if (document.getElementById('cfw-severe').checked) addWord("profanity");
            if (document.getElementById('cfw-insults').checked) addWord("slurs");
            if (document.getElementById('cfw-sexual').checked) addWord("sexual_content");
        
            const customWords = document.getElementById('cfw-words').value.split(',').map(word => word.trim());
            customWords.forEach(addWord);
        
            if (document.getElementById('cfw-block').checked) {
                rule.actions.push({
                    type: 1, // BLOCK_MESSAGE
                    metadata: { custom_message: document.getElementById('cfw-block-message').value }
                });
            }
            if (document.getElementById('cfw-alert').checked) {
                rule.actions.push({
                    type: 2, // SEND_ALERT_MESSAGE
                    metadata: { channel_id: document.getElementById('cfw-alert-channel').value }
                });
            }
            rule.exempt_channels = document.getElementById('cfw-allowed').value.split(',').map(id => id.trim());
            rule.exempt_roles = document.getElementById('cfw-roles').value.split(',').map(id => id.trim());
            break;
        case 'cw': // Custom Words
            rule.name = document.getElementById('cw-name').value;
            rule.trigger_type = 1; // KEYWORD
            rule.event_type = 1; // MESSAGE_SEND
            rule.trigger_metadata.keyword_filter = document.getElementById('cw-words').value.split(',').map(word => word.trim());
            rule.trigger_metadata.regex_patterns = document.getElementById('cw-regex').value.split(',').map(regex => regex.trim());

            if (rule.trigger_metadata.keyword_filter.length > 1000) {
                alert("Keyword filter limit reached!");
                rule.trigger_metadata.keyword_filter = rule.trigger_metadata.keyword_filter.slice(0, 1000);
            }
        
            if (rule.trigger_metadata.regex_patterns.length > 10) {
                alert("Regex patterns limit reached!");
                rule.trigger_metadata.regex_patterns = rule.trigger_metadata.regex_patterns.slice(0, 10);
            }
        
        
            if (document.getElementById('cw-block').checked) {
                rule.actions.push({
                    type: 1, // BLOCK_MESSAGE
                    metadata: { custom_message: document.getElementById('cw-block-message').value }
                });
            }
            if (document.getElementById('cw-alert').checked) {
                rule.actions.push({
                    type: 2, // SEND_ALERT_MESSAGE
                    metadata: { channel_id: document.getElementById('cw-alert-channel').value }
                });
            }
            if (document.getElementById('cw-timeout').checked) {
                rule.actions.push({
                    type: 3, // TIMEOUT
                    metadata: { duration_seconds: parseDuration(document.getElementById('cw-timeout-duration').value) }
                });
            }
            rule.exempt_channels = document.getElementById('cw-allowed').value.split(',').map(id => id.trim());
            rule.exempt_roles = document.getElementById('cw-roles').value.split(',').map(id => id.trim());
            break;
    }

    const metadataOutput = document.getElementById('metadata-output');
    metadataOutput.textContent = JSON.stringify(rule, null, 2);
    metadataOutput.style.display = 'block';
    metadataOutput.select();
    metadataOutput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(metadataOutput.textContent);
}

function parseDuration(durationString) {
    const value = parseInt(durationString.slice(0, -1));
    const unit = durationString.slice(-1);

    switch (unit) {
        case 's': return value;
        case 'm': return value * 60;
        case 'h': return value * 60 * 60;
        case 'd': return value * 60 * 60 * 24;
        case 'w': return value * 60 * 60 * 24 * 7;
        default: return 0;
    }
}