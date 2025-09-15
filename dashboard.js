// Check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'register.html';
    }
    return currentUser;
}

// Initialize dashboard
const currentUser = checkAuth();
document.getElementById('userName').textContent = currentUser.name;

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'register.html';
}

// Generate Excel quotation with enhanced formatting and logo placeholder
function generateExcel(quotation) {
    // Prepare scope data rows
    const scopeRows = quotation.scope.map((row, idx) => [
        idx + 1,
        row.jobDesc,
        row.brand || '-',
        row.unit,
        row.quantity,
        row.rate,
        row.amount
    ]);

    // Calculate totals
    const totalAmount = quotation.scope.reduce((sum, row) => sum + Number(row.amount), 0);
    const sgst = (totalAmount * (Number(quotation.sgst) / 100)).toFixed(2);
    const cgst = (totalAmount * (Number(quotation.cgst) / 100)).toFixed(2);
    const totalPayable = (totalAmount + Number(sgst) + Number(cgst)).toFixed(2);

    // Build worksheet data array (aoa)
    const wsData = [
        ["[LOGO]", "TOTAL TRUST SOLUTIONS PRIVATE LIMITED", "", "", "", "Quote No.: " + quotation.quotationNumber, "Date: " + quotation.quotationDate],
        ["", "123 Mayank Villa, Chikitsak Nagar, Indore - 452010", "", "", "", "", ""],
        ["", "Phone: +91 7879382301 | Email: ttrustsolutions@gmail.com", "", "", "", "", ""],
        ["", "Restriction on Disclosure and Use of Information", "", "", "", "", ""],
        ["", "This Data in document contain trade secret and confidential or proprietary information pertaining to Total Trust Solutions, the disclosure of which could provide a competitive advantage to others. As a result, this document shall not be disclosed, used or duplicated-in whole or in part of any purpose. The information subject to this restriction is contained in the entire document.", "", "", "", "", ""],
        ["", "MATERIAL & SERVICES QUOTATION", "", "", "", "", ""],
        ["Customer Name & Address", quotation.customerName, "", "Service Requires At", quotation.serviceLocation, "", "Contact Person Details: " + quotation.contactPerson],
        ["Detailed Scope of Work", "Repairing and Maintenance", "", "", "", "", ""],
        ["Sr. No.", "Job Description", "Brand", "Unit", "Quantity", "Rate", "Amount"],
        ...scopeRows,
        [],
        ["Total Amount", "", "", "", "", "", totalAmount],
        ["SGST @" + quotation.sgst + "%", "", "", "", "", "", sgst],
        ["CGST @" + quotation.cgst + "%", "", "", "", "", cgst],
        [],
        ["Total Amount Payable", "", "", "", "", "", totalPayable],
        [],
        ["AIOD Solutions Requirements/ Customer Obligations"],
        ["1. Customer to ensure availability of Proper Specifications."],
        ["2. Customer to Co-ordinate for all the activities and provide co-operation for Smooth services."],
        ["3. Customer will provide essential resources to perform the services."],
        [],
        ["This Quote is only valid till " + quotation.validity + " Days or subjected to revision of prices by the principal."]
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws['!cols'] = [
        { wch: 12 }, { wch: 35 }, { wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 18 }
    ];

    // Set row heights (optional, can be adjusted)
    ws['!rows'] = [
        { hpt: 40 }, { hpt: 20 }, { hpt: 20 }, { hpt: 18 }, { hpt: 30 }, { hpt: 25 }, { hpt: 18 }, { hpt: 18 }
    ];

    // Merges for headers and sections
    ws['!merges'] = [
        { s: { r: 0, c: 1 }, e: { r: 0, c: 4 } }, // Company name
        { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } }, // Quote No. & Date
        { s: { r: 1, c: 1 }, e: { r: 1, c: 6 } }, // Address
        { s: { r: 2, c: 1 }, e: { r: 2, c: 6 } }, // Phone/Email
        { s: { r: 3, c: 1 }, e: { r: 3, c: 6 } }, // Restriction title
        { s: { r: 4, c: 1 }, e: { r: 4, c: 6 } }, // Restriction text
        { s: { r: 5, c: 1 }, e: { r: 5, c: 6 } }, // Title
        { s: { r: 6, c: 1 }, e: { r: 6, c: 2 } }, // Customer Name
        { s: { r: 6, c: 3 }, e: { r: 6, c: 4 } }, // Service At
        { s: { r: 6, c: 6 }, e: { r: 6, c: 6 } }, // Contact Person
        { s: { r: 7, c: 1 }, e: { r: 7, c: 6 } }, // Scope Title
        { s: { r: wsData.length - 1, c: 0 }, e: { r: wsData.length - 1, c: 6 } } // Validity
    ];

    // Enhanced formatting (headers, borders, alignment)
    // Note: SheetJS open-source does not support cell styles in-browser, but Excel will auto-detect some headers.
    // Add a note for the user to replace [LOGO] with their actual logo in Excel.

    // Create workbook and export
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quotation");
    XLSX.writeFile(wb, `quotation_${quotation.quotationNumber}.xlsx`);
}

