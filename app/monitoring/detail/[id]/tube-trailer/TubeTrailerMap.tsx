import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { tubeTrailerMockData } from './tubeTrailerMockData';

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
`;

const TubeTrailerMap = () => {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerRef = useRef<naver.maps.Marker | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!window.naver) return;

      const mapOptions: naver.maps.MapOptions = {
        center: new naver.maps.LatLng(37.5666805, 126.9784147),
        zoom: 14,
        mapTypeId: naver.maps.MapTypeId.HYBRID,
        zoomControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_LEFT,
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
          style: 2, // DROPDOWN_STYLE
        },
      };

      const mapElement = document.getElementById('map');
      if (!mapElement) return;

      const map = new naver.maps.Map(mapElement, mapOptions);
      mapRef.current = map;

      // 첫 번째 튜브 트레일러의 위치로 마커 생성
      if (tubeTrailerMockData.length > 0) {
        const firstTrailer = tubeTrailerMockData[0];
        const markerOptions: naver.maps.MarkerOptions = {
          position: new naver.maps.LatLng(firstTrailer.lat, firstTrailer.lng),
          map: map,
        };

        const marker = new naver.maps.Marker(markerOptions);
        markerRef.current = marker;
      }
    };

    initializeMap();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      mapRef.current = null;
    };
  }, []);

  return (
    <MapContainer>
      <div id="map" style={{ width: '100%', height: '100%' }} />
    </MapContainer>
  );
};

export default TubeTrailerMap;
