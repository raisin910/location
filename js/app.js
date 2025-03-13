// app.js - アプリケーションのメインファイル
document.addEventListener('DOMContentLoaded', initApp);

// グローバル変数
let isLogging = false;
let loggingInterval = null;
let locationData = [];
let deviceId = '';

// アプリケーションの初期化
function initApp() {
    UI.initElements();
    Storage.loadSettings();
    Storage.loadStoredData();
    
    // イベントリスナーの登録
    document.getElementById('startBtn').addEventListener('click', startLogging);
    document.getElementById('stopBtn').addEventListener('click', stopLogging);
    document.getElementById('sendDataBtn').addEventListener('click', sendData);
    document.getElementById('downloadBtn').addEventListener('click', downloadData);
    document.getElementById('showMapBtn').addEventListener('click', showOnMap); // 追加
    document.getElementById('closeMapBtn').addEventListener('click', Map.closeMap); // 追加
    
    document.getElementById('deviceId').addEventListener('change', Storage.saveSettings);
    document.getElementById('interval').addEventListener('change', Storage.saveSettings);
    document.getElementById('sheetUrl').addEventListener('change', Storage.saveSettings);
    
    UI.log('アプリが初期化されました');
}

// ロギングの開始
function startLogging() {
    if (isLogging) return;
    
    if (!document.getElementById('deviceId').value) {
        UI.updateStatus('エラー: デバイスIDを入力してください。', true);
        return;
    }
    
    // 入力値の検証
    const interval = parseInt(document.getElementById('interval').value);
    if (isNaN(interval) || interval < 10) {
        UI.updateStatus('エラー: 間隔は10秒以上を指定してください。', true);
        return;
    }
    
    // 設定を保存
    Storage.saveSettings();
    
    // 状態の更新
    isLogging = true;
    UI.updateLoggingState(true);
    
    // 最初の位置情報取得
    Geolocation.getLocation();
    
    // 定期的な位置情報取得を設定
    loggingInterval = setInterval(Geolocation.getLocation, interval * 1000);
    
    UI.updateStatus(`ロギング中: ${interval}秒間隔`);
    UI.log(`ロギングを開始しました（間隔: ${interval}秒）`);
}

// ロギングの停止
function stopLogging() {
    if (!isLogging) return;
    
    // インターバルをクリア
    clearInterval(loggingInterval);
    
    // 状態の更新
    isLogging = false;
    UI.updateLoggingState(false);
    
    UI.updateStatus('ロギング停止済み');
    UI.log('ロギングを停止しました');
}

// データの送信
function sendData() {
    if (locationData.length === 0) {
        UI.updateStatus('送信するデータがありません。', true);
        return;
    }
    
    const sheetUrl = document.getElementById('sheetUrl').value.trim();
    if (!sheetUrl) {
        UI.updateStatus('エラー: スプレッドシートURLを入力してください。', true);
        return;
    }
    
    UI.updateStatus('データ送信中...');
    UI.log(`${locationData.length}件のデータを送信中...`);
    
    // データ送信用のオブジェクト
    const dataToSend = {
        deviceId: deviceId,
        locations: locationData
    };
    
    console.log('送信URL:', sheetUrl);
    console.log('送信データ:', dataToSend);
    
    // no-corsモードでテスト
    fetch(sheetUrl, {
        method: 'POST',
        mode: 'no-cors', // CORSエラーを回避するためのテスト
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
        // no-corsモードではレスポンスの中身にアクセスできないので、成功と仮定
        console.log('レスポンス受信(詳細不明):', response);
        UI.log(`データを送信しました (${locationData.length}件) - 応答の詳細は不明`);
        UI.updateStatus(`${locationData.length}件のデータを送信しました`);
        
        // 送信が完了したらデータをクリア
        locationData = [];
        Storage.saveDataToStorage();
        
        document.getElementById('sendDataBtn').disabled = true;
        document.getElementById('downloadBtn').disabled = true;
        document.getElementById('showMapBtn').disabled = true;
    })
    .catch(error => {
        console.error('送信エラー詳細:', error);
        UI.updateStatus(`送信エラー: ${error.message}`, true);
        UI.log(`送信エラー: ${error.message} - データはローカルに保存されています`);
        
        // エラー時にはデータダウンロードを推奨
        UI.log('「データをダウンロード」ボタンを使用してデータを保存できます');
    });
}

// データをJSONファイルとしてダウンロード
function downloadData() {
    if (locationData.length === 0) {
        UI.updateStatus('ダウンロードするデータがありません。', true);
        return;
    }
    
    const dataStr = JSON.stringify({
        deviceId: deviceId,
        exportTime: new Date().toISOString(),
        locations: locationData
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `location_data_${deviceId}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    UI.updateStatus(`${locationData.length}件のデータをダウンロードしました`);
    UI.log(`データをJSONファイルとしてダウンロードしました (${locationData.length}件)`);
}

// 地図表示関数
function showOnMap() {
    if (locationData.length === 0) {
        UI.updateStatus('表示するデータがありません。', true);
        return;
    }
    
    Map.showLocations(locationData);
    UI.updateStatus('地図にデータを表示しました');
}