// Handle quotation form submission
const quotationForm = document.getElementById('quotationForm');
quotationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Gather scope table data
    const scopeRows = Array.from(document.querySelectorAll('#scopeTable tbody tr')).map(row => ({
        jobDesc: row.querySelector('.job-desc').value,
        brand: row.querySelector('.brand').value,
        unit: row.querySelector('.unit').value,
        quantity: row.querySelector('.quantity').value,
        rate: row.querySelector('.rate').value,
        amount: row.querySelector('.amount').value
    }));
    const quotation = {
        quotationNumber: document.getElementById('quotationNumber').value,
        quotationDate: document.getElementById('quotationDate').value,
        customerName: document.getElementById('customerName').value,
        serviceLocation: document.getElementById('serviceLocation').value,
        contactPerson: document.getElementById('contactPerson').value,
        scope: scopeRows,
        sgst: document.getElementById('sgst').value,
        cgst: document.getElementById('cgst').value,
        validity: document.getElementById('validity').value,
        date: new Date().toISOString(),
        status: 'Pending',
        userEmail: currentUser.email
    };
    // Save quotation to localStorage
    const quotations = JSON.parse(localStorage.getItem('quotations') || '[]');
    quotations.push(quotation);
    localStorage.setItem('quotations', JSON.stringify(quotations));
    // Generate Excel
    generateExcel(quotation);
    // Update quotation list
    updateQuotationList();
    // Reset form
    quotationForm.reset();
    alert('Quotation requested successfully! An Excel file has been generated.');
});

// Add/remove rows in scope table and auto-calculate amount
function updateAmount(row) {
    const qty = Number(row.querySelector('.quantity').value) || 0;
    const rate = Number(row.querySelector('.rate').value) || 0;
    row.querySelector('.amount').value = qty * rate;
}

