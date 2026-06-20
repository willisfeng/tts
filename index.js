const TOKEN_REFRESH_BEFORE_EXPIRY = 3 * 60;
let tokenInfo = {
    endpoint: null,
    token: null,
    expiredAt: null
};

// HTML 页面模板
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.title">VoiceTTS - AI-Powered Voice Processing Platform</title>
    <meta name="description" content="" data-i18n-content="page.description">
    <meta name="keywords" content="" data-i18n-content="page.keywords">
    <style>
        :root {
            --primary-color: #2563eb;
            --primary-hover: #1d4ed8;
            --secondary-color: #64748b;
            --success-color: #059669;
            --warning-color: #d97706;
            --error-color: #dc2626;
            --background-color: #f8fafc;
            --surface-color: #ffffff;
            --text-primary: #0f172a;
            --text-secondary: #475569;  
            --border-color: #e2e8f0;
            --border-focus: #3b82f6;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            --radius-sm: 6px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--background-color);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: var(--surface-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            padding: 40px 30px;
            text-align: center;
            margin-bottom: 30px;
            border: 1px solid var(--border-color);
        }
        
        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--primary-color);
            margin-bottom: 12px;
            letter-spacing: -0.025em;
        }
        
        .header .subtitle {
            font-size: 1.125rem;
            color: var(--text-secondary);
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .header .features {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        .feature-icon {
            width: 20px;
            height: 20px;
            color: var(--success-color);
        }
        
        .main-content {
            background: var(--surface-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            overflow: hidden;
        }
        
        .form-container {
            padding: 40px;
        }
        
        .form-group {
            margin-bottom: 24px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.875rem;
        }
        
        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 16px;
            color: var(--text-primary);
            background: var(--surface-color);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: var(--border-focus);
            box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
        }
        
        .form-textarea {
            min-height: 120px;
            resize: vertical;
            font-family: inherit;
        }
        
        .controls-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .btn-primary {
            width: 100%;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-primary:hover:not(:disabled) {
            background: var(--primary-hover);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }
        
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-secondary {
            background: var(--success-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-secondary:hover {
            background: #047857;
            transform: translateY(-1px);
        }
        
        .result-container {
            margin-top: 32px;
            padding: 24px;
            background: var(--background-color);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            display: none;
        }
        
        .audio-player {
            width: 100%;
            margin-bottom: 16px;
            border-radius: var(--radius-md);
        }
        
        .error-message {
            color: var(--error-color);
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 16px;
            border-radius: var(--radius-md);
            margin-top: 16px;
            font-weight: 500;
        }
        
        .loading-container {
            text-align: center;
            padding: 32px 20px;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        
        .loading-text {
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        
        /* 输入方式选择优化样式 */
        .input-method-tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 20px;
            background: var(--background-color);
            padding: 4px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
        }
        
        .tab-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px 20px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        
        .tab-btn:hover {
            color: var(--primary-color);
            background: rgba(37, 99, 235, 0.05);
        }
        
        .tab-btn.active {
            background: var(--primary-color);
            color: white;
            box-shadow: var(--shadow-sm);
            transform: translateY(-1px);
        }
        
        .tab-btn .tab-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.1);
            font-size: 0.875rem;
        }
        
        .tab-btn:not(.active) .tab-icon {
            background: rgba(100, 116, 139, 0.1);
        }
        
        .file-upload-container {
            width: 100%;
        }
        
        .file-drop-zone {
            border: 2px dashed var(--border-color);
            border-radius: var(--radius-lg);
            padding: 48px 24px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(135deg, var(--background-color) 0%, rgba(248, 250, 252, 0.8) 100%);
            position: relative;
            overflow: hidden;
        }
        
        .file-drop-zone::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .file-drop-zone:hover::before,
        .file-drop-zone.dragover::before {
            opacity: 1;
        }
        
        .file-drop-zone:hover,
        .file-drop-zone.dragover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }
        
        .file-drop-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 1;
        }
        
        .file-drop-icon {
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, #3b82f6 100%);
            border-radius: var(--radius-lg);
            color: white;
            margin-bottom: 8px;
            box-shadow: var(--shadow-md);
            position: relative;
        }
        
        .file-drop-text {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
            line-height: 1.4;
        }
        
        .file-drop-hint {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin: 0;
            padding: 8px 16px;
            background: rgba(100, 116, 139, 0.1);
            border-radius: var(--radius-sm);
        }
        
        .file-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: linear-gradient(135deg, var(--surface-color) 0%, rgba(248, 250, 252, 0.5) 100%);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            margin-top: 16px;
            box-shadow: var(--shadow-sm);
            transition: all 0.2s ease;
        }
        
        .file-info:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }
        
        .file-details {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
        }
        
        .file-name {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .file-name::before {
            content: '';
            width: 16px;
            height: 16px;
            background: var(--primary-color);
            border-radius: 3px;
            opacity: 0.8;
            flex-shrink: 0;
        }
        
        .file-size {
            font-size: 0.8rem;
            color: var(--text-secondary);
            background: rgba(100, 116, 139, 0.1);
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
            width: fit-content;
        }
        
        .file-remove-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: var(--error-color);
            color: white;
            border-radius: var(--radius-md);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 600;
        }
        
        .file-remove-btn:hover {
            background: #b91c1c;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
        
        /* 语言切换器样式 */
        .language-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .language-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            transition: all 0.2s ease;
            box-shadow: var(--shadow-sm);
        }
        
        .language-btn:hover {
            color: var(--primary-color);
            border-color: var(--primary-color);
            box-shadow: var(--shadow-md);
        }
        
        .language-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 4px;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            min-width: 120px;
            display: none;
        }
        
        .language-dropdown.show {
            display: block;
        }
        
        .language-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 0.875rem;
            color: var(--text-secondary);
            transition: background-color 0.2s ease;
        }
        
        .language-option:hover {
            background: var(--background-color);
            color: var(--text-primary);
        }
        
        .language-option.active {
            background: var(--primary-color);
            color: white;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .form-container {
                padding: 24px;
            }
            
            .controls-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .promotion-content {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 20px;
            }
            
            .qr-code {
                margin: 0 auto;
            }
            
            .input-method-tabs {
                gap: 2px;
                padding: 2px;
            }
            
            .tab-btn {
                padding: 12px 16px;
                font-size: 0.85rem;
                gap: 8px;
            }
            
            .tab-btn .tab-icon {
                width: 18px;
                height: 18px;
            }
            
            .file-drop-zone {
                padding: 32px 16px;
            }
            
            .file-drop-icon {
                width: 56px;
                height: 56px;
            }
            
            .file-info {
                padding: 16px;
                flex-direction: column;
                gap: 12px;
                align-items: flex-start;
            }
            
            .file-remove-btn {
                align-self: flex-end;
            }
            
        }

        /* 付费墙样式 */
        .paywall-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.9) 100%);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
        }
        .paywall-overlay.hidden { display: none; }
        .hidden { display: none !important; }
        .paywall-card {
            background: var(--surface-color);
            border-radius: 20px;
            padding: 44px 36px;
            max-width: 460px;
            width: 100%;
            text-align: center;
            box-shadow: 0 30px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08);
            animation: paywallIn 0.4s ease-out;
        }
        @keyframes paywallIn {
            from { opacity: 0; transform: translateY(20px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .paywall-header {
            margin-bottom: 28px;
        }
        .paywall-icon { 
            width: 72px; height: 72px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 36px;
            box-shadow: 0 4px 15px rgba(37,99,235,0.15);
        }
        .paywall-title { 
            font-size: 1.6rem; 
            font-weight: 800; 
            color: var(--text-primary); 
            margin-bottom: 6px;
            letter-spacing: -0.02em;
        }
        .paywall-desc { 
            font-size: 0.9rem; 
            color: var(--text-secondary); 
            margin-bottom: 0; 
            line-height: 1.6; 
        }
        .paywall-divider {
            height: 1px;
            background: var(--border-color);
            margin: 24px 0;
        }
        .paywall-section-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 12px;
        }
        .paywall-price-list { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 8px; 
            margin-bottom: 28px; 
        }
        .paywall-price-item { 
            background: var(--background-color); 
            border: 2px solid transparent; 
            border-radius: var(--radius-lg); 
            padding: 14px 10px; 
            text-align: center;
            transition: all 0.2s;
        }
        .paywall-price-item:hover {
            border-color: var(--primary-color);
            background: #f0f7ff;
        }
        .paywall-price-item .price-label { 
            display: block; 
            font-size: 0.8rem; 
            color: var(--text-secondary); 
            font-weight: 500;
        }
        .paywall-price-item .price-value { 
            display: block; 
            font-size: 1.25rem; 
            font-weight: 700; 
            color: var(--primary-color); 
            margin-top: 4px; 
        }
        .paywall-price-item.featured {
            border-color: var(--primary-color);
            background: linear-gradient(135deg, #eff6ff, #f0f7ff);
            position: relative;
        }
        .paywall-price-item.featured::before {
            content: '推荐';
            position: absolute;
            top: -8px;
            right: -4px;
            background: var(--primary-color);
            color: #fff;
            font-size: 0.65rem;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 10px;
        }
        .paywall-input-group {
            position: relative;
            margin-bottom: 12px;
        }
        .paywall-input-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.1rem;
            color: var(--text-secondary);
            pointer-events: none;
        }
        .paywall-input {
            width: 100%;
            padding: 13px 16px 13px 42px;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-lg);
            font-size: 0.95rem;
            letter-spacing: 1.5px;
            outline: none;
            transition: all 0.2s;
            background: var(--background-color);
        }
        .paywall-input:focus { 
            border-color: var(--primary-color); 
            background: #fff;
            box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
        }
        .paywall-input::placeholder {
            letter-spacing: 0;
            color: #94a3b8;
        }
        .paywall-btn {
            width: 100%;
            padding: 13px;
            background: linear-gradient(135deg, var(--primary-color), #3b82f6);
            color: #fff;
            border: none;
            border-radius: var(--radius-lg);
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        }
        .paywall-btn:hover { 
            background: linear-gradient(135deg, var(--primary-hover), #2563eb);
            box-shadow: 0 6px 20px rgba(37,99,235,0.4);
            transform: translateY(-1px);
        }
        .paywall-btn:disabled { 
            opacity: 0.6; 
            cursor: not-allowed; 
            transform: none;
            box-shadow: none;
        }
        .paywall-error { 
            color: var(--error-color); 
            font-size: 0.85rem; 
            margin-top: 10px; 
            min-height: 20px;
        }
        .paywall-contact { 
            margin-top: 24px; 
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
            font-size: 0.82rem; 
            color: var(--text-secondary); 
        }
        .paywall-contact a { 
            color: var(--primary-color); 
            text-decoration: none; 
            font-weight: 500;
        }
        .paywall-contact .contact-qr {
            width: 120px;
            height: 120px;
            background: var(--background-color);
            border-radius: var(--radius-md);
            margin: 12px auto 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border-color);
        }
        .paywall-contact .contact-qr img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: var(--radius-md);
        }
        .license-badge {
            position: fixed;
            top: 12px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success-color);
            color: #fff;
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            z-index: 100;
        }
        /* 管理后台样式 */
        .admin-container {
            max-width: 600px;
            margin: 60px auto;
            padding: 32px;
            background: var(--surface-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
        }
        .admin-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; text-align: center; }
        .admin-form { display: flex; gap: 12px; margin-bottom: 20px; }
        .admin-input {
            flex: 1;
            padding: 10px 14px;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 1rem;
        }
        .admin-btn {
            padding: 10px 20px;
            background: var(--primary-color);
            color: #fff;
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-weight: 600;
        }
        .admin-list { list-style: none; padding: 0; }
        .admin-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            border-bottom: 1px solid var(--border-color);
            font-family: monospace;
            font-size: 0.9rem;
        }
        .admin-list .used { color: var(--error-color); }
        .admin-list .unused { color: var(--success-color); }
        .admin-back { display: block; text-align: center; margin-top: 20px; color: var(--primary-color); text-decoration: none; }

    </style>
