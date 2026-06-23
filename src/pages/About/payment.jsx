let currentMethod = 'card';

// Switch between Card and UPI tabs
function switchMode(mode) {
    currentMethod = mode;
    const cardSec = document.getElementById('cardSection');
    const upiSec = document.getElementById('upiSection');
    const cTab = document.getElementById('cardTab');
    const uTab = document.getElementById('upiTab');

    if (mode === 'card') {
        cardSec.classList.remove('hidden');
        upiSec.classList.add('hidden');
        cTab.classList.add('active', 'text-white');
        uTab.classList.remove('active', 'text-white');
        uTab.classList.add('text-gray-400');
        
        // Form validations dynamic toggle
        document.getElementById('cName').required = true;
        document.getElementById('cNum').required = true;
        document.getElementById('cExp').required = true;
        document.getElementById('cCvv').required = true;
        document.getElementById('upiId').required = false;
    } else {
        upiSec.classList.remove('hidden');
        cardSec.classList.add('hidden');
        uTab.classList.add('active', 'text-white');
        cTab.classList.remove('active', 'text-white');
        cTab.classList.add('text-gray-400');
        
        document.getElementById('cName').required = false;
        document.getElementById('cNum').required = false;
        document.getElementById('cExp').required = false;
        document.getElementById('cCvv').required = false;
        document.getElementById('upiId').required = true;
    }
}

// Automatically add spaces after every 4 digits in card number
document.getElementById('cNum').addEventListener('input', (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    e.target.value = formatted;
});

// Automatically add slash in expiry field (MM/YY)
document.getElementById('cExp').addEventListener('input', (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (val.length > 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
});

// Form submit action
function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('payBtn');
    
    btn.disabled = true;
    btn.innerText = 'Processing Payment...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
        btn.innerText = 'Payment Successful!';
        btn.style.backgroundColor = '#10b981'; // Green color on success
        alert('Payment Done via ' + currentMethod.toUpperCase());
    }, 2000);
}