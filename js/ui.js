// ui.js - ユーザーインターフェース関連の機能
const UI = {
    // UI要素
    elements: {
        statusEl: null,
        startBtn: null,
        stopBtn: null,
        sendDataBtn: null,
        downloadBtn: null,
        deviceIdInput: null,
        intervalInput: null,
        sheetUrlInput: null,
        logContainer: null
    },
    
    // UI要素の初期化
    initElements: function() {
        this.elements.statusEl = document.getElementById('status');
        this.elements.startBtn = document.getElementById('startBtn');
        this.elements.stopBtn = document.getElementById('stopBtn');
        this.elements.sendDataBtn = document.getElementById('sendDataBtn');
        this.elements.downloadBtn = document.getElementById('downloadBtn');
        this.elements.deviceIdInput = document.getElementById('deviceId');
        this.elements.intervalInput = document.getElementById('interval');
        this.elements.sheetUrlInput = document.getElementById('sheetUrl');
        this.elements.logContainer = document.getElementById('logContainer');
    },
    
    // ロギング状態に応じてUIを更新
    updateLoggingState: function(isLogging) {
        this.elements.startBtn.disabled = isLogging;
        this.elements.stopBtn.disabled = !isLogging;
        this.elements.deviceIdInput.disabled = isLogging;
        this.elements.intervalInput.disabled = isLogging;
    },
    
    // ステータスの更新
    updateStatus: function(message, isError = false) {
        this.elements.statusEl.textContent = message;
        this.elements.statusEl.style.backgroundColor = isError ? '#ffebee' : '#eee';
        this.elements.statusEl.style.color = isError ? '#d32f2f' : '#333';
    },
    
    // ログの追加
    log: function(message) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.elements.logContainer.appendChild(logEntry);
        this.elements.logContainer.scrollTop = this.elements.logContainer.scrollHeight;
    }
};
