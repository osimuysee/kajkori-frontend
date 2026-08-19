// ১. সর্বজনীন এলাকা ও লোকেশন তথ্যমালা (locations.js থেকে আসে)
// locations.js লোড না হলে ড্রপডাউন যেন ভেঙে না পড়ে, তাই খালি অবজেক্ট ফলব্যাক
const geoData = typeof bdGeoData !== 'undefined' ? bdGeoData : {};

// ২. HTML এস্কেপিং (ইউজারের ডাটা innerHTML-এ বসানোর আগে)
function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ৩. মোবাইল নম্বর স্ট্যান্ডার্ডাইজেশন (+8801XXXXXXXXX)
function sanitizePhoneNumber(phone) {
    let clean = String(phone || '').replace(/\D/g, ''); // শুধু ডিজিট রাখবে

    if (clean.startsWith('880')) {
        clean = clean.substring(3);
    } else if (clean.startsWith('0')) {
        clean = clean.substring(1);
    }

    return '+880' + clean;
}

// ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর কিনা যাচাই
function isValidBdPhoneNumber(phone) {
    return /^\+8801[3-9]\d{8}$/.test(sanitizePhoneNumber(phone));
}

// ৪. অটোমেটিক বিভাগ-জেলা-উপজেলা ড্রপডাউন হ্যান্ডলিং
document.addEventListener('DOMContentLoaded', () => {
    const divSelect = document.getElementById('division') || document.getElementById('regDivision');
    const distSelect = document.getElementById('district') || document.getElementById('regDistrict');
    const upzSelect = document.getElementById('upazila') || document.getElementById('regUpazila');

    function resetSelect(select, placeholder) {
        if (!select) return;
        select.innerHTML = `<option value="">${placeholder}</option>`;
    }

    function appendOptions(select, values) {
        if (!select) return;
        select.innerHTML += values
            .map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`)
            .join('');
    }

    if (divSelect && distSelect) {
        divSelect.addEventListener('change', function() {
            const division = geoData[this.value];
            resetSelect(distSelect, 'জেলা সিলেক্ট করুন');
            resetSelect(upzSelect, 'উপজেলা সিলেক্ট করুন');

            if (division) {
                appendOptions(distSelect, Object.keys(division.districts).map(k => division.districts[k].name));
            }
        });
    }

    if (distSelect && upzSelect) {
        distSelect.addEventListener('change', function() {
            const districtName = this.value;
            resetSelect(upzSelect, 'উপজেলা সিলেক্ট করুন');
            if (!districtName) return;

            const divisionKey = divSelect ? divSelect.value : '';
            const division = geoData[divisionKey];
            const district = division && Object.keys(division.districts)
                .map(k => division.districts[k])
                .find(d => d.name === districtName);

            if (district && district.upazilas.length) {
                appendOptions(upzSelect, district.upazilas);
            } else {
                appendOptions(upzSelect, ['সদর']);
            }
        });
    }
});
