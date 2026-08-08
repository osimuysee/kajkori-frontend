// ১. সর্বজনীন এলাকা ও লোকেশন তথ্যমালা
const districtsData = {
    dhaka: ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল", "নরসিংদী"],
    chittagong: ["চট্টগ্রাম", "কুমিল্লা", "ব্রাহ্মণবাড়িয়া", "ফেনী", "নোয়াখালী"],
    rajshahi: ["রাজশাহী", "বগুড়া", "পাবনা", "নাটোর"],
    khulna: ["খুলনা", "যশোর", "কুষ্টিয়া"],
    sylhet: ["সিলেট", "মৌলভীবাজার", "হবিগঞ্জ"],
    barisal: ["বরিশাল", "পটুয়াখালী"],
    rangpur: ["রংপুর", "দিনাজপুর"],
    mymensingh: ["ময়মনসিংহ", "জামালপুর"]
};

const upazilasData = {
    "কুমিল্লা": ["কুমিল্লা সদর", "সদর দক্ষিণ", "লাকসাম", "চৌদ্দগ্রাম", "দাউদকান্দি", "দেবিদ্বার"],
    "ঢাকা": ["ধানমন্ডি", "মিরপুর", "উত্তরা", "গুলশান", "সাভার", "কেরানীগঞ্জ"],
    "চট্টগ্রাম": ["কোতোয়ালী", "পাঁচলাইশ", "হালিশহর", "পতেঙ্গা", "হাটহাজারী"]
};

// ২. মোবাইল নম্বর স্ট্যান্ডার্ডাইজেশন
function sanitizePhoneNumber(phone) {
    let clean = phone.replace(/\D/g, ''); // শুধু ডিজিট রাখবে
    if (clean.startsWith('880')) {
        clean = clean.substring(2);
    } else if (clean.startsWith('0')) {
        clean = clean;
    }
    return '+88' + clean;
}

// ৩. অটোমেটিক বিভাগ-জেলা-উপজেলা ড্রপডাউন হ্যান্ডলিং
document.addEventListener('DOMContentLoaded', () => {
    const divSelect = document.getElementById('division') || document.getElementById('regDivision');
    const distSelect = document.getElementById('district') || document.getElementById('regDistrict');
    const upzSelect = document.getElementById('upazila') || document.getElementById('regUpazila');

    if (divSelect && distSelect) {
        divSelect.addEventListener('change', function() {
            const val = this.value;
            distSelect.innerHTML = '<option value="">জেলা সিলেক্ট করুন</option>';
            if (upzSelect) upzSelect.innerHTML = '<option value="">উপজেলা সিলেক্ট করুন</option>';

            if (districtsData[val]) {
                districtsData[val].forEach(d => {
                    distSelect.innerHTML += `<option value="${d}">${d}</option>`;
                });
            }
        });
    }

    if (distSelect && upzSelect) {
        distSelect.addEventListener('change', function() {
            const val = this.value;
            upzSelect.innerHTML = '<option value="">উপজেলা সিলেক্ট করুন</option>';

            if (upazilasData[val]) {
                upazilasData[val].forEach(u => {
                    upzSelect.innerHTML += `<option value="${u}">${u}</option>`;
                });
            } else if (val) {
                upzSelect.innerHTML += `<option value="সদর">সদর</option>`;
            }
        });
    }
});