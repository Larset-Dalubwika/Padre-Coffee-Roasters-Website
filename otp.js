const row = document.getElementById('otp-row');
const boxes = [...row.querySelectorAll('.otp-box')];
const errorEl = document.getElementById('otp-error');
const pasteBtn = document.getElementById('paste-btn');
const verifyBtn = document.getElementById('verify-btn');


// pigabəgkəs su bətang ning ubos a box tanganing mabùo su PIN
function getCode() {
    return boxes.map(b => b.value).join('');
}

// piga-update su "filled" a kamtangan dangan pigaalin su error message
function refresh() {
    boxes.forEach(b => b.classList.toggle('filled', b.value !== ''));
    errorEl.textContent = '';
}

// pigabətangan su mga box magpun sa primíro dangan pigpásibəg sa kadurog su cursor
function fill(digits, start = 0) {
    digits.split('').forEach((d, i) => {
        if (boxes[start + i]) boxes[start + i].value = d;
    });
    boxes[Math.min(start + digits.length, boxes.length - 1)].focus();
    refresh();
}

// pigakuko sana mga digits, eyémplo: "48 29-13" -> "482913"
function onlyDigits(text) {
    return text.replace(/\D/g, '');
}

// patùgudon su mga box

boxes.forEach((box, i) => {

    // pirìən su bilang didto pag pinindot su box tanganing pag nagtype ka didto, 
    // masasalinan sana dangan di' mādugangan
    box.addEventListener('focus', () => box.select());

    // pagtype o autofill
    box.addEventListener('input', () => {
        const digits = onlyDigits(box.value);
        box.value = '';
        if (digits) fill(digits, i);
        // sibəgən
        else refresh();
    });

    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && box.value === '' && i > 0) {
            // empty box + backspace = bumalik dangan buràən su sa wala
            e.preventDefault();
            boxes[i - 1].value = '';
            boxes[i - 1].focus();
            refresh();
        } else if (e.key === 'ArrowLeft' && i > 0) {
            e.preventDefault();
            boxes[i - 1].focus();
        } else if (e.key === 'ArrowRight' && i < boxes.length - 1) {
            e.preventDefault();
            boxes[i + 1].focus();
        } else if (e.key === 'Enter') {
            verify();
        }
    });

    // Ctrl+V / long-press paste sa ləg 
    box.addEventListener('paste', (e) => {
        e.preventDefault();
        const digits = onlyDigits(e.clipboardData.getData('text')).slice(0, boxes.length);
        if (!digits) return;
        // pirmi nagapun su code sa primíro, su di' kumpléto magapun didi
        fill(digits, digits.length >= boxes.length ? 0 : i);
    });
});

// "Paste Code"

pasteBtn.addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        const digits = onlyDigits(text).slice(0, boxes.length);
        if (!digits) {
            showError('No code found in your clipboard.');
            return;
        }
        fill(digits, 0);
    } catch (err) {
        // blocked permission ngaya o di' supported su browser
        showError('Couldn\u2019t read your clipboard. Click a box and press Ctrl+V instead.');
    }
});

// i-verify

function showError(msg) {
    errorEl.textContent = msg;
    row.classList.remove('shake');
    void row.offsetWidth;
    // i-restart su animation
    row.classList.add('shake');
}

function verify() {
    const code = getCode();
    if (code.length < boxes.length) {
        showError('Enter all 6 digits.');
        return;
    }
    // GIGIBON: isend su code sa backend didi
    console.log('Verifying code:', code);
}

verifyBtn.addEventListener('click', verify);

boxes[0].focus();