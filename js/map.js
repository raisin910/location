// map.js - 地図表示関連の機能
const Map = {
  map: null,
  markers: [],
  
  // 地図の初期化
  initMap: function() {
    const mapDiv = document.getElementById('map');
    this.map = new google.maps.Map(mapDiv, {
      zoom: 15,
      center: { lat: 35.6812, lng: 139.7671 }, // 東京駅をデフォルト表示
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  },
  
  // 位置情報データを地図上に表示
  showLocations: function(locations) {
    if (!this.map) this.initMap();
    
    // 既存のマーカーをクリア
    this.clearMarkers();
    
    if (locations.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    
    // 各位置情報にマーカーを配置
    locations.forEach((loc, index) => {
      const position = {
        lat: loc.latitude,
        lng: loc.longitude
      };
      
      // マーカーを作成
      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: `位置 ${index + 1} (${new Date(loc.timestamp).toLocaleString()})`,
        label: `${index + 1}`
      });
      
      // 情報ウィンドウを作成
      const infoContent = `
        <div style="padding: 10px;">
          <h3 style="margin-top: 0;">位置 ${index + 1}</h3>
          <p>日時: ${new Date(loc.timestamp).toLocaleString()}</p>
          <p>緯度: ${loc.latitude.toFixed(6)}</p>
          <p>経度: ${loc.longitude.toFixed(6)}</p>
          <p>精度: ${loc.accuracy.toFixed(1)}m</p>
        </div>
      `;
      
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });
      
      // マーカークリックでinfoWindowを表示
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
      
      this.markers.push(marker);
      bounds.extend(position);
    });
    
    // すべてのマーカーが表示されるようにマップを調整
    this.map.fitBounds(bounds);
    
    // 単一のマーカーの場合はズームを調整
    if (locations.length === 1) {
      this.map.setZoom(16);
    }
    
    // マップコンテナを表示
    document.getElementById('mapContainer').style.display = 'block';
  },
  
  // マーカーをクリア
  clearMarkers: function() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];
  },
  
  // 地図を閉じる
  closeMap: function() {
    document.getElementById('mapContainer').style.display = 'none';
  }
};