</head>
<body>

    <!-- 付费墙 -->
    <div class="paywall-overlay" id="paywallOverlay">
        <div class="paywall-card">
            <div class="paywall-header">
                <div class="paywall-icon">🔐</div>
                <div class="paywall-title" data-i18n="paywall.title">激活您的使用权限</div>
                <div class="paywall-desc" data-i18n="paywall.desc">VoiceTTS 是付费服务，请输入您的激活码以解锁全部功能</div>
            </div>
            <div class="paywall-section-label">价格方案</div>
            <div class="paywall-price-list">
                <div class="paywall-price-item"><span class="price-label">3天免费</span></div>
                <div class="paywall-price-item"><span class="price-label">7天</span><span class="price-value">¥9.9</span></div>
                <div class="paywall-price-item featured"><span class="price-label">1个月</span><span class="price-value">¥25</span></div>
                <div class="paywall-price-item"><span class="price-label">3个月</span><span class="price-value">¥60</span></div>
            </div>
            <div class="paywall-section-label">输入激活码</div>
            <div class="paywall-input-group">
                <span class="paywall-input-icon">🔑</span>
                <input type="text" class="paywall-input" id="licenseKeyInput" placeholder="请输入激活码" maxlength="64" autocomplete="off">
            </div>
            <button class="paywall-btn" id="activateBtn" data-i18n="paywall.btn">激 活</button>
            <div class="paywall-error" id="paywallError"></div>
            <div class="paywall-contact">
                <p style="margin-bottom:8px;font-weight:600" data-i18n="paywall.contact">获取激活码请联系：</p>
                <div style="display:flex;gap:16px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:12px">
                    <div style="text-align:center">
                        <div style="width:120px;height:120px;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center"><img src="data:image/jpeg;base64,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" style="width:100%;height:100%;object-fit:cover" alt="微信收款码"></div>
                        <span style="font-size:0.8rem;color:var(--text-secondary)">微信</span>
                    </div>

                </div>
                <p style="margin-top:10px;font-size:0.8rem;color:var(--text-secondary)">付款后联系客服获取激活码</p>
            </div>
        </div>
    </div>
    <!-- 已激活标识 -->
    <div class="license-badge hidden" id="licenseBadge">✅ 已激活</div>

    <!-- 语言切换器 -->
    <div class="language-switcher">
        <div class="language-btn" id="languageBtn">
            <span id="currentLangFlag">🌐</span>
            <span id="currentLangName" data-i18n="lang.current">English</span>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>
        <div class="language-dropdown" id="languageDropdown">
            <div class="language-option" data-lang="zh">
                <span>🇨🇳</span>
                <span data-i18n="lang.zh">中文</span>
            </div>
            <div class="language-option" data-lang="en">
                <span>🇺🇸</span>
                <span data-i18n="lang.en">English</span>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="header">
            <h1 data-i18n="header.title">VoiceTTS</h1>
            <p class="subtitle" data-i18n="header.subtitle">AI-Powered Voice Processing Platform</p>
            <div class="features">
                <div class="feature-item">
                    <span class="feature-icon">✨</span>
                    <span data-i18n="header.feature1">20+ Voice Options</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">⚡</span>
                    <span data-i18n="header.feature2">Lightning Fast</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🆓</span>
                    <span data-i18n="header.feature3">Completely Free</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">📱</span>
                    <span data-i18n="header.feature4">Download Support</span>
                </div>
            </div>
        </div>
        

        <div class="main-content">
            <div class="form-container">
                <form id="ttsForm">
                    <!-- 输入方式选择 -->
                    <div class="form-group">
                        <label class="form-label" data-i18n="form.inputMethod">选择输入方式</label>
                        <div class="input-method-tabs">
                            <button type="button" class="tab-btn active" id="textInputTab">
                                <span class="tab-icon">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                    </svg>
                                </span>
                                <span data-i18n="form.manualInput">手动输入</span>
                            </button>
                            <button type="button" class="tab-btn" id="fileUploadTab">
                                <span class="tab-icon">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                </span>
                                <span data-i18n="form.uploadFile">上传文件</span>
                            </button>
                        </div>
                    </div>

                    <!-- 手动输入区域 -->
                    <div class="form-group" id="textInputArea">
                        <label class="form-label" for="text" data-i18n="form.inputText">输入文本</label>
                        <textarea class="form-textarea" id="text" data-i18n-placeholder="form.textPlaceholder" placeholder="请输入要转换为语音的文本内容，支持中文、英文、数字等..." required></textarea>
                    </div>

                    <!-- 文件上传区域 -->
                    <div class="form-group" id="fileUploadArea" style="display: none;">
                        <label class="form-label" for="fileInput" data-i18n="form.uploadTxt">上传txt文件</label>
                        <div class="file-upload-container">
                            <div class="file-drop-zone" id="fileDropZone">
                                <div class="file-drop-content">
                                    <div class="file-drop-icon">
                                        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L13.09 8.26L19 7L17.74 13.09L24 12L17.74 10.91L19 5L13.09 6.26L12 0L10.91 6.26L5 5L6.26 10.91L0 12L6.26 13.09L5 19L10.91 17.74L12 24L13.09 17.74L19 19L17.74 13.09L24 12Z"/>
                                            <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/>
                                        </svg>
                                    </div>
                                    <p class="file-drop-text" data-i18n="form.dragHint">拖拽txt文件到此处，或点击选择文件</p>
                                    <p class="file-drop-hint" data-i18n="form.dragFormat">支持txt格式，最大500KB</p>
                                </div>
                                <input type="file" id="fileInput" accept=".txt,text/plain" style="display: none;">
                            </div>
                            <div class="file-info" id="fileInfo" style="display: none;">
                                <div class="file-details">
                                    <span class="file-name" id="fileName"></span>
                                    <span class="file-size" id="fileSize"></span>
                                </div>
                                <button type="button" class="file-remove-btn" id="fileRemoveBtn">✕</button>
                            </div>
                        </div>
                    </div>
                
                    <div class="controls-grid">
                        <div class="form-group">
                            <label class="form-label" for="voice" data-i18n="form.voice">语音选择</label>
                            <select class="form-select" id="voice">
                                <optgroup label="🇨🇳 中文 (Chinese)">
                                    <option value="zh-CN-XiaoxiaoNeural" selected>晓晓 Xiaoxiao (女声·温柔)</option>
                                    <option value="zh-CN-YunxiNeural">云希 Yunxi (男声·清朗)</option>
                                    <option value="zh-CN-YunyangNeural">云扬 Yunyang (男声·阳光)</option>
                                    <option value="zh-CN-XiaoyiNeural">晓伊 Xiaoyi (女声·甜美)</option>
                                    <option value="zh-CN-YunjianNeural">云健 Yunjian (男声·稳重)</option>
                                    <option value="zh-CN-XiaochenNeural">晓辰 Xiaochen (女声·知性)</option>
                                    <option value="zh-CN-XiaohanNeural">晓涵 Xiaohan (女声·优雅)</option>
                                    <option value="zh-CN-XiaomengNeural">晓梦 Xiaomeng (女声·梦幻)</option>
                                    <option value="zh-CN-XiaomoNeural">晓墨 Xiaomo (女声·文艺)</option>
                                    <option value="zh-CN-XiaoqiuNeural">晓秋 Xiaoqiu (女声·成熟)</option>
                                    <option value="zh-CN-XiaoruiNeural">晓睿 Xiaorui (女声·智慧)</option>
                                    <option value="zh-CN-XiaoshuangNeural">晓双 Xiaoshuang (女声·活泼)</option>
                                    <option value="zh-CN-XiaoxuanNeural">晓萱 Xiaoxuan (女声·清新)</option>
                                    <option value="zh-CN-XiaoyanNeural">晓颜 Xiaoyan (女声·柔美)</option>
                                    <option value="zh-CN-XiaoyouNeural">晓悠 Xiaoyou (女声·悠扬)</option>
                                    <option value="zh-CN-XiaozhenNeural">晓甄 Xiaozhen (女声·端庄)</option>
                                    <option value="zh-CN-YunfengNeural">云枫 Yunfeng (男声·磁性)</option>
                                    <option value="zh-CN-YunhaoNeural">云皓 Yunhao (男声·豪迈)</option>
                                    <option value="zh-CN-YunxiaNeural">云夏 Yunxia (男声·热情)</option>
                                    <option value="zh-CN-YunyeNeural">云野 Yunye (男声·野性)</option>
                                    <option value="zh-CN-YunzeNeural">云泽 Yunze (男声·深沉)</option>
                                </optgroup>
                                <optgroup label="🇺🇸 英语 (English)">
                                    <option value="en-US-AriaNeural">Aria (女声·美式)</option>
                                    <option value="en-US-GuyNeural">Guy (男声·美式)</option>
                                    <option value="en-US-JennyNeural">Jenny (女声·美式)</option>
                                    <option value="en-US-AvaNeural">Ava (女声·美式)</option>
                                    <option value="en-US-AndrewNeural">Andrew (男声·美式)</option>
                                    <option value="en-US-EmmaNeural">Emma (女声·美式)</option>
                                    <option value="en-US-BrianNeural">Brian (男声·美式)</option>
                                    <option value="en-GB-SoniaNeural">Sonia (女声·英式)</option>
                                    <option value="en-GB-RyanNeural">Ryan (男声·英式)</option>
                                    <option value="en-GB-LibbyNeural">Libby (女声·英式)</option>
                                    <option value="en-AU-NatashaNeural">Natasha (女声·澳式)</option>
                                    <option value="en-AU-WilliamNeural">William (男声·澳式)</option>
                                </optgroup>
                                <optgroup label="🇯🇵 日语 (Japanese)">
                                    <option value="ja-JP-NanamiNeural">七海 Nanami (女声)</option>
                                    <option value="ja-JP-KeitaNeural">圭太 Keita (男声)</option>
                                    <option value="ja-JP-AoiNeural">碧 Aoi (女声)</option>
                                    <option value="ja-JP-DaichiNeural">大地 Daichi (男声)</option>
                                </optgroup>
                                <optgroup label="🇰🇷 韩语 (Korean)">
                                    <option value="ko-KR-SunHiNeural">선희 Sun-Hi (女声)</option>
                                    <option value="ko-KR-InJoonNeural">인준 In-Joon (男声)</option>
                                    <option value="ko-KR-JiMinNeural">지민 Ji-Min (女声)</option>
                                </optgroup>
                                <optgroup label="🇫🇷 法语 (French)">
                                    <option value="fr-FR-DeniseNeural">Denise (女声)</option>
                                    <option value="fr-FR-HenriNeural">Henri (男声)</option>
                                    <option value="fr-CA-SylvieNeural">Sylvie (女声·加式)</option>
                                </optgroup>
                                <optgroup label="🇩🇪 德语 (German)">
                                    <option value="de-DE-KatjaNeural">Katja (女声)</option>
                                    <option value="de-DE-ConradNeural">Conrad (男声)</option>
                                </optgroup>
                                <optgroup label="🇪🇸 西班牙语 (Spanish)">
                                    <option value="es-ES-ElviraNeural">Elvira (女声·西班牙)</option>
                                    <option value="es-ES-AlvaroNeural">Alvaro (男声·西班牙)</option>
                                    <option value="es-MX-DaliaNeural">Dalia (女声·墨式)</option>
                                    <option value="es-MX-JorgeNeural">Jorge (男声·墨式)</option>
                                </optgroup>
                                <optgroup label="🇷🇺 俄语 (Russian)">
                                    <option value="ru-RU-SvetlanaNeural">Светлана Svetlana (女声)</option>
                                    <option value="ru-RU-DmitryNeural">Дмитрий Dmitry (男声)</option>
                                </optgroup>
                                <optgroup label="🇻🇳 越南语 (Vietnamese)">
                                    <option value="vi-VN-HoaiMyNeural">Hoài My (女声)</option>
                                    <option value="vi-VN-NamMinhNeural">Nam Minh (男声)</option>
                                </optgroup>
                                <optgroup label="🇲🇾 马来语 (Malay)">
                                    <option value="ms-MY-YasminNeural">Yasmin (女声)</option>
                                    <option value="ms-MY-OsmanNeural">Osman (男声)</option>
                                </optgroup>
                                <optgroup label="🇹🇭 泰语 (Thai)">
                                    <option value="th-TH-PremwadeeNeural">เปรมวดี Premwadee (女声)</option>
                                    <option value="th-TH-NiwatNeural">นิวัฒน์ Niwat (男声)</option>
                                </optgroup>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="speed" data-i18n="form.speed">语速调节</label>
                            <select class="form-select" id="speed">
                                <option value="0.5" data-i18n="form.speedVerySlow">🐌 很慢</option>
                                <option value="0.75" data-i18n="form.speedSlow">🚶 慢速</option>
                                <option value="1.0" selected data-i18n="form.speedNormal">⚡ 正常</option>
                                <option value="1.25" data-i18n="form.speedFast">🏃 快速</option>
                                <option value="1.5" data-i18n="form.speedVeryFast">🚀 很快</option>
                                <option value="2.0" data-i18n="form.speedExtreme">💨 极速</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="pitch" data-i18n="form.pitch">音调高低</label>
                            <select class="form-select" id="pitch">
                                <option value="-50" data-i18n="form.pitchVeryLow">📉 很低沉</option>
                                <option value="-25" data-i18n="form.pitchLow">📊 低沉</option>
                                <option value="0" selected data-i18n="form.pitchNormal">🎵 标准</option>
                                <option value="25" data-i18n="form.pitchHigh">📈 高亢</option>
                                <option value="50" data-i18n="form.pitchVeryHigh">🎶 很高亢</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="style" data-i18n="form.style">语音风格</label>
                            <select class="form-select" id="style">
                                <option value="general" selected data-i18n="form.styleGeneral">🎭 通用风格</option>
                                <option value="assistant" data-i18n="form.styleAssistant">🤖 智能助手</option>
                                <option value="chat" data-i18n="form.styleChat">💬 聊天对话</option>
                                <option value="customerservice" data-i18n="form.styleCustomer">📞 客服专业</option>
                                <option value="newscast" data-i18n="form.styleNews">📺 新闻播报</option>
                                <option value="affectionate" data-i18n="form.styleAffectionate">💕 亲切温暖</option>
                                <option value="calm" data-i18n="form.styleCalm">😌 平静舒缓</option>
                                <option value="cheerful" data-i18n="form.styleCheerful">😊 愉快欢乐</option>
                                <option value="gentle" data-i18n="form.styleGentle">🌸 温和柔美</option>
                                <option value="lyrical" data-i18n="form.styleLyrical">🎼 抒情诗意</option>
                                <option value="serious" data-i18n="form.styleSerious">🎯 严肃正式</option>
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-primary" id="generateBtn">
                        <span>🎙️</span>
                        <span data-i18n="form.generate">开始生成语音</span>
                    </button>
            </form>
            
                <div id="result" class="result-container">
                    <div id="loading" class="loading-container" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p class="loading-text" id="loadingText" data-i18n="form.loading">正在生成语音，请稍候...</p>
                        <div class="progress-info" id="progressInfo" style="margin-top: 12px; font-size: 0.875rem; color: var(--text-secondary);"></div>
                    </div>
                    
                    <div id="success" style="display: none;">
                        <audio id="audioPlayer" class="audio-player" controls></audio>
                        <a id="downloadBtn" class="btn-secondary" download="speech.mp3">
                            <span>📥</span>
                            <span data-i18n="form.download">下载音频文件</span>
                        </a>
                    </div>
                    
                    <div id="error" class="error-message" style="display: none;"></div>
                </div>
            </div>
        </div>
        

        
    </div>

    <script>
        let selectedFile = null;
        let currentInputMethod = 'text'; // 'text' or 'file'
        let currentLanguage = 'zh'; // 默认语言

        // 国际化翻译数据
        const translations = {
            en: {
                'page.title': 'VoiceTTS - AI-Powered Voice Processing Platform',
                'page.description': 'VoiceTTS is an AI-powered platform that converts text to speech and speech to text with 20+ voice options, lightning fast processing, completely free to use.',
                'page.keywords': 'text to speech,AI voice synthesis,online TTS,voice generator,free voice tools,speech to text,voice transcription',
                'lang.current': 'English',
                'lang.en': 'English',
                'lang.zh': '中文',
                'header.title': 'VoiceTTS',
                'header.subtitle': 'AI-Powered Voice Processing Platform',
                'header.feature1': '20+ Voice Options',
                'header.feature2': 'Lightning Fast',
                
                'paywall.title': 'Activate Your License',
                'paywall.desc': 'VoiceTTS is a paid service. Enter your activation code to unlock all features.',
                'paywall.sub': 'Lifetime Access · One-time Payment',
                'paywall.btn': 'Activate',
                'paywall.contact': 'To get an activation code, contact: ',
                'paywall.activating': 'Activating...',
                'paywall.invalid': 'Invalid activation code. Please try again.',
                'paywall.expired': 'This activation code has expired.',
                'paywall.used': 'This code has already been used.',
                'paywall.success': 'Activation successful! Enjoy VoiceTTS.',
                'header.feature3': 'Premium Service',
                'header.feature4': 'Download Support',
                'form.inputMethod': 'Input Method',
                'form.manualInput': 'Manual Input',
                'form.uploadFile': 'Upload File',
                'form.inputText': 'Enter Text',
                'form.textPlaceholder': 'Enter text to convert to speech...',
                'form.uploadTxt': 'Upload TXT File',
                'form.dragHint': 'Drag and drop a txt file here, or click to select',
                'form.dragFormat': 'Supports TXT format, max 500KB',
                'form.voice': 'Voice Selection',
                'form.speed': 'Speed',
                'form.speedVerySlow': '🐌 Very Slow',
                'form.speedSlow': '🚶 Slow',
                'form.speedNormal': '⚡ Normal',
                'form.speedFast': '🏃 Fast',
                'form.speedVeryFast': '🚀 Very Fast',
                'form.speedExtreme': '💨 Extreme',
                'form.pitch': 'Pitch',
                'form.pitchVeryLow': '📉 Very Low',
                'form.pitchLow': '📊 Low',
                'form.pitchNormal': '🎵 Normal',
                'form.pitchHigh': '📈 High',
                'form.pitchVeryHigh': '🎶 Very High',
                'form.style': 'Voice Style',
                'form.styleGeneral': '🎭 General',
                'form.styleAssistant': '🤖 Assistant',
                'form.styleChat': '💬 Chat',
                'form.styleCustomer': '📞 Customer Service',
                'form.styleNews': '📺 Newscast',
                'form.styleAffectionate': '💕 Affectionate',
                'form.styleCalm': '😌 Calm',
                'form.styleCheerful': '😊 Cheerful',
                'form.styleGentle': '🌸 Gentle',
                'form.styleLyrical': '🎼 Lyrical',
                'form.styleSerious': '🎯 Serious',
                'form.generate': 'Generate Speech',
                'form.loading': 'Generating speech, please wait...',
                'form.download': 'Download Audio'
            },
            zh: {
                'page.title': 'VoiceTTS - AI驱动的语音处理平台',
                'page.description': 'VoiceTTS是一个AI驱动的平台，支持文字转语音和语音转文字，拥有20+种语音选项，闪电般的处理速度，完全免费使用。',
                'page.keywords': '文字转语音,AI语音合成,在线TTS,语音生成器,免费语音工具,语音转文字,语音转录',
                'lang.current': '中文',
                'lang.en': 'English',
                'lang.zh': '中文',
                'header.title': 'VoiceTTS',
                'header.subtitle': 'AI驱动的语音处理平台',
                'header.feature1': '20+种语音选项',
                'header.feature2': '闪电般快速',
                
                'paywall.title': '激活您的使用权限',
                'paywall.desc': 'VoiceTTS 是付费服务，请输入您的激活码以解锁全部功能',
                'paywall.btn': '激活',
                'paywall.contact': '获取激活码请联系：',
                'paywall.activating': '正在激活...',
                'paywall.invalid': '激活码无效，请重试',
                'paywall.expired': '此激活码已过期',
                'paywall.used': '此激活码已被使用',
                'paywall.success': '激活成功！欢迎使用 VoiceTTS',
                'header.feature3': '付费服务',
                'header.feature4': '支持下载',
                'form.inputMethod': '选择输入方式',
                'form.manualInput': '手动输入',
                'form.uploadFile': '上传文件',
                'form.inputText': '输入文本',
                'form.textPlaceholder': '请输入要转换为语音的文本内容，支持中文、英文、数字等...',
                'form.uploadTxt': '上传txt文件',
                'form.dragHint': '拖拽txt文件到此处，或点击选择文件',
                'form.dragFormat': '支持txt格式，最大500KB',
                'form.voice': '语音选择',
                'form.speed': '语速调节',
                'form.speedVerySlow': '🐌 很慢',
                'form.speedSlow': '🚶 慢速',
                'form.speedNormal': '⚡ 正常',
                'form.speedFast': '🏃 快速',
                'form.speedVeryFast': '🚀 很快',
                'form.speedExtreme': '💨 极速',
                'form.pitch': '音调高低',
                'form.pitchVeryLow': '📉 很低沉',
                'form.pitchLow': '📊 低沉',
                'form.pitchNormal': '🎵 标准',
                'form.pitchHigh': '📈 高亢',
                'form.pitchVeryHigh': '🎶 很高亢',
                'form.style': '语音风格',
                'form.styleGeneral': '🎭 通用风格',
                'form.styleAssistant': '🤖 智能助手',
                'form.styleChat': '💬 聊天对话',
                'form.styleCustomer': '📞 客服专业',
                'form.styleNews': '📺 新闻播报',
                'form.styleAffectionate': '💕 亲切温暖',
                'form.styleCalm': '😌 平静舒缓',
                'form.styleCheerful': '😊 愉快欢乐',
                'form.styleGentle': '🌸 温和柔美',
                'form.styleLyrical': '🎼 抒情诗意',
                'form.styleSerious': '🎯 严肃正式',
                'form.generate': '开始生成语音',
                'form.loading': '正在生成语音，请稍候...',
                'form.download': '下载音频文件'
            },
        };

        // 国际化功能
        
        function detectLanguage() {
            // 检测浏览器语言
            const browserLang = navigator.language || navigator.userLanguage;
            const shortLang = browserLang.split('-')[0];
            
            // 检查是否支持该语言
            if (translations[shortLang]) {
                return shortLang;
            }
            
            // 默认返回英语
            return 'en';
        }
        

        function setLanguage(lang) {
            currentLanguage = lang;
            localStorage.setItem('VoiceTTS-language', lang);
            
            // 更新页面语言属性
            document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
            
            // 应用翻译
            applyTranslations();
            
            // 更新语言切换器
            updateLanguageSwitcher();
        }

        function applyTranslations() {
            const langData = translations[currentLanguage];
            if (!langData) return;
            
            // 更新所有带有 data-i18n 属性的元素（包括 select option）
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (langData[key]) {
                    element.textContent = langData[key];
                }
            });
            
            // 更新 placeholder
            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.getAttribute('data-i18n-placeholder');
                if (langData[key]) {
                    element.setAttribute('placeholder', langData[key]);
                }
            });
            
            // 更新 meta 标签
            document.querySelectorAll('[data-i18n-content]').forEach(element => {
                const key = element.getAttribute('data-i18n-content');
                if (langData[key]) {
                    element.setAttribute('content', langData[key]);
                }
            });
            
            // 更新页面标题
            if (langData['page.title']) {
                document.title = langData['page.title'];
            }
        }

        function updateLanguageSwitcher() {
            const langFlags = {
                'en': '🇺🇸',
                'zh': '🇨🇳',
                'ja': '🇯🇵',
                'ko': '🇰🇷',
                'es': '🇪🇸',
                'fr': '🇫🇷',
                'de': '🇩🇪',
                'ru': '🇷🇺'
            };
            
            const langData = translations[currentLanguage];
            document.getElementById('currentLangFlag').textContent = langFlags[currentLanguage];
            document.getElementById('currentLangName').textContent = langData['lang.current'];
            
            // 更新选中状态
            document.querySelectorAll('.language-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-lang') === currentLanguage) {
                    option.classList.add('active');
                }
            });
        }

        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            // 初始化国际化
            initializeI18n();
            

            // 检查激活状态
            checkLicense().then(info => {
                if (info && info.valid) {
                    hidePaywall();
                    updateLicenseBadge(info.expiry);
                } else if (info && info.expired) {
                    // 已过期，显示充值页面，badge 提示过期
                    showPaywall();
                    updateLicenseBadge(info.expiry);
                    document.getElementById('licenseBadge').classList.remove('hidden');
                } else {
                    showPaywall();
                }
            });

            // 初始化其他功能
            initializeInputMethodTabs();
            initializeFileUpload();
            initializeLanguageSwitcher();
        });

        // 初始化输入方式切换
        function initializeInputMethodTabs() {
            const textInputTab = document.getElementById('textInputTab');
            const fileUploadTab = document.getElementById('fileUploadTab');
            const textInputArea = document.getElementById('textInputArea');
            const fileUploadArea = document.getElementById('fileUploadArea');

            textInputTab.addEventListener('click', function() {
                currentInputMethod = 'text';
                textInputTab.classList.add('active');
                fileUploadTab.classList.remove('active');
                textInputArea.style.display = 'block';
                fileUploadArea.style.display = 'none';
                document.getElementById('text').required = true;
            });

            fileUploadTab.addEventListener('click', function() {
                currentInputMethod = 'file';
                fileUploadTab.classList.add('active');
                textInputTab.classList.remove('active');
                textInputArea.style.display = 'none';
                fileUploadArea.style.display = 'block';
                document.getElementById('text').required = false;
            });
        }

        // 初始化文件上传功能
        function initializeFileUpload() {
            const fileDropZone = document.getElementById('fileDropZone');
            const fileInput = document.getElementById('fileInput');
            const fileInfo = document.getElementById('fileInfo');
            const fileRemoveBtn = document.getElementById('fileRemoveBtn');

            // 点击上传区域
            fileDropZone.addEventListener('click', function() {
                fileInput.click();
            });

            // 文件选择
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleFileSelect(file);
                }
            });

            // 拖拽功能
            fileDropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                fileDropZone.classList.add('dragover');
            });

            fileDropZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                fileDropZone.classList.remove('dragover');
            });

            fileDropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                fileDropZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file) {
                    handleFileSelect(file);
                }
            });

            // 移除文件
            fileRemoveBtn.addEventListener('click', function() {
                selectedFile = null;
                fileInput.value = '';
                fileInfo.style.display = 'none';
                fileDropZone.style.display = 'block';
            });
        }

        // 处理文件选择
        function handleFileSelect(file) {
            // 验证文件类型
            if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
                alert('请选择txt格式的文本文件');
                return;
            }

            // 验证文件大小
            if (file.size > 500 * 1024) {
                alert('文件大小不能超过500KB');
                return;
            }

            selectedFile = file;
            
            // 显示文件信息
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileSize').textContent = formatFileSize(file.size);
            document.getElementById('fileInfo').style.display = 'flex';
            document.getElementById('fileDropZone').style.display = 'none';
        }

        // 格式化文件大小
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }


        // ========== 激活码管理 ==========
        function getDeviceId() {
            let id = localStorage.getItem('VoiceTTS-deviceId');
            if (!id) {
                id = crypto.randomUUID();
                localStorage.setItem('VoiceTTS-deviceId', id);
            }
            return id;
        }

        function getLicenseToken() {
            return localStorage.getItem('VoiceTTS-license');
        }

        function isActivated() {
            return !!getLicenseToken();
        }

        function showPaywall() {
            document.getElementById('paywallOverlay').classList.remove('hidden');
            document.getElementById('licenseBadge').classList.add('hidden');
        }

        function hidePaywall() {
            document.getElementById('paywallOverlay').classList.add('hidden');
            document.getElementById('licenseBadge').classList.remove('hidden');
        }

        function updateLicenseBadge(expiry) {
            const badge = document.getElementById('licenseBadge');
            if (expiry) {
                const d = new Date(expiry);
                const dateStr = d.toLocaleDateString('zh-CN');
                const remaining = Math.ceil((expiry - Date.now()) / (24 * 3600 * 1000));
                if (remaining > 0) {
                    badge.innerHTML = '✅ 已激活 · 到期：' + dateStr + '（剩余 ' + remaining + ' 天）';
                    badge.style.background = 'var(--success-color)';
                } else {
                    badge.innerHTML = '⚠️ 已过期 · ' + dateStr;
                    badge.style.background = '#f59e0b';
                }
            } else {
                badge.innerHTML = '✅ 已激活';
            }
        }

        async function checkLicense() {
            const token = getLicenseToken();
            if (!token) return null;
            try {
                const resp = await fetch('/v1/check-license', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, deviceId: getDeviceId() })
                });
                const data = await resp.json();
                return { valid: data.valid, expiry: data.expiry, expired: data.expired || false };
            } catch (e) {
                console.error('License check failed:', e);
            }
            return null;
        }

        // 激活按钮
        document.addEventListener('DOMContentLoaded', function() {
            const activateBtn = document.getElementById('activateBtn');
            const licenseInput = document.getElementById('licenseKeyInput');
            const paywallError = document.getElementById('paywallError');

            activateBtn.addEventListener('click', async function() {
                const code = licenseInput.value.trim();
                if (!code) {
                    paywallError.textContent = currentLanguage === 'zh' ? '请输入激活码' : 'Please enter activation code';
                    return;
                }
                activateBtn.disabled = true;
                const loadingText = translations[currentLanguage]['paywall.activating'];
                activateBtn.textContent = loadingText;
                paywallError.textContent = '';

                try {
                    const resp = await fetch('/v1/activate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, deviceId: getDeviceId() })
                    });
                    const data = await resp.json();
                    if (resp.ok && data.success) {
                        localStorage.setItem('VoiceTTS-license', data.token);
                        // 在 paywall 卡片上显示激活成功信息
                        const expiryDate = data.expiry ? new Date(data.expiry) : null;
                        const dateStr = expiryDate ? expiryDate.toLocaleDateString('zh-CN') : '';
                        const remaining = expiryDate ? Math.ceil((data.expiry - Date.now()) / (24 * 3600 * 1000)) : 0;
                        paywallError.style.color = '#059669';
                        paywallError.innerHTML = '✅ 激活成功！<br>激活码：<b>' + code + '</b><br>有效期至：<b>' + dateStr + '</b>（剩余 ' + remaining + ' 天）';
                        // 延迟隐藏 paywall，让用户看到成功信息
                        setTimeout(() => {
                            hidePaywall();
                            updateLicenseBadge(data.expiry);
                        }, 1500);
                    } else {
                        paywallError.textContent = translations[currentLanguage][data.error || 'paywall.invalid'];
                    }
                } catch (e) {
                    paywallError.textContent = translations[currentLanguage]['paywall.invalid'];
                }
                activateBtn.disabled = false;
                activateBtn.textContent = translations[currentLanguage]['paywall.btn'];
            });

            // 回车键激活
            licenseInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') activateBtn.click();
            });
        });


        // 表单提交处理
        document.getElementById('ttsForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const voice = document.getElementById('voice').value;
            const speed = document.getElementById('speed').value;
            const pitch = document.getElementById('pitch').value;
            const style = document.getElementById('style').value;
            

            if (!isActivated()) {
                showPaywall();
                return;
            }

            const generateBtn = document.getElementById('generateBtn');
            const resultContainer = document.getElementById('result');
            const loading = document.getElementById('loading');
            const success = document.getElementById('success');
            const error = document.getElementById('error');
            
            // 验证输入
            if (currentInputMethod === 'text') {
                const text = document.getElementById('text').value;
                if (!text.trim()) {
                    alert('请输入要转换的文本内容');
                    return;
                }
            } else if (currentInputMethod === 'file') {
                if (!selectedFile) {
                    alert('请选择要上传的txt文件');
                    return;
                }
            }
            
            // 重置状态
            resultContainer.style.display = 'block';
            loading.style.display = 'block';
            success.style.display = 'none';
            error.style.display = 'none';
            generateBtn.disabled = true;
            generateBtn.textContent = '生成中...';
            
            try {
                let response;
                let textLength = 0;
                
                // 更新加载提示
                const loadingText = document.getElementById('loadingText');
                const progressInfo = document.getElementById('progressInfo');
                
                if (currentInputMethod === 'text') {
                    // 手动输入文本
                    let text = document.getElementById('text').value;
                    textLength = text.length;
                    
                    // 根据文本长度显示不同的提示
                    if (textLength > 3000) {
                        loadingText.textContent = '正在处理长文本，请耐心等待...';
                        progressInfo.textContent = '文本长度: ' + textLength + ' 字符，预计需要 ' + (Math.ceil(textLength / 1500) * 2) + ' 秒';
                    } else {
                        loadingText.textContent = '正在生成语音，请稍候...';
                        progressInfo.textContent = '文本长度: ' + textLength + ' 字符';
                    }
                    
                    response = await fetch('/v1/audio/speech', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-License-Token': getLicenseToken() || '',
                            'X-Device-Id': getDeviceId() || '',
                        },
                        body: JSON.stringify({
                            input: text,
                            voice: voice,
                            speed: parseFloat(speed),
                            pitch: pitch,
                            style: style
                        })
                    });
                } else {
                    // 文件上传
                    loadingText.textContent = '正在处理上传的文件...';
                    progressInfo.textContent = '文件: ' + selectedFile.name + ' (' + formatFileSize(selectedFile.size) + ')';
                    
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    formData.append('voice', voice);
                    formData.append('speed', speed);
                    formData.append('pitch', pitch);
                    formData.append('style', style);
                    formData.append('license', getLicenseToken() || '');
                    formData.append('deviceId', getDeviceId() || '');
                    
                    response = await fetch('/v1/audio/speech', {
                        method: 'POST',
                        body: formData
                    });
                }
                
                if (!response.ok) {
                    const errorData = await response.json();
                    const errType = errorData.error?.type || '';
                    if (errType === 'license_expired' || errType === 'license_required') {
                        showPaywall();
                        updateLicenseBadge(errorData.error?.expiry);
                        throw new Error(errorData.error?.message || '请先激活使用权限');
                    }
                    throw new Error(errorData.error?.message || '生成失败');
                }
                
                const audioBlob = await response.blob();
                
                // 使用 base64 data URL 避免 Chrome 对 blob URL 发 Range 请求
                const reader = new FileReader();
                const audioUrl = await new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(audioBlob);
                });
                
                // 显示音频播放器
                const audioPlayer = document.getElementById('audioPlayer');
                const downloadBtn = document.getElementById('downloadBtn');
                
                audioPlayer.src = audioUrl;
                downloadBtn.href = audioUrl;
                
                loading.style.display = 'none';
                success.style.display = 'block';
                

            } catch (err) {
                loading.style.display = 'none';
                error.style.display = 'block';
                
                // 根据错误类型显示不同的提示
                if (err.message.includes('Too many subrequests')) {
                    error.textContent = '错误: 文本过长导致请求过多，请缩短文本内容或分段处理';
                } else if (err.message.includes('频率限制') || err.message.includes('429')) {
                    error.textContent = '错误: 请求过于频繁，请稍后再试';
                } else if (err.message.includes('分块数量') && err.message.includes('超过限制')) {
                    error.textContent = '错误: ' + err.message;
                } else {
                    error.textContent = '错误: ' + err.message;
                }
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<span>🎙️</span><span>开始生成语音</span>';
            }
        });

        // 初始化国际化
        function initializeI18n() {
            // 检查本地存储中的语言设置
            const savedLang = localStorage.getItem('VoiceTTS-language');
            
            if (savedLang && translations[savedLang]) {
                currentLanguage = savedLang;
            } else {
                // 自动检测浏览器语言
                currentLanguage = detectLanguage();
            }
            
            // 应用语言设置
            setLanguage(currentLanguage);
        }

        // 初始化语言切换器
        function initializeLanguageSwitcher() {
            const languageBtn = document.getElementById('languageBtn');
            const languageDropdown = document.getElementById('languageDropdown');

            // 切换下拉菜单显示/隐藏
            languageBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                languageDropdown.classList.toggle('show');
            });

            // 点击页面其他地方时隐藏下拉菜单
            document.addEventListener('click', function() {
                languageDropdown.classList.remove('show');
            });

            // 语言选择
            document.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', function() {
                    const selectedLang = this.getAttribute('data-lang');
                    setLanguage(selectedLang);
                    languageDropdown.classList.remove('show');
                });
            });
        }
    </script>
