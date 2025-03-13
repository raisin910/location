// storage.js - データ保存関連の機能
const Storage = {
    // 設定の保存
    saveSettings: function() {
        localStorage.setItem('deviceId', document.getElementById('deviceId').value);
        localStorage.setItem('interval', document.getElementById('interval').value);
        localStorage.setItem('sheetUrl', document.getElementById('sheetUrl').value);
        deviceId = document.getElementById('deviceId').value;
        UI.log('設定が保存されました');
    },
    
  // ローカルストレージにデータを保存
saveDataToStorage: function() {
    try {
        localStorage.setItem('locationData', JSON.stringify(locationData));
        document.getElementById('sendDataBtn').disabled = false;
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('showMapBtn').disabled = false; // 追加
    } catch (e) {
        UI.log('警告: ローカルストレージへの保存に失敗しました');
        console.error('Storage error:', e);
    }
},
    
    // 設定の読み込み
    loadSettings: function() {
        document.getElementById('deviceId').value = localStorage.getItem('deviceId') || '';
        document.getElementById('interval').value = localStorage.getItem('interval') || '60';
        document.getElementById('sheetUrl').value = localStorage.getItem('sheetUrl') || '';
        
        // ランダムなデバイスIDを生成（未設定の場合）
        if (!document.getElementById('deviceId').value) {
            document.getElementById('deviceId').value = 'device_' + Math.random().toString(36).substring(2, 10);
        }
        
        deviceId = document.getElementById('deviceId').value;
    },
    
   // ローカルストレージからデータを読み込む
loadStoredData: function() {
    try {
        const storedData = localStorage.getItem('locationData');
        if (storedData) {
            locationData = JSON.parse(storedData);
            
            if (locationData.length > 0) {
                document.getElementById('sendDataBtn').disabled = false;
                document.getElementById('downloadBtn').disabled = false;
                document.getElementById('showMapBtn').disabled = false; // 追加
                UI.log(`${locationData.length}件の保存データを読み込みました`);
            }
        }
    } catch (e) {
        console.error('Data loading error:', e);
    }
}