document.getElementById('addRow').addEventListener('click', function() {
    const tbody = document.querySelector('#scopeTable tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="job-desc" required></td>
        <td><input type="text" class="brand"></td>
        <td><input type="text" class="unit" required></td>
        <td><input type="number" class="quantity" required></td>
        <td><input type="number" class="rate" required></td>
        <td><input type="number" class="amount" readonly></td>
        <td><button type="button" class="remove-row">&times;</button></td>
    `;
    tbody.appendChild(tr);
    tr.querySelector('.quantity').addEventListener('input', () => updateAmount(tr));
    tr.querySelector('.rate').addEventListener('input', () => updateAmount(tr));
    tr.querySelector('.remove-row').addEventListener('click', () => tr.remove());
});

Array.from(document.querySelectorAll('#scopeTable tbody tr')).forEach(tr => {
    tr.querySelector('.quantity').addEventListener('input', () => updateAmount(tr));
    tr.querySelector('.rate').addEventListener('input', () => updateAmount(tr));
    tr.querySelector('.remove-row').addEventListener('click', () => tr.remove());
});

// Update quotation list
function updateQuotationList() {
    const quotationList = document.getElementById('quotationList');
    const quotations = JSON.parse(localStorage.getItem('quotations') || '[]')
        .filter(q => q.userEmail === currentUser.email)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    quotationList.innerHTML = quotations.map((quotation, idx) => `
        <div class="quotation-card">
            <h4>Quotation #${quotation.quotationNumber}</h4>
            <p><strong>Date:</strong> ${quotation.quotationDate}</p>
            <p><strong>Customer:</strong> ${quotation.customerName}</p>
            <p><strong>Service Location:</strong> ${quotation.serviceLocation}</p>
            <p><strong>Status:</strong> ${quotation.status}</p>
            <button class="submit-button download-excel-btn" data-idx="${idx}">Download Excel</button>
        </div>
    `).join('');
    // Add event listeners for download buttons
    document.querySelectorAll('.download-excel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            const quotations = JSON.parse(localStorage.getItem('quotations') || '[]')
                .filter(q => q.userEmail === currentUser.email)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            generateExcel(quotations[idx]);
        });
    });
}

// Initialize quotation list
updateQuotationList();

// On dashboard load, show/hide sections based on user role
window.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    // Hide or show sections based on role
    if (currentUser.role === 'admin' || currentUser.role === 'administrator') {
        document.querySelector('.quotation-form').style.display = '';
        document.querySelector('.quotation-history').style.display = '';
        // Show requests section for admin
        if (!document.getElementById('requestsSection')) {
            const requestsSection = document.createElement('div');
            requestsSection.id = 'requestsSection';
            requestsSection.innerHTML = '<h3>Client Quotation Requests</h3><div id="requestList"></div>';
            document.querySelector('.dashboard-container').appendChild(requestsSection);
        }
        updateRequestList();
    } else {
        // Hide quotation generator/history, show request form
        document.querySelector('.quotation-form').style.display = 'none';
        document.querySelector('.quotation-history').style.display = 'none';
        if (!document.getElementById('clientRequestForm')) {
            const formDiv = document.createElement('div');
            formDiv.id = 'clientRequestForm';
            formDiv.innerHTML = `
                <h3>Request a Quotation</h3>
                <form id="requestForm">
                    <div class="form-group">
                        <label for="reqName">Your Name</label>
                        <input type="text" id="reqName" required value="${currentUser.name}">
                    </div>
                    <div class="form-group">
                        <label for="reqEmail">Your Email</label>
                        <input type="email" id="reqEmail" required value="${currentUser.email}">
                    </div>
                    <div class="form-group">
                        <label for="reqPhone">Your Phone</label>
                        <input type="tel" id="reqPhone" required value="${currentUser.phone}">
                    </div>
                    <div class="form-group">
                        <label for="reqDetails">Requirements / Message</label>
                        <textarea id="reqDetails" required></textarea>
                    </div>
                    <button type="submit" class="submit-button">Submit Request</button>
                </form>
            `;
            document.querySelector('.dashboard-container').appendChild(formDiv);
            document.getElementById('requestForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const req = {
                    name: document.getElementById('reqName').value,
                    email: document.getElementById('reqEmail').value,
                    phone: document.getElementById('reqPhone').value,
                    details: document.getElementById('reqDetails').value,
                    date: new Date().toISOString()
                };
                const requests = JSON.parse(localStorage.getItem('quotationRequests') || '[]');
                requests.push(req);
                localStorage.setItem('quotationRequests', JSON.stringify(requests));
                alert('Your request has been submitted! Our team will contact you soon.');
                document.getElementById('requestForm').reset();
            });
        }
    }
    // Profile menu logic
    // Set profile name in dropdown
    document.getElementById('profileUserName').textContent = currentUser.name;
    // Profile dropdown toggle
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');
    profileIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.style.display = profileDropdown.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', function(e) {
        if (!profileDropdown.contains(e.target) && e.target !== profileIcon) {
            profileDropdown.style.display = 'none';
        }
    });
    // Log out button
    document.getElementById('logoutBtn').addEventListener('click', function() {
        logout();
    });
    // Manage Profile button
    document.getElementById('manageProfileBtn').addEventListener('click', function() {
        document.getElementById('profileName').value = currentUser.name;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('manageProfileModal').style.display = 'block';
        profileDropdown.style.display = 'none';
    });
    // Close modal
    document.getElementById('closeProfileModal').addEventListener('click', function() {
        document.getElementById('manageProfileModal').style.display = 'none';
    });
    // Save profile changes
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = document.getElementById('profileName').value;
        const newEmail = document.getElementById('profileEmail').value;
        const newPhone = document.getElementById('profilePhone').value;
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        // Update user in users array
        users = users.map(u => {
            if (u.email === currentUser.email) {
                return { ...u, name: newName, email: newEmail, phone: newPhone };
            }
            return u;
        });
        localStorage.setItem('users', JSON.stringify(users));
        // Update currentUser
        const updatedUser = { ...currentUser, name: newName, email: newEmail, phone: newPhone };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        document.getElementById('userName').textContent = newName;
        document.getElementById('profileUserName').textContent = newName;
        document.getElementById('manageProfileModal').style.display = 'none';
        alert('Profile updated successfully!');
        location.reload();
    });
});

// Admin: update client requests list, pending admin requests, and manage users
function updateRequestList() {
    const requestList = document.getElementById('requestList');
    if (!requestList) return;
    const requests = JSON.parse(localStorage.getItem('quotationRequests') || '[]');
    if (requests.length === 0) {
        requestList.innerHTML = '<p>No client requests yet.</p>';
    } else {
        requestList.innerHTML = requests.map((req, idx) => `
            <div class="quotation-card">
                <p><strong>Name:</strong> ${req.name}</p>
                <p><strong>Email:</strong> ${req.email}</p>
                <p><strong>Phone:</strong> ${req.phone}</p>
                <p><strong>Details:</strong> ${req.details}</p>
                <p><strong>Date:</strong> ${new Date(req.date).toLocaleString()}</p>
                <button class="submit-button prepare-quotation-btn" data-idx="${idx}">Prepare Quotation</button>
                <button class="submit-button send-quotation-btn" data-idx="${idx}">Send Quotation</button>
            </div>
        `).join('');
    }

    // Pending admin requests
    let pendingAdmins = JSON.parse(localStorage.getItem('pendingAdmins') || '[]');
    if (pendingAdmins.length > 0) {
        let pendingDiv = document.getElementById('pendingAdminsList');
        if (!pendingDiv) {
            pendingDiv = document.createElement('div');
            pendingDiv.id = 'pendingAdminsList';
            requestList.parentElement.appendChild(pendingDiv);
        }
        pendingDiv.innerHTML = '<h3>Pending Admin Approvals</h3>' + pendingAdmins.map((admin, idx) => `
            <div class="quotation-card">
                <p><strong>Name:</strong> ${admin.name}</p>
                <p><strong>Email:</strong> ${admin.email}</p>
                <p><strong>Phone:</strong> ${admin.phone}</p>
                <p><strong>Date Requested:</strong> ${new Date(admin.requestedAt).toLocaleString()}</p>
                <button class="submit-button approve-admin-btn" data-idx="${idx}">Approve</button>
                <button class="submit-button reject-admin-btn" data-idx="${idx}">Reject</button>
            </div>
        `).join('');
        // Add event listeners
        pendingDiv.querySelectorAll('.approve-admin-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-idx');
                let pendingAdmins = JSON.parse(localStorage.getItem('pendingAdmins') || '[]');
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const approved = pendingAdmins.splice(idx, 1)[0];
                users.push(approved);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('pendingAdmins', JSON.stringify(pendingAdmins));
                updateRequestList();
                alert('Admin approved successfully!');
            });
        });
        pendingDiv.querySelectorAll('.reject-admin-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-idx');
                let pendingAdmins = JSON.parse(localStorage.getItem('pendingAdmins') || '[]');
                pendingAdmins.splice(idx, 1);
                localStorage.setItem('pendingAdmins', JSON.stringify(pendingAdmins));
                updateRequestList();
                alert('Admin request rejected.');
            });
        });
    } else {
        const existing = document.getElementById('pendingAdminsList');
        if (existing) existing.remove();
    }

    // Manage Clients
    let manageClientsDiv = document.getElementById('manageClientsList');
    if (!manageClientsDiv) {
        manageClientsDiv = document.createElement('div');
        manageClientsDiv.id = 'manageClientsList';
        requestList.parentElement.appendChild(manageClientsDiv);
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const clients = users.filter(u => u.role === 'client');
    manageClientsDiv.innerHTML = '<h3>Manage Clients</h3>' + (clients.length === 0 ? '<p>No clients registered.</p>' : clients.map((client, idx) => `
        <div class="quotation-card">
            <p><strong>Name:</strong> ${client.name}</p>
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Phone:</strong> ${client.phone}</p>
            <button class="submit-button remove-client-btn" data-email="${client.email}">Remove</button>
        </div>
    `).join(''));
    manageClientsDiv.querySelectorAll('.remove-client-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users = users.filter(u => u.email !== email);
            localStorage.setItem('users', JSON.stringify(users));
            updateRequestList();
            alert('Client removed.');
        });
    });

    // Manage Admins
    let manageAdminsDiv = document.getElementById('manageAdminsList');
    if (!manageAdminsDiv) {
        manageAdminsDiv = document.createElement('div');
        manageAdminsDiv.id = 'manageAdminsList';
        requestList.parentElement.appendChild(manageAdminsDiv);
    }
    const administrator = users.find(u => u.role === 'administrator');
    const admins = users.filter(u => u.role === 'admin');
    manageAdminsDiv.innerHTML = '<h3>Manage Admins</h3>' +
        (administrator ? `<div class="quotation-card"><p><strong>Administrator:</strong> ${administrator.name} (${administrator.email})</p></div>` : '') +
        (admins.length === 0 ? '<p>No other admins.</p>' : admins.map((admin, idx) => `
            <div class="quotation-card">
                <p><strong>Name:</strong> ${admin.name}</p>
                <p><strong>Email:</strong> ${admin.email}</p>
                <p><strong>Phone:</strong> ${admin.phone}</p>
                <button class="submit-button remove-admin-btn" data-email="${admin.email}">Remove</button>
            </div>
        `).join(''));
    manageAdminsDiv.querySelectorAll('.remove-admin-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            users = users.filter(u => u.email !== email);
            localStorage.setItem('users', JSON.stringify(users));
            updateRequestList();
            alert('Admin removed.');
        });
    });

    // Add event listeners for Prepare Quotation and Send Quotation
    document.querySelectorAll('.prepare-quotation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            const requests = JSON.parse(localStorage.getItem('quotationRequests') || '[]');
            const req = requests[idx];
            // Store in localStorage for pre-filling
            localStorage.setItem('prepareQuotationData', JSON.stringify(req));
            // Scroll to quotation form and pre-fill
            document.querySelector('.quotation-form').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                document.getElementById('customerName').value = req.name + ' (' + req.email + ', ' + req.phone + ')';
                document.getElementById('serviceLocation').value = req.details;
                document.getElementById('contactPerson').value = req.name + ' (' + req.email + ')';
            }, 300);
        });
    });
    document.querySelectorAll('.send-quotation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = this.getAttribute('data-idx');
            const requests = JSON.parse(localStorage.getItem('quotationRequests') || '[]');
            const req = requests[idx];
            alert('Quotation sent to ' + req.email + '! (Simulated)');
        });
    });
}

// Utility: Reset users to a single permanent admin
// function resetToPermanentAdmin() {
//     const permanentAdmin = {
//         name: 'Aagam',
//         email: 'aagam@tts.com',
//         phone: '',
//         password: 'Aagam@2003',
//         role: 'administrator'
//     };
//     localStorage.setItem('users', JSON.stringify([permanentAdmin]));
//     localStorage.removeItem('pendingAdmins');
//     localStorage.removeItem('quotationRequests');
// }
// Call this function once to reset the system
// resetToPermanentAdmin(); 