</body>
</html>
`;


// ========== 激活码系统 ==========
// 部署前请修改 SECRET 和有效期
const LICENSE_SECRET = 'vtts-license-secret-key-2026';
const LICENSE_VALIDITY_DAYS = 30; // 激活码有效期（天）

// 简单字符串哈希（兼容所有环境）
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
}

function generateActivationCode(prefix, days = LICENSE_VALIDITY_DAYS) {
    const now = Date.now();
    const expiry = now + days * 24 * 3600 * 1000;
    const id = now.toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    const raw = prefix + '-' + id + '-' + expiry.toString(36);
    const sig = simpleHash(LICENSE_SECRET + raw);
    return raw + '-' + sig;
}

function verifyActivationCode(code) {
    const parts = code.split('-');
    if (parts.length < 5) return { valid: false, reason: 'invalid' };
    const providedSig = parts[parts.length - 1];
    const raw = parts.slice(0, -1).join('-');
    const computedSig = simpleHash(LICENSE_SECRET + raw);
    if (computedSig !== providedSig) return { valid: false, reason: 'invalid' };
    // 检查有效期
    const expiry = parseInt(parts[parts.length - 2], 36);
    if (Date.now() > expiry) return { valid: false, reason: 'expired', expiry };
    return { valid: true, expiry };
}

// 已使用的激活码和令牌（优先 KV，fallback 内存）
const memUsedCodes = new Set();
const memDeviceTokens = new Map();
const memCodeRecords = [];  // 内存 fallback：激活码记录
let kvAvailable = false;

function getKV(env) {
    return env && env.LICENSE_KV;
}

async function kvGet(env, key) {
    const kv = getKV(env);
    if (kv) {
        try { return await kv.get(key); } catch (e) {}
    }
    return null;
}

async function kvPut(env, key, value) {
    const kv = getKV(env);
    if (kv) {
        try { await kv.put(key, value); } catch (e) {}
    }
}

async function kvList(env) {
    const kv = getKV(env);
    if (kv) {
        try { const list = await kv.list(); return list.keys.map(k => k.name); } catch (e) {}
    }
    return Array.from(memUsedCodes);
}

async function getAllCodeRecords(env) {
    const kv = getKV(env);
    if (kv) {
        try {
            const list = await kv.list({ prefix: 'code:' });
            const records = [];
            const seen = new Set();
            for (const key of list.keys) {
                try {
                    const val = await kv.get(key.name);
                    if (val) {
                        const rec = JSON.parse(val);
                        records.push(rec);
                        seen.add(rec.code);
                    }
                } catch (e) { console.error('getAllCodeRecords get error:', e); }
            }
            // 回填旧激活码：扫描 used: 前缀，补上没有 code: 记录的旧码
            try {
                const usedList = await kv.list({ prefix: 'used:' });
                for (const key of usedList.keys) {
                    const code = key.name.replace('used:', '');
                    if (!seen.has(code)) {
                        const usedAt = await kv.get(key.name);
                        // 从激活码中解析有效期信息
                        const parts = code.split('-');
                        const expiry = parseInt(parts[parts.length - 2], 36) || 0;
                        records.push({
                            code,
                            days: null,
                            createdAt: expiry ? expiry - 30 * 24 * 3600 * 1000 : null,
                            expiry: expiry || null,
                            used: true,
                            usedAt: usedAt ? parseInt(usedAt) : null
                        });
                        seen.add(code);
                        // 回填 code: 记录，下次就能正常显示
                        const backfillData = {
                            code,
                            days: null,
                            createdAt: expiry ? expiry - 30 * 24 * 3600 * 1000 : Date.now(),
                            expiry: expiry || null,
                            used: true,
                            usedAt: usedAt ? parseInt(usedAt) : null
                        };
                        await kv.put('code:' + code, JSON.stringify(backfillData)).catch(() => {});
                    }
                }
            } catch (e) { console.error('getAllCodeRecords usedList error:', e); }
            return records;
        } catch (e) {
            console.error('getAllCodeRecords list error:', e);
            // KV 读取失败，fallback 到内存记录
        }
    }
    // 无 KV 或 KV 失败，返回内存记录
    return [...memCodeRecords];
}

async function isCodeUsed(env, code) {
    const kvVal = await kvGet(env, 'used:' + code);
    if (kvVal !== null) return true;
    return memUsedCodes.has(code);
}

async function markCodeUsed(env, code) {
    memUsedCodes.add(code);
    await kvPut(env, 'used:' + code, Date.now().toString());
    // 同时更新 code: 记录为已使用
    const info = await kvGet(env, 'code:' + code);
    if (info) {
        try {
            const data = JSON.parse(info);
            data.used = true;
            data.usedAt = Date.now();
            await kvPut(env, 'code:' + code, JSON.stringify(data));
        } catch (e) {}
    }
    // 同步内存记录
    const memIdx = memCodeRecords.findIndex(r => r.code === code);
    if (memIdx >= 0) {
        memCodeRecords[memIdx].used = true;
        memCodeRecords[memIdx].usedAt = Date.now();
    }
}

async function saveCodeRecord(env, code, days) {
    const now = Date.now();
    const parts = code.split('-');
    const expiry = parseInt(parts[parts.length - 2], 36);
    const info = { code, days, createdAt: now, expiry, used: false, usedAt: null };
    const kv = getKV(env);
    if (kv) {
        try { await kv.put('code:' + code, JSON.stringify(info)); } catch (e) { console.error('saveCodeRecord KV error:', e); }
    }
    // 内存 fallback
    const existingIdx = memCodeRecords.findIndex(r => r.code === code);
    if (existingIdx >= 0) {
        memCodeRecords[existingIdx] = info;
    } else {
        memCodeRecords.push(info);
    }
}

async function saveLicenseToken(env, token, deviceId, expiry, code) {
    const now = Date.now();
    const info = { deviceId, createdAt: now, expiry: expiry || null, code: code || null };
    memDeviceTokens.set(token, info);
    await kvPut(env, 'lic:' + token, JSON.stringify(info));
}

async function loadLicenseToken(env, token) {
    if (memDeviceTokens.has(token)) return memDeviceTokens.get(token);
    const kvVal = await kvGet(env, 'lic:' + token);
    if (kvVal) {
        try {
            const info = JSON.parse(kvVal);
            memDeviceTokens.set(token, info);
            return info;
        } catch (e) {}
    }
    return null;
}

function issueLicenseToken(deviceId) {
    const token = 'lic-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    memDeviceTokens.set(token, { deviceId, createdAt: Date.now() });
    return token;
}

async function verifyLicenseToken(env, token, deviceId) {
    const info = await loadLicenseToken(env, token);
    if (!info) return false;
    if (info.deviceId !== deviceId) return false;
    return true;
}

export default {
    async fetch(request, env, ctx) {
        return handleRequest(request, env);
    }
};

async function handleRequest(request, env) {
    if (request.method === "OPTIONS") {
        return handleOptions(request);
    }




    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // 返回前端页面
    if (path === "/" || path === "/index.html") {
        return new Response(HTML_PAGE, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                ...makeCORSHeaders()
            }
        });
    }


    // 激活码验证
    if (path === "/v1/activate") {
        try {
            const { code, deviceId } = await request.json();
            if (!code || !deviceId) {
                return new Response(JSON.stringify({ success: false, error: 'paywall.invalid' }), {
                    status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            if (await isCodeUsed(env, code)) {
                return new Response(JSON.stringify({ success: false, error: 'paywall.used' }), {
                    status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            const result = verifyActivationCode(code);
            if (!result.valid) {
                const errorKey = result.reason === 'expired' ? 'paywall.expired' : 'paywall.invalid';
                return new Response(JSON.stringify({ success: false, error: errorKey }), {
                    status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            await markCodeUsed(env, code);
            const expiry = result.expiry;
            const token = issueLicenseToken(deviceId);
            await saveLicenseToken(env, token, deviceId, expiry, code);
            return new Response(JSON.stringify({ success: true, token, expiry }), {
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        } catch (error) {
            return new Response(JSON.stringify({ success: false, error: 'paywall.invalid' }), {
                status: 500, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }
    }

    // 检查许可证状态
    if (path === "/v1/check-license") {
        try {
            const { token, deviceId } = await request.json();
            const info = await loadLicenseToken(env, token);
            if (!info || info.deviceId !== deviceId) {
                return new Response(JSON.stringify({ valid: false }), {
                    headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            // 检查是否到期
            if (info.expiry && Date.now() > info.expiry) {
                return new Response(JSON.stringify({ valid: false, expired: true, expiry: info.expiry }), {
                    headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            return new Response(JSON.stringify({ valid: true, expiry: info.expiry || null }), {
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        } catch (error) {
            return new Response(JSON.stringify({ valid: false }), {
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }
    }

    // 管理后台 - 生成激活码
    if (path === "/admin") {
        const DEFAULT_ADMIN_PASSWORD = 'admintest';
        const adminPassword = (await kvGet(env, 'admin:password')) || DEFAULT_ADMIN_PASSWORD;
        const url = new URL(request.url);
        const pwd = url.searchParams.get('pwd') || '';
        
        // 先检查 URL 参数，再检查 Authorization header
        if (pwd !== adminPassword && request.headers.get('Authorization') !== 'Bearer ' + adminPassword) {
            const html = `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>管理后台</title><style>
                *{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#f0f2f5;min-height:100vh}
                .container{max-width:500px;margin:80px auto;padding:32px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1)}
                h1{text-align:center;margin-bottom:24px;color:#1a1a2e}.input{padding:10px 14px;border:2px solid #e0e0e0;border-radius:8px;font-size:1rem;width:100%;margin-bottom:12px}
                .input:focus{border-color:#2563eb;outline:none}.btn{width:100%;padding:10px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer}
                .error{color:#dc2626;font-size:.875rem;margin-top:8px}
            </style></head><body><div class="container"><h1>管理后台登录</h1>
                <input type="password" class="input" id="pwd" placeholder="请输入管理密码"><button class="btn" id="loginBtn">登录</button><div class="error" id="error"></div></div>
            <script>document.getElementById('loginBtn').onclick=function(){var p=document.getElementById('pwd').value;if(p)window.location.href='/admin?pwd='+encodeURIComponent(p);else document.getElementById('error').textContent='请输入密码'}</script></body></html>`;
            return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
        }

        // 生成新激活码（无 action 参数或 action=generate 时）
        const genUrl = new URL(request.url);
        if (request.method === 'POST' && !genUrl.searchParams.get('action')) {
            const body = await request.json().catch(() => ({}));
            const prefix = body.prefix || 'VTTS';
            const count = body.count || 1;
            const days = parseInt(body.days) || LICENSE_VALIDITY_DAYS;
            const codes = [];
            for (let i = 0; i < count; i++) {
                const c = generateActivationCode(prefix, days);
                codes.push(c);
                await saveCodeRecord(env, c, days);
            }
            return new Response(JSON.stringify({ codes }), {
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }

        // 修改密码 API
        const adminUrl = new URL(request.url);
        if (adminUrl.searchParams.get('action') === 'change-password') {
            if (request.method !== 'POST') {
                return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                    status: 405, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            const body = await request.json().catch(() => ({}));
            const oldPwd = body.oldPassword || '';
            const newPwd = body.newPassword || '';
            if (!newPwd || newPwd.length < 4) {
                return new Response(JSON.stringify({ error: '新密码至少4位' }), {
                    headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            if (oldPwd !== adminPassword) {
                return new Response(JSON.stringify({ error: '旧密码不正确' }), {
                    headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            await kvPut(env, 'admin:password', newPwd);
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }

        // 获取激活码列表 API
        if (adminUrl.searchParams.get('action') === 'list') {
            const allCodes = await getAllCodeRecords(env);
            return new Response(JSON.stringify(allCodes), {
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }

        // 删除激活码 API
        if (adminUrl.searchParams.get('action') === 'delete-code') {
            if (request.method !== 'POST') {
                return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                    status: 405, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            const body = await request.json().catch(() => ({}));
            const code = body.code;
            if (!code) {
                return new Response(JSON.stringify({ error: '缺少激活码' }), {
                    status: 400, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            const kv = getKV(env);
            if (kv) {
                // 删除 code: 记录
                await kv.delete('code:' + code).catch(() => {});
                // 删除 used: 记录
                await kv.delete('used:' + code).catch(() => {});
                // 查找并删除关联的 lic: 记录（许可令牌）
                try {
                    const licList = await kv.list({ prefix: 'lic:' });
                    for (const key of licList.keys) {
                        const val = await kv.get(key.name);
                        if (val) {
                            try {
                                const info = JSON.parse(val);
                                // 检查该 license 是否与激活码关联（通过 deviceId 存储时记录 code）
                                if (info.code === code) {
                                    await kv.delete(key.name).catch(() => {});
                                }
                            } catch (e) {}
                        }
                    }
                } catch (e) {}
            }
            // 同步内存记录
            const memIdx = memCodeRecords.findIndex(r => r.code === code);
            if (memIdx >= 0) memCodeRecords.splice(memIdx, 1);
            memUsedCodes.delete(code);
            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }

        // 显示管理页面
        const html = `<!DOCTYPE html><html lang="zh"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>激活码管理</title><style>
            *{margin:0;padding:0;box-sizing:border-box}body{font-family:sans-serif;background:#f0f2f5;min-height:100vh}
            .container{max-width:800px;margin:40px auto;padding:32px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1)}
            h1{text-align:center;margin-bottom:24px;color:#1a1a2e}
            .section{margin-bottom:24px}
            .section-title{font-size:1.1rem;font-weight:600;margin-bottom:12px;color:#1a1a2e}
            .form{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap}
            .input{padding:10px 14px;border:2px solid #e0e0e0;border-radius:8px;font-size:1rem}
            .input:focus{border-color:#2563eb;outline:none}
            .btn{padding:10px 20px;background:#2563eb;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;white-space:nowrap}
            .btn:hover{background:#1d4ed8}.btn:disabled{opacity:0.6}
            .btn-sm{padding:6px 12px;font-size:.85rem}
            .result{margin-bottom:16px}.code-box{background:#f0fdf4;border:2px solid #22c55e;border-radius:8px;padding:16px;margin-bottom:8px;font-family:monospace;font-size:1rem;word-break:break-all;text-align:center}
            table{width:100%;border-collapse:collapse;font-size:.9rem}
            th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #f0f0f0}
            th{background:#f8fafc;font-weight:600;color:#475569;font-size:.8rem;text-transform:uppercase}
            td{font-family:monospace;font-size:.82rem;word-break:break-all}
            .status-badge{padding:3px 8px;border-radius:12px;font-size:.75rem;font-weight:600}
            .status-unused{background:#dcfce7;color:#059669}
            .status-used{background:#fee2e2;color:#dc2626}
            .status-expired{background:#fef3c7;color:#d97706}
            .empty{text-align:center;color:#6b7280;padding:24px;font-size:.9rem}
            .tabs{display:flex;gap:4px;margin-bottom:16px;background:#f1f5f9;padding:4px;border-radius:8px}
            .tab{padding:8px 16px;border:none;background:transparent;border-radius:6px;cursor:pointer;font-size:.85rem;font-weight:500;color:#64748b}
            .tab.active{background:#fff;color:#1a1a2e;box-shadow:0 1px 3px rgba(0,0,0,0.1)}
            .info{color:#6b7280;font-size:.85rem;text-align:center;margin-top:12px}
            .stats{display:flex;gap:16px;justify-content:center;margin-bottom:20px;flex-wrap:wrap}
            .stat-item{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 20px;text-align:center}
            .stat-num{font-size:1.5rem;font-weight:700;color:#1a1a2e}
            .stat-label{font-size:.75rem;color:#64748b;margin-top:2px}
            .toolbar{display:flex;gap:10px;margin-bottom:16px;align-items:center;flex-wrap:wrap}
            .search-input{padding:8px 12px;border:2px solid #e0e0e0;border-radius:8px;font-size:.9rem;width:220px}
            .search-input:focus{border-color:#2563eb;outline:none}
            .pagination{display:flex;gap:8px;justify-content:center;align-items:center;margin-top:16px}
            .page-btn{padding:6px 14px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;font-size:.85rem;color:#475569}
            .page-btn:hover{background:#f1f5f9}
            .page-btn.active{background:#2563eb;color:#fff;border-color:#2563eb}
            .page-btn:disabled{opacity:0.4;cursor:default}
            .page-info{font-size:.85rem;color:#64748b}
        </style></head><body><div class="container"><h1>🔑 激活码管理</h1>
            <div class="section">
                <div class="section-title">📦 生成激活码</div>
                <div class="form">
                    <input type="text" class="input" id="prefix" value="VTTS" placeholder="前缀" style="width:100px">
                    <input type="number" class="input" id="days" value="${LICENSE_VALIDITY_DAYS}" placeholder="有效期天数" min="1" max="365" style="width:100px">
                    <input type="number" class="input" id="count" value="1" placeholder="数量" min="1" max="50" style="width:80px">
                    <button class="btn" id="generateBtn">生成激活码</button>
                </div>
                <div class="result" id="result"></div>
            </div>
            <div class="section">
                <div class="section-title">🔒 修改管理密码</div>
                <div class="form">
                    <input type="password" class="input" id="oldPassword" placeholder="旧密码" style="width:160px">
                    <input type="password" class="input" id="newPassword" placeholder="新密码（至少4位）" style="width:200px">
                    <button class="btn" id="changePwdBtn">修改密码</button>
                </div>
                <div id="pwdMsg" style="font-size:.85rem;margin-top:4px"></div>
            </div>
            <div class="section">
                <div class="section-title">📋 激活码列表</div>
                <div class="stats" id="stats"></div>
                <div class="toolbar">
                    <input type="text" class="search-input" id="searchInput" placeholder="搜索激活码...">
                </div>
                <div class="tabs">
                    <button class="tab active" data-tab="all">全部</button>
                    <button class="tab" data-tab="unused">未使用</button>
                    <button class="tab" data-tab="used">已使用</button>
                    <button class="tab" data-tab="expired">已过期</button>
                </div>
                <div id="codeTable"></div>
                <div class="pagination" id="pagination"></div>
                <button class="btn btn-sm" id="refreshBtn" style="margin-top:12px">🔄 刷新列表</button>
            </div>
            <div class="info">${getKV(env) ? '✅ 使用 KV 持久化存储' : '⚠️ 内存存储，重启后记录丢失。建议绑定 KV。'}</div>
        </div>
        <script>
            const pwd = '${pwd.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}';
            const epwd = encodeURIComponent(pwd);
            let allCodes = [];
            let currentTab = 'all';
            let currentPage = 1;
            const PAGE_SIZE = 15;
            let searchKeyword = '';

            async function loadList() {
                try {
                    const resp = await fetch('/admin?pwd=' + epwd + '&action=list');
                    allCodes = await resp.json();
                } catch(e) {
                    allCodes = [];
                }
                renderStats();
                currentPage = 1;
                renderTable();
            }

            function getStatus(c) {
                if (c.used) return 'used';
                if (Date.now() > c.expiry) return 'expired';
                return 'unused';
            }

            function renderStats() {
                const total = allCodes.length;
                const used = allCodes.filter(c => c.used).length;
                const expired = allCodes.filter(c => !c.used && Date.now() > c.expiry).length;
                const unused = allCodes.filter(c => !c.used && Date.now() <= c.expiry).length;
                document.getElementById('stats').innerHTML = 
                    '<div class="stat-item"><div class="stat-num">' + total + '</div><div class="stat-label">总计</div></div>' +
                    '<div class="stat-item"><div class="stat-num" style="color:#059669">' + unused + '</div><div class="stat-label">未使用</div></div>' +
                    '<div class="stat-item"><div class="stat-num" style="color:#dc2626">' + used + '</div><div class="stat-label">已使用</div></div>' +
                    '<div class="stat-item"><div class="stat-num" style="color:#d97706">' + expired + '</div><div class="stat-label">已过期</div></div>';
            }

            function getFilteredList() {
                let list = allCodes;
                if (currentTab === 'unused') list = allCodes.filter(c => !c.used && Date.now() <= c.expiry);
                else if (currentTab === 'used') list = allCodes.filter(c => c.used);
                else if (currentTab === 'expired') list = allCodes.filter(c => !c.used && Date.now() > c.expiry);
                if (searchKeyword) {
                    const kw = searchKeyword.toLowerCase();
                    list = list.filter(c => c.code.toLowerCase().includes(kw));
                }
                return list;
            }

            function renderTable() {
                const filteredList = getFilteredList();
                const totalPages = Math.ceil(filteredList.length / PAGE_SIZE) || 1;
                if (currentPage > totalPages) currentPage = totalPages;
                const start = (currentPage - 1) * PAGE_SIZE;
                const pageList = filteredList.slice(start, start + PAGE_SIZE);

                if (filteredList.length === 0) {
                    document.getElementById('codeTable').innerHTML = '<div class="empty">暂无记录</div>';
                    document.getElementById('pagination').innerHTML = '';
                    return;
                }

                const rows = pageList.map(c => {
                    const status = getStatus(c);
                    const statusText = status === 'unused' ? '未使用' : status === 'used' ? '已使用' : '已过期';
                    const statusClass = status === 'unused' ? 'status-unused' : status === 'used' ? 'status-used' : 'status-expired';
                    const expiryDate = new Date(c.expiry).toLocaleString('zh-CN');
                    const createDate = new Date(c.createdAt).toLocaleString('zh-CN');
                    const usedDate = c.usedAt ? new Date(c.usedAt).toLocaleString('zh-CN') : '-';
                    return '<tr>' +
                        '<td>' + c.code + '</td>' +
                        '<td>' + c.days + '天</td>' +
                        '<td>' + createDate + '</td>' +
                        '<td>' + expiryDate + '</td>' +
                        '<td><span class="status-badge ' + statusClass + '">' + statusText + '</span></td>' +
                        '<td>' + usedDate + '</td>' +
                        '<td><button class="btn btn-sm" style="background:#dc2626" onclick="deleteCode(\'' + c.code + '\')">删除</button></td>' +
                        '</tr>';
                }).join('');

                document.getElementById('codeTable').innerHTML = 
                    '<table><thead><tr><th>激活码</th><th>期限</th><th>创建时间</th><th>有效期至</th><th>状态</th><th>使用时间</th><th>操作</th></tr></thead><tbody>' + rows + '</tbody></table>';

                // 翻页
                let pageHtml = '<span class="page-info">共 ' + filteredList.length + ' 条，' + totalPages + ' 页</span>';
                pageHtml += '<button class="page-btn" ' + (currentPage <= 1 ? 'disabled' : '') + ' onclick="goPage(' + (currentPage - 1) + ')">上一页</button>';
                for (let i = 1; i <= totalPages; i++) {
                    if (totalPages <= 7 || i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                        pageHtml += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" onclick="goPage(' + i + ')">' + i + '</button>';
                    } else if (i === currentPage - 2 || i === currentPage + 2) {
                        pageHtml += '<span class="page-info">...</span>';
                    }
                }
                pageHtml += '<button class="page-btn" ' + (currentPage >= totalPages ? 'disabled' : '') + ' onclick="goPage(' + (currentPage + 1) + ')">下一页</button>';
                document.getElementById('pagination').innerHTML = pageHtml;
            }

            window.goPage = function(p) {
                const totalPages = Math.ceil(getFilteredList().length / PAGE_SIZE) || 1;
                if (p < 1 || p > totalPages) return;
                currentPage = p;
                renderTable();
                document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
            };

            // 搜索
            document.getElementById('searchInput').addEventListener('input', function() {
                searchKeyword = this.value.trim();
                currentPage = 1;
                renderTable();
            });

            // 切换 Tab
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    currentTab = this.dataset.tab;
                    currentPage = 1;
                    renderTable();
                });
            });

            // 生成激活码
            document.getElementById('generateBtn').addEventListener('click', async function() {
                const btn = this;
                btn.disabled = true;
                btn.textContent = '生成中...';
                const prefix = document.getElementById('prefix').value || 'VTTS';
                const days = parseInt(document.getElementById('days').value) || ${LICENSE_VALIDITY_DAYS};
                const count = parseInt(document.getElementById('count').value) || 1;
                try {
                    const resp = await fetch('/admin?pwd=' + epwd, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prefix, count, days })
                    });
                    const data = await resp.json();
                    document.getElementById('result').innerHTML = data.codes.map(c => {
                        const parts = c.split('-');
                        const expiryTs = parseInt(parts[parts.length - 2], 36);
                        const expiryDate = new Date(expiryTs).toLocaleString('zh-CN');
                        return '<div class="code-box">' + c + '</div><div style="text-align:center;color:#6b7280;font-size:.85rem;margin-bottom:12px">有效期至：' + expiryDate + '（' + days + '天）</div>';
                    }).join('');
                    loadList();
                } catch(e) {
                    document.getElementById('result').innerHTML = '<div class="code-box" style="background:#fef2f2;border-color:#dc2626">生成失败</div>';
                }
                btn.disabled = false;
                btn.textContent = '生成激活码';
            });

            // 修改密码
            document.getElementById('changePwdBtn').addEventListener('click', async function() {
                const btn = this;
                const oldPassword = document.getElementById('oldPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const msg = document.getElementById('pwdMsg');
                if (!newPassword || newPassword.length < 4) {
                    msg.innerHTML = '<span style="color:#dc2626">新密码至少需要4位</span>';
                    return;
                }
                btn.disabled = true;
                btn.textContent = '修改中...';
                try {
                    const resp = await fetch('/admin?pwd=' + epwd + '&action=change-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ oldPassword, newPassword })
                    });
                    const data = await resp.json();
                    if (data.success) {
                        msg.innerHTML = '<span style="color:#059669">✅ 密码修改成功，下次登录请使用新密码</span>';
                        document.getElementById('oldPassword').value = '';
                        document.getElementById('newPassword').value = '';
                    } else {
                        msg.innerHTML = '<span style="color:#dc2626">❌ ' + (data.error || '修改失败') + '</span>';
                    }
                } catch(e) {
                    msg.innerHTML = '<span style="color:#dc2626">修改失败，请重试</span>';
                }
                btn.disabled = false;
                btn.textContent = '修改密码';
            });

            // 删除激活码
            window.deleteCode = async function(code) {
                if (!confirm('确定要删除激活码「' + code + '」吗？此操作不可恢复。')) return;
                try {
                    const resp = await fetch('/admin?pwd=' + epwd + '&action=delete-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: code })
                    });
                    const data = await resp.json();
                    if (data.success) {
                        loadList();
                    } else {
                        alert('删除失败：' + (data.error || '未知错误'));
                    }
                } catch(e) {
                    alert('删除失败，请重试');
                }
            };

            // 刷新
            document.getElementById('refreshBtn').addEventListener('click', loadList);

            // 初始加载
            loadList();
        </script></body></html>`;
        return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    if (path === "/v1/audio/speech") {
        try {
            const contentType = request.headers.get("content-type") || "";
            
            // 处理文件上传
            if (contentType.includes("multipart/form-data")) {
                return await handleFileUpload(request, env);
            }
            
            // 许可证检查
            const licenseToken = request.headers.get('X-License-Token') || '';
            const deviceId = request.headers.get('X-Device-Id') || '';
            const licenseInfo = await loadLicenseToken(env, licenseToken);
            if (!licenseInfo || licenseInfo.deviceId !== deviceId) {
                return new Response(JSON.stringify({ error: { message: '请先激活使用权限', type: 'license_required' } }), {
                    status: 403, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }
            if (licenseInfo.expiry && Date.now() > licenseInfo.expiry) {
                return new Response(JSON.stringify({ error: { message: '您的使用权限已到期，请续费', type: 'license_expired' } }), {
                    status: 403, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
                });
            }

            // 处理JSON请求（原有功能）
            const requestBody = await request.json();
            const {
                input,
                voice = "zh-CN-XiaoxiaoNeural",
                speed = '1.0',
                volume = '0',
                pitch = '0',
                style = "general"
            } = requestBody;

            let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
            let numVolume = parseInt(String(parseFloat(volume) * 100));
            let numPitch = parseInt(pitch);
            const response = await getVoice(
                input,
                voice,
                rate >= 0 ? `+${rate}%` : `${rate}%`,
                numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
                numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
                style,
                "audio-24khz-48kbitrate-mono-mp3"
            );

            return response;

        } catch (error) {
            console.error("Error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "edge_tts_error"
                }
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }
    }

    // 默认返回 404
    return new Response("Not Found", { status: 404 });
}

async function handleOptions(request) {
    return new Response(null, {
        status: 204,
        headers: {
            ...makeCORSHeaders(),
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "Authorization"
        }
    });
}

// 添加延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 优化文本分块函数
function optimizedTextSplit(text, maxChunkSize = 1500) {
    const chunks = [];
    const sentences = text.split(/[。！？\n]/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) continue;
        
        // 如果单个句子就超过最大长度，按字符分割
        if (trimmedSentence.length > maxChunkSize) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            
            // 按字符分割长句子
            for (let i = 0; i < trimmedSentence.length; i += maxChunkSize) {
                chunks.push(trimmedSentence.slice(i, i + maxChunkSize));
            }
        } else if ((currentChunk + trimmedSentence).length > maxChunkSize) {
            // 当前块加上新句子会超过限制，先保存当前块
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = trimmedSentence;
        } else {
            // 添加到当前块
            currentChunk += (currentChunk ? '。' : '') + trimmedSentence;
        }
    }
    
    // 添加最后一个块
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks.filter(chunk => chunk.length > 0);
}

// 批量处理音频块
async function processBatchedAudioChunks(chunks, voiceName, rate, pitch, volume, style, outputFormat, batchSize = 3, delayMs = 1000) {
    const audioChunks = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const batchPromises = batch.map(async (chunk, index) => {
            try {
                // 为每个请求添加小延迟，避免同时发送
                if (index > 0) {
                    await delay(index * 200);
                }
                return await getAudioChunk(chunk, voiceName, rate, pitch, volume, style, outputFormat);
            } catch (error) {
                console.error(`处理音频块失败 (批次 ${Math.floor(i/batchSize) + 1}, 块 ${index + 1}):`, error);
                throw error;
            }
        });
        
        try {
            const batchResults = await Promise.all(batchPromises);
            audioChunks.push(...batchResults);
            
            // 批次间延迟
            if (i + batchSize < chunks.length) {
                await delay(delayMs);
            }
        } catch (error) {
            console.error(`批次处理失败:`, error);
            throw error;
        }
    }
    
    return audioChunks;
}

async function getVoice(text, voiceName = "zh-CN-XiaoxiaoNeural", rate = '+0%', pitch = '+0Hz', volume = '+0%', style = "general", outputFormat = "audio-24khz-48kbitrate-mono-mp3") {
    try {
        // 文本预处理
        const cleanText = text.trim();
        if (!cleanText) {
            throw new Error("文本内容为空");
        }
        
        // 如果文本很短，直接处理
        if (cleanText.length <= 1500) {
            const audioBlob = await getAudioChunk(cleanText, voiceName, rate, pitch, volume, style, outputFormat);
            const audioBuffer = await audioBlob.arrayBuffer();
            return new Response(audioBuffer, {
                headers: {
                    "Content-Type": "audio/mpeg",
                    "Content-Length": String(audioBuffer.byteLength),
                    ...makeCORSHeaders()
                }
            });
        }

        // 优化的文本分块
        const chunks = optimizedTextSplit(cleanText, 1500);
        
        // 检查分块数量，防止超过CloudFlare限制
        if (chunks.length > 40) {
            throw new Error(`文本过长，分块数量(${chunks.length})超过限制。请缩短文本或分批处理。`);
        }
        
        console.log(`文本已分为 ${chunks.length} 个块进行处理`);

        // 批量处理音频块，控制并发数量和频率
        const audioChunks = await processBatchedAudioChunks(
            chunks, 
            voiceName, 
            rate, 
            pitch, 
            volume, 
            style, 
            outputFormat,
            3,  // 每批处理3个
            800 // 批次间延迟800ms
        );

        // 将音频片段拼接起来
        const concatenatedAudio = new Blob(audioChunks, { type: 'audio/mpeg' });
        const audioBuffer = await concatenatedAudio.arrayBuffer();
        return new Response(audioBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": String(audioBuffer.byteLength),
                ...makeCORSHeaders()
            }
        });

    } catch (error) {
        console.error("语音合成失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: error.message || String(error),
                type: "api_error",
                param: `${voiceName}, ${rate}, ${pitch}, ${volume}, ${style}, ${outputFormat}`,
                code: "edge_tts_error"
            }
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }
}



//获取单个音频数据（增强错误处理和重试机制）
async function getAudioChunk(text, voiceName, rate, pitch, volume, style, outputFormat = 'audio-24khz-48kbitrate-mono-mp3', maxRetries = 3) {
    const retryDelay = 500; // 重试延迟500ms
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const endpoint = await getEndpoint();
            const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;
            
            // 处理文本中的延迟标记
            let m = text.match(/\[(\d+)\]\s*?$/);
            let slien = 0;
            if (m && m.length == 2) {
                slien = parseInt(m[1]);
                text = text.replace(m[0], '');
            }
            
            // 验证文本长度
            if (!text.trim()) {
                throw new Error("文本块为空");
            }
            
            if (text.length > 2000) {
                throw new Error(`文本块过长: ${text.length} 字符，最大支持2000字符`);
            }
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": endpoint.t,
                    "Content-Type": "application/ssml+xml",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                    "X-Microsoft-OutputFormat": outputFormat
                },
                body: getSsml(text, voiceName, rate, pitch, volume, style, slien)
            });

            if (!response.ok) {
                const errorText = await response.text();
                
                // 根据错误类型决定是否重试
                if (response.status === 429) {
                    // 频率限制，需要重试
                    if (attempt < maxRetries) {
                        console.log(`频率限制，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`请求频率过高，已重试${maxRetries}次仍失败`);
                } else if (response.status >= 500) {
                    // 服务器错误，可以重试
                    if (attempt < maxRetries) {
                        console.log(`服务器错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`Edge TTS服务器错误: ${response.status} ${errorText}`);
                } else {
                    // 客户端错误，不重试
                    throw new Error(`Edge TTS API错误: ${response.status} ${errorText}`);
                }
            }

            return await response.blob();
            
        } catch (error) {
            if (attempt === maxRetries) {
                // 最后一次重试失败
                throw new Error(`音频生成失败（已重试${maxRetries}次）: ${error.message}`);
            }
            
            // 如果是网络错误或其他可重试错误
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log(`网络错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                await delay(retryDelay * (attempt + 1));
                continue;
            }
            
            // 其他错误直接抛出
            throw error;
        }
    }
}

// XML文本转义函数
function escapeXmlText(text) {
    return text
        .replace(/&/g, '&amp;')   // 必须首先处理 &
        .replace(/</g, '&lt;')    // 处理 <
        .replace(/>/g, '&gt;')    // 处理 >
        .replace(/"/g, '&quot;')  // 处理 "
        .replace(/'/g, '&apos;'); // 处理 '
}

function getSsml(text, voiceName, rate, pitch, volume, style, slien = 0) {
    // 对文本进行XML转义
    const escapedText = escapeXmlText(text);
    
    // 从 voiceName 提取语言代码 (如 zh-CN, en-US)
    const langMatch = voiceName.match(/^([a-z]{2}-[A-Z]{2})/);
    const lang = langMatch ? langMatch[1] : 'en-US';
    
    // 只有中文语音支持 style 属性，非中文语音的 style 会被忽略
    const isChineseVoice = voiceName.startsWith('zh-CN');
    
    // 日志：记录实际使用的 style 参数
    console.log(`[getSsml] voice=${voiceName}, style=${style}, isChinese=${isChineseVoice}, styleApplied=${isChineseVoice}`);
    
    let slien_str = '';
    if (slien > 0) {
        slien_str = `<break time="${slien}ms" />`
    }
    
    if (isChineseVoice) {
        return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="${lang}"> 
                    <voice name="${voiceName}"> 
                        <mstts:express-as style="${style}" styledegree="2.0" role="default"> 
                            <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${escapedText}</prosody> 
                        </mstts:express-as> 
                        ${slien_str}
                    </voice> 
                </speak>`;
    } else {
        return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="${lang}"> 
                    <voice name="${voiceName}"> 
                        <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${escapedText}</prosody> 
                        ${slien_str}
                    </voice> 
                </speak>`;
    }
}

async function getEndpoint() {
    const now = Date.now() / 1000;

    if (tokenInfo.token && tokenInfo.expiredAt && now < tokenInfo.expiredAt - TOKEN_REFRESH_BEFORE_EXPIRY) {
        return tokenInfo.endpoint;
    }

    // 获取新token
    const endpointUrl = "https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0";
    const clientId = crypto.randomUUID().replace(/-/g, "");

    try {
        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: {
                "Accept-Language": "zh-Hans",
                "X-ClientVersion": "4.0.530a 5fe1dc6c",
                "X-UserId": "0f04d16a175c411e",
                "X-HomeGeographicRegion": "zh-Hans-CN",
                "X-ClientTraceId": clientId,
                "X-MT-Signature": await sign(endpointUrl),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": "0",
                "Accept-Encoding": "gzip"
            }
        });

        if (!response.ok) {
            throw new Error(`获取endpoint失败: ${response.status}`);
        }

        const data = await response.json();
        const jwt = data.t.split(".")[1];
        const decodedJwt = JSON.parse(atob(jwt));

        tokenInfo = {
            endpoint: data,
            token: data.t,
            expiredAt: decodedJwt.exp
        };

        return data;

    } catch (error) {
        console.error("获取endpoint失败:", error);
        // 如果有缓存的token，即使过期也尝试使用
        if (tokenInfo.token) {
            console.log("使用过期的缓存token");
            return tokenInfo.endpoint;
        }
        throw error;
    }
}


function makeCORSHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        "Access-Control-Max-Age": "86400"
    };
}

async function hmacSha256(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
    return new Uint8Array(signature);
}

async function base64ToBytes(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function bytesToBase64(bytes) {
    return btoa(String.fromCharCode.apply(null, bytes));
}

function uuid() {
    return crypto.randomUUID().replace(/-/g, "");
}

async function sign(urlStr) {
    const url = urlStr.split("://")[1];
    const encodedUrl = encodeURIComponent(url);
    const uuidStr = uuid();
    const formattedDate = dateFormat();
    const bytesToSign = `MSTranslatorAndroidApp${encodedUrl}${formattedDate}${uuidStr}`.toLowerCase();
    const decode = await base64ToBytes("oik6PdDdMnOXemTbwvMn9de/h9lFnfBaCWbGMMZqqoSaQaqUOqjVGm5NqsmjcBI1x+sS9ugjB55HEJWRiFXYFw==");
    const signData = await hmacSha256(decode, bytesToSign);
    const signBase64 = await bytesToBase64(signData);
    return `MSTranslatorAndroidApp::${signBase64}::${formattedDate}::${uuidStr}`;
}

function dateFormat() {
    const formattedDate = (new Date()).toUTCString().replace(/GMT/, "").trim() + " GMT";
    return formattedDate.toLowerCase();
}

// 处理文件上传的函数
async function handleFileUpload(request, env) {
    try {
        const formData = await request.formData();
        const license = formData.get('license') || '';
        const deviceId = formData.get('deviceId') || '';
        const licenseInfo = await loadLicenseToken(env, license);
        if (!licenseInfo || licenseInfo.deviceId !== deviceId) {
            return new Response(JSON.stringify({ error: { message: '请先激活使用权限', type: 'license_required' } }), {
                status: 403, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }
        if (licenseInfo.expiry && Date.now() > licenseInfo.expiry) {
            return new Response(JSON.stringify({ error: { message: '您的使用权限已到期，请续费', type: 'license_expired' } }), {
                status: 403, headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }
        const file = formData.get('file');
        const voice = formData.get('voice') || 'zh-CN-XiaoxiaoNeural';
        const speed = formData.get('speed') || '1.0';
        const volume = formData.get('volume') || '0';
        const pitch = formData.get('pitch') || '0';
        const style = formData.get('style') || 'general';

        // 验证文件
        if (!file) {
            return new Response(JSON.stringify({
                error: {
                    message: "未找到上传的文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "missing_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件类型
        if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
            return new Response(JSON.stringify({
                error: {
                    message: "不支持的文件类型，请上传txt文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "invalid_file_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件大小（限制为500KB）
        if (file.size > 500 * 1024) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件大小超过限制（最大500KB）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "file_too_large"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 读取文件内容
        const text = await file.text();
        
        // 验证文本内容
        if (!text.trim()) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件内容为空",
                    type: "invalid_request_error",
                    param: "file",
                    code: "empty_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 文本长度限制（10000字符）
        if (text.length > 10000) {
            return new Response(JSON.stringify({
                error: {
                    message: "文本内容过长（最大10000字符）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "text_too_long"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 处理参数格式，与原有逻辑保持一致
        let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
        let numVolume = parseInt(String(parseFloat(volume) * 100));
        let numPitch = parseInt(pitch);

        // 调用TTS服务
        return await getVoice(
            text,
            voice,
            rate >= 0 ? `+${rate}%` : `${rate}%`,
            numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
            numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
            style,
            "audio-24khz-48kbitrate-mono-mp3"
        );

    } catch (error) {
        console.error("文件上传处理失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: "文件处理失败",
                type: "api_error",
                param: null,
                code: "file_processing_error"
            }
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }
}


