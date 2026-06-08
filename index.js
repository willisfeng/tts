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
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6575743893665209"
     crossorigin="anonymous"></script>
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
    </style>
</head>
<body>
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
                'header.feature3': 'Completely Free',
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
                'header.feature3': '完全免费',
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

        // 表单提交处理
        document.getElementById('ttsForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const voice = document.getElementById('voice').value;
            const speed = document.getElementById('speed').value;
            const pitch = document.getElementById('pitch').value;
            const style = document.getElementById('style').value;
            
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
                    
                    response = await fetch('/v1/audio/speech', {
                        method: 'POST',
                        body: formData
                    });
                }
                
                if (!response.ok) {
                    const errorData = await response.json();
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

export default {
    async fetch(request, env, ctx) {
        return handleRequest(request);
    }
};

async function handleRequest(request) {
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

    if (path === "/v1/audio/speech") {
        try {
            const contentType = request.headers.get("content-type") || "";
            
            // 处理文件上传
            if (contentType.includes("multipart/form-data")) {
                return await handleFileUpload(request);
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
    
    // 只有中文语音支持 style 属性，其他语言不需要
    const isChineseVoice = voiceName.startsWith('zh-CN');
    
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
async function handleFileUpload(request) {
    try {
        const formData = await request.formData();
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


