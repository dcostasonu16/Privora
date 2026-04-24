document.addEventListener('DOMContentLoaded', () => {
    // 1. Load the Stats (Blocked Counter) - Static update
    chrome.storage.local.get(['blockedCount'], (result) => {
        const countElement = document.getElementById('leaks-blocked');
        if (countElement) {
            countElement.innerHTML = result.blockedCount || 0;
        }
    });

    // 2. Manage Toggles (Settings)
    const toggles = ['toggle-identity', 'toggle-secrets', 'toggle-network'];
    
    chrome.storage.local.get(toggles, (result) => {
        toggles.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = result[id] !== false;

                checkbox.addEventListener('change', (e) => {
                    chrome.storage.local.set({ [id]: e.target.checked });
                });
            }
        });
    });

    // 3. Generate Report Logic (Light Mode & Static)
    document.getElementById('reportBtn').addEventListener('click', () => {
        chrome.storage.local.get(['blockedCount'], (result) => {
            const count = result.blockedCount || 0;
            const timestamp = new Date().toLocaleString();
            
            const reportHtml = `
                <html>
                <head>
                    <title>PromptArmor Security Audit</title>
                    <style>
                        body { 
                            font-family: 'Inter', -apple-system, sans-serif; 
                            padding: 40px; 
                            color: #1e293b; 
                            background: #f1f5f9;
                        }
                        .card { 
                            background: white; 
                            padding: 40px; 
                            border-radius: 16px; 
                            max-width: 600px; 
                            margin: auto; 
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                            border: 1px solid #e2e8f0;
                        }
                        h1 { 
                            color: #4f46e5;
                            border-bottom: 2px solid #f1f5f9; 
                            padding-bottom: 15px;
                            font-size: 24px;
                            margin-top: 0;
                        }
                        .stat-box { 
                            background: #f8fafc; 
                            padding: 24px; 
                            border-radius: 12px; 
                            text-align: center; 
                            margin: 20px 0;
                            border: 1px solid #e2e8f0;
                        }
                        .stat { font-size: 48px; font-weight: 800; color: #4f46e5; }
                        ul { line-height: 1.8; color: #475569; padding-left: 20px; }
                        .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; }
                        .note-box { background: #eff6ff; padding: 12px; border-radius: 8px; font-size: 13px; color: #1e40af; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>PromptArmor Privacy Audit</h1>
                        <p><strong>Generated:</strong> ${timestamp}</p>
                        <p>Summary of intercepted data points for this local session:</p>
                        
                        <div class="stat-box">
                            <div class="stat">${count}</div>
                            <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b;">Total Leaks Prevented</div>
                        </div>

                        <ul>
                            <li><strong>Identity:</strong> Emails, Student IDs, and Phone Numbers.</li>
                            <li><strong>Credentials:</strong> API Keys and Cloud Tokens.</li>
                            <li><strong>Network:</strong> Infrastructure IP addresses.</li>
                        </ul>
                        
                        <div class="note-box">
                            <strong>Local Shield Active:</strong> No data was transmitted to external servers. All processing occurred within the Manifest V3 sandbox.
                        </div>
                        <div class="footer">PromptArmor v1.0 | Security Intelligence for AI</div>
                    </div>
                </body>
                </html>
            `;

            const blob = new Blob([reportHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url);
        });
    });
});
