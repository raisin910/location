// geolocation.js - 位置情報関連の機能
const Geolocation = {
    // 位置情報の取得
    getLocation: function() {
        UI.updateStatus('位置情報を取得中...');
        
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };
        
        // このスコープを保存
        const self = this;
        
        // 位置情報APIの確認
        if (!navigator.geolocation) {
            UI.updateStatus('エラー: Geolocation APIをサポートしていません。', true);
            return;
        }
        
        // 位置情報の取得
        navigator.geolocation.getCurrentPosition(
            // 成功コールバック
            function(position) {
                const timestamp = new Date().toISOString();
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = position.coords.accuracy;
                
                const locationEntry = {
                    deviceId: deviceId,
                    timestamp: timestamp,
                    latitude: latitude,
                    longitude: longitude,
                    accuracy: accuracy
                };
                
                // データの追加
                locationData.push(locationEntry);
                
                // ローカルストレージにデータを保存
                Storage.saveDataToStorage();
                
                UI.updateStatus(`ロギング中: 最終取得 ${new Date().toLocaleTimeString()}`);
                UI.log(`位置: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (精度: ${accuracy.toFixed(1)}m)`);
            },
            // エラーコールバック
            function(error) {
                let errorMsg = '';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg = '位置情報の利用が許可されていません。';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg = '位置情報を取得できませんでした。';
                        break;
                    case error.TIMEOUT:
                        errorMsg = '位置情報の取得がタイムアウトしました。';
                        break;
                    default:
                        errorMsg = '不明なエラーが発生しました。';
                        break;
                }
                
                UI.updateStatus(`エラー: ${errorMsg}`, true);
                UI.log(`エラー: ${errorMsg}`);
            },
            options
        );
    }
};
