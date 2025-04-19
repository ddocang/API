import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: HTMLElement, options: MapOptions) => Map;
        LatLng: new (lat: number, lng: number) => LatLng;
        Marker: new (options: MarkerOptions) => Marker;
        Point: new (x: number, y: number) => Point;
        Size: new (width: number, height: number) => Size;
        InfoWindow: new (options: InfoWindowOptions) => InfoWindow;
        MapTypeId: {
          NORMAL: string;
          TERRAIN: string;
          SATELLITE: string;
          HYBRID: string;
        };
        Position: {
          TOP: number;
          TOP_LEFT: number;
          TOP_RIGHT: number;
          LEFT: number;
          CENTER: number;
          RIGHT: number;
          BOTTOM: number;
          BOTTOM_LEFT: number;
          BOTTOM_RIGHT: number;
        };
        Event: {
          addListener: (target: any, type: string, handler: Function) => void;
          removeListener: (
            target: any,
            type: string,
            handler: Function
          ) => void;
        };
        Animation: {
          BOUNCE: number;
          DROP: number;
        };
      };
    };
  }
}

interface Point {
  x: number;
  y: number;
  toString(): string;
  equals(point: Point): boolean;
  clone(): Point;
}

interface LatLng {
  lat(): number;
  lng(): number;
  toString(): string;
  equals(latlng: LatLng): boolean;
  clone(): LatLng;
  toPoint(): Point;
}

interface MapOptions {
  center: LatLng;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  mapTypeId?: string;
  draggable?: boolean;
  scrollWheel?: boolean;
}

interface Marker {
  setMap(map: Map | null): void;
  setPosition(position: LatLng): void;
  setAnimation(animation: number | null): void;
  getPosition(): LatLng;
  getMap(): Map | null;
}

interface MarkerOptions {
  position: LatLng;
  map?: Map;
  icon?: string | MarkerIcon;
  title?: string;
  animation?: number;
  clickable?: boolean;
  zIndex?: number;
}

interface Map {
  setCenter(latlng: LatLng): void;
  setZoom(level: number): void;
  panTo(latlng: LatLng): void;
  getCenter(): LatLng;
  getZoom(): number;
  destroy(): void;
}

interface Size {
  width: number;
  height: number;
  equals(size: Size): boolean;
  toString(): string;
}

interface InfoWindowOptions {
  content: string;
  position?: LatLng;
  maxWidth?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  disableAnchor?: boolean;
  pixelOffset?: Point;
  zIndex?: number;
}

interface InfoWindow {
  open(map: Map, anchor?: Marker): void;
  close(): void;
  setContent(content: string): void;
  setPosition(position: LatLng): void;
  setSize(size: Size): void;
  getMap(): Map | null;
}

interface MarkerIcon {
  content: string;
  size: Size;
  anchor: Point;
}

const Container = styled.section`
  width: 100%;
  height: 968px;
  background-color: #f2f2f2;
  padding: 0 clamp(1rem, 16.67vw, 320px);
  display: flex;
  align-items: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 1279px;
  height: 780px;
  background: #ffffff;
  border-radius: 36px;
  padding: 32px;
  display: flex;
  gap: 32px;
  margin: 0 auto;
`;

const InfoSection = styled.div`
  width: 534px;
  flex-shrink: 0;
`;

const SectionTitle = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title-area {
    span {
      font-family: 'Pretendard';
      font-size: 16px;
      color: #767676;
      display: block;
      margin-bottom: 4px;
    }

    h2 {
      font-family: 'Pretendard';
      font-weight: 600;
      font-size: 28px;
      color: #000000;
      margin: 0;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  transform: translateX(-30px);
  margin-top: 20px;
`;

const SearchInput = styled.input`
  width: 285px;
  height: 40px;
  padding: 0 15px;
  border: 2px solid #27afe9;
  border-radius: 20px;
  font-family: 'Pretendard';
  font-size: 16px;
  outline: none;
  text-align: center;

  &::placeholder {
    color: #999;
  }
`;

const StationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 16px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #27afe9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #1e8dbb;
  }
`;

const StationItem = styled.div<{ $isActive?: boolean }>`
  width: 100%;
  background: ${(props) => (props.$isActive ? '#27AFE9' : '#F9F9F9')};
  border-radius: 12px;
  padding: 24px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-align: left;
  color: ${(props) => (props.$isActive ? '#FFFFFF' : '#000000')};

  &:hover {
    background: ${(props) => (props.$isActive ? '#27AFE9' : '#f0f0f0')};
  }

  .station-name {
    font-family: 'Pretendard';
    font-weight: ${(props) => (props.$isActive ? '700' : '600')};
    font-size: 24px;
  }

  .station-details {
    height: ${(props) => (props.$isActive ? 'auto' : '0')};
    opacity: ${(props) => (props.$isActive ? '1' : '0')};
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    margin-top: ${(props) => (props.$isActive ? '16px' : '0')};

    .address-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

      p {
        font-family: 'Pretendard';
        font-size: 16px;
        margin: 0;
        opacity: 0.8;
        flex: 1;
        line-height: 1.4;
      }
    }
  }
`;

const InfoDetails = styled.div`
  display: flex;
  flex: 1;
  gap: 24px;

  div {
    display: flex;
    align-items: center;
    gap: 6px;

    span {
      font-family: 'Pretendard';
      font-size: 15px;

      &:first-child {
        opacity: 0.8;
      }
    }
  }
`;

const DirectionButton = styled.button`
  height: 36px;
  padding: 0 16px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  color: #27afe9;
  font-family: 'Pretendard';
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: #f0f0f0;
  }
`;

const MapArea = styled.div`
  flex: 1;
  height: 100%;
  background: #f9f9f9;
  border-radius: 24px;
  position: relative;
  overflow: hidden;

  #map {
    width: 100%;
    height: 100%;
    min-height: 716px;
    position: relative;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    pointer-events: none;
    z-index: 2;
  }
`;

interface Station {
  id: number;
  chrstn_nm: string;
  road_nm_addr: string;
  lotno_addr: string;
  ntsl_pc: string;
  la: string; // 위도
  lo: string; // 경도
  realTimeInfo?: {
    chrg_sttus: string;
    wait_vhcle_alge: number;
    tt_pressr: string;
    updt_dt: string;
  };
}

const MapSection = () => {
  const [activeStation, setActiveStation] = useState<number | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  let isInitialized = false;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 500;
  let initialMarker: any = null;
  let currentInfoWindow: any = null;

  // 수동으로 추가한 충전소 좌표 정보
  const manualCoordinates: { [key: string]: { la: string; lo: string } } = {
    '(JNK)수도권매립지 수소충전소': {
      la: '37.5947474',
      lo: '126.6273574',
    },
    '(유)유정에너지 목포수소충전소': {
      la: '34.8053074',
      lo: '126.3821504',
    },
  };

  // 주소 수정이 필요한 충전소 목록
  const addressCorrections: { [key: string]: string } = {
    '삼척 교동 수소충전복합스테이션': '강원 삼척시 뒷나루길 137',
    H국회수소충전소: '서울특별시 영등포구 국회대로 741',
  };

  useEffect(() => {
    // 서버사이드에서 실행되지 않도록 체크
    if (typeof window === 'undefined') return;

    const initializeMap = async () => {
      if (!mapContainerRef.current || !window.naver?.maps) return false;

      try {
        // 초기 좌표 직접 설정
        const initialLocation = {
          lat: 37.42405,
          lng: 126.88702,
        };

        const mapOptions = {
          center: new window.naver.maps.LatLng(
            initialLocation.lat,
            initialLocation.lng
          ),
          zoom: 16,
          zoomControl: true,
          zoomControlOptions: {
            position: (window.naver.maps as any).Position.TOP_RIGHT as number,
          },
          mapTypeId: window.naver.maps.MapTypeId.SATELLITE,
        };

        mapRef.current = new window.naver.maps.Map(
          mapContainerRef.current,
          mapOptions
        );

        // 초기 위치에 마커 추가
        const markerPosition = new window.naver.maps.LatLng(
          initialLocation.lat,
          initialLocation.lng
        );

        // 마커 아이콘 설정
        const markerIcon = {
          content: `
            <div style="
              width: 48px;
              height: 48px;
              background: rgba(255, 255, 255, 0.5);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              border: 2px solid rgba(255, 255, 255, 0.5);
            ">
              <div style="
                width: 36px;
                height: 36px;
                background: url('/images/ge_logo.png') no-repeat center center;
                background-size: contain;
              "></div>
            </div>`,
          size: new window.naver.maps.Size(48, 48),
          anchor: new window.naver.maps.Point(24, 24),
        } as MarkerIcon;

        // 마커 생성
        initialMarker = new window.naver.maps.Marker({
          position: markerPosition,
          map: mapRef.current,
          icon: markerIcon,
          animation: window.naver.maps.Animation.DROP,
          zIndex: 3,
        } as any);

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(initialMarker, 'click', () => {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }

          const infoWindow = new window.naver.maps.InfoWindow({
            content: `
              <div style="
                padding: 20px;
                min-width: 240px;
                font-family: 'Pretendard';
                border-radius: 16px;
                background: #FFFFFF;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
              ">
                <div style="
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                ">
                  <div style="
                    font-size: 14px;
                    color: #767676;
                  ">Location</div>
                  <div style="
                    font-size: 20px;
                    font-weight: 600;
                    color: #000000;
                    margin-bottom: 4px;
                  ">주식회사 지이 본사</div>
                  <div style="
                    font-size: 15px;
                    color: #333333;
                    line-height: 1.4;
                  ">경기도 광명시 일직로 43 광명역M클러스터</div>
                </div>
              </div>
            `,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            disableAnchor: true,
            pixelOffset: new window.naver.maps.Point(0, -20),
          });

          if (currentInfoWindow !== null && currentInfoWindow.getMap()) {
            currentInfoWindow.close();
            if (currentInfoWindow === infoWindow) {
              currentInfoWindow = null;
              return;
            }
          }

          infoWindow.open(mapRef.current, initialMarker);
          currentInfoWindow = infoWindow;

          // 지도 클릭 시 정보창 닫기
          window.naver.maps.Event.addListener(mapRef.current, 'click', () => {
            if (currentInfoWindow) {
              currentInfoWindow.close();
              currentInfoWindow = null;
            }
          });
        });

        return true;
      } catch (error) {
        console.error('지도 초기화 오류:', error);
        return false;
      }
    };

    const initializeMapWithRetry = async () => {
      if (isInitialized) return;

      let retryCount = 0;
      const tryInitialize = async () => {
        if (retryCount >= MAX_RETRIES) {
          console.error('최대 시도 횟수 초과');
          return;
        }

        console.log(`지도 초기화 시도 ${retryCount + 1}/${MAX_RETRIES}`);
        if (await initializeMap()) {
          isInitialized = true;
        } else {
          retryCount++;
          setTimeout(tryInitialize, RETRY_DELAY);
        }
      };

      tryInitialize();
    };

    initializeMapWithRetry();

    return () => {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      if (initialMarker) {
        initialMarker.setMap(null);
      }
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
      isInitialized = false;
    };
  }, []);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const operationResponse = await fetch('/api/chrstnList/operationInfo', {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_HYDROGEN_API_KEY || '',
          },
        });
        const operationData = await operationResponse.json();

        const currentResponse = await fetch('/api/chrstnList/currentInfo', {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_HYDROGEN_API_KEY || '',
          },
        });
        const currentData = await currentResponse.json();

        const realTimeData = currentData.reduce((acc: any, item: any) => {
          if (item.chrstn_nm) {
            acc[item.chrstn_nm] = {
              chrg_sttus: item.chrg_sttus,
              wait_vhcle_alge: item.wait_vhcle_alge,
              tt_pressr: item.tt_pressr,
              updt_dt: item.updt_dt,
            };
          }
          return acc;
        }, {});

        const allStations = operationData
          .map((station: any, index: number) => {
            // 수동 좌표 정보가 있는 경우 적용
            const manualCoords = manualCoordinates[station.chrstn_nm];
            if (!station.la || !station.lo) {
              if (manualCoords) {
                station.la = manualCoords.la;
                station.lo = manualCoords.lo;
              }
            }

            // 주소 수정이 필요한 경우 적용
            const correctedAddress = addressCorrections[station.chrstn_nm];
            if (correctedAddress) {
              station.road_nm_addr = correctedAddress;
            }

            return {
              id: index + 1,
              ...station,
              realTimeInfo: realTimeData[station.chrstn_nm] || {},
            };
          })
          .sort((a: Station, b: Station) => {
            if (a.chrstn_nm < b.chrstn_nm) return -1;
            if (a.chrstn_nm > b.chrstn_nm) return 1;
            return 0;
          });

        setStations(allStations);
        if (mapRef.current) {
          updateMarkers(allStations);
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    const filtered = stations.filter((station) => {
      const searchLower = searchTerm.toLowerCase().replace(/\s/g, '');
      const stationName = (station.chrstn_nm || '')
        .toLowerCase()
        .replace(/\s/g, '');
      const stationAddress = (station.road_nm_addr || station.lotno_addr || '')
        .toLowerCase()
        .replace(/\s/g, '');

      return (
        stationName.includes(searchLower) ||
        stationAddress.includes(searchLower)
      );
    });
    setFilteredStations(filtered);

    if (filtered.length > 0 && searchTerm) {
      const firstStation = filtered[0];
      handleStationClick(firstStation.id);
    }
  }, [searchTerm, stations]);

  useEffect(() => {
    // 현재 위치 가져오기
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('위치 정보를 가져오는데 실패했습니다:', error);
        },
        options
      );
    }
  }, []);

  const updateMarkers = (stations: Station[]) => {
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    stations.forEach((station) => {
      if (station.la && station.lo) {
        const position = new window.naver.maps.LatLng(
          parseFloat(station.la),
          parseFloat(station.lo)
        );

        const marker = new window.naver.maps.Marker({
          position: position,
          map: mapRef.current,
          title: station.chrstn_nm,
        });

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(marker, 'click', () => {
          handleStationClick(station.id);
        });

        markersRef.current.push(marker);
      }
    });
  };

  const handleStationClick = async (stationId: number) => {
    setActiveStation(activeStation === stationId ? null : stationId);

    const selectedStation = stations.find(
      (station) => station.id === stationId
    );
    if (!selectedStation || !mapRef.current) return;

    try {
      // 주소 정보 가져오기
      const address =
        selectedStation.road_nm_addr || selectedStation.lotno_addr;
      if (!address) {
        return;
      }

      // 네이버 지도 검색 API를 사용하여 주소 검색
      const encodedAddress = encodeURIComponent(address);
      fetch(`/api/geocode?query=${encodedAddress}`)
        .then((response) => response.json())
        .then((data) => {
          // meta 객체가 없는 경우 처리
          if (!data.meta) {
            console.error('API 응답에 메타 데이터가 없습니다:', data);
            return;
          }

          if (data.meta.totalCount === 0) {
            console.log('검색 결과가 없습니다:', address);
            return;
          }

          // 검색 결과가 없는 경우 처리
          if (!data.addresses || data.addresses.length === 0) {
            console.log('주소 정보가 없습니다:', address);
            return;
          }

          // 첫 번째 검색 결과의 좌표로 이동
          const item = data.addresses[0];
          const point = new window.naver.maps.LatLng(
            parseFloat(item.y),
            parseFloat(item.x)
          );

          // 지도 이동
          mapRef.current.setCenter(point);
          mapRef.current.setZoom(19);

          // 해당 위치에 마커 표시
          const marker = new window.naver.maps.Marker({
            position: point,
            map: mapRef.current,
            title: selectedStation.chrstn_nm,
          });

          // 기존 마커 제거
          markersRef.current.forEach((m) => m.setMap(null));
          markersRef.current = [marker];
        })
        .catch((error) => {
          console.error('지도 이동 중 오류 발생:', error);
        });
    } catch (error) {
      console.error('지도 이동 중 오류 발생:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDirectionClick = async (address: string) => {
    try {
      // 주소를 좌표로 변환
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(`/api/geocode?query=${encodedAddress}`);

      const data = await response.json();

      if (!data.addresses || data.addresses.length === 0) {
        console.error('주소를 찾을 수 없습니다.');
        return;
      }

      const destination = data.addresses[0];
      let naverMapUrl = 'https://map.naver.com/v5/directions';

      if (currentLocation) {
        // 출발지 (현재 위치)
        naverMapUrl += `/${currentLocation.lng},${currentLocation.lat},내위치`;
      } else {
        naverMapUrl += `/-/-/-`;
      }

      // 목적지 (충전소)
      naverMapUrl += `/${destination.x},${destination.y},${encodeURIComponent(
        address
      )}/-/car?c=14,0,0,0,dh`;

      window.open(naverMapUrl, '_blank');
    } catch (error) {
      console.error('길찾기 URL 생성 중 오류 발생:', error);

      // 오류 발생 시 기본 URL로 폴백
      const fallbackUrl = `https://map.naver.com/v5/directions/-/-/-/${encodeURIComponent(
        address
      )}/-/car?c=14,0,0,0,dh`;
      window.open(fallbackUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <Container>
        <Card>
          <div>데이터를 불러오는 중입니다...</div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <InfoSection>
          <SectionTitle>
            <div className="title-area">
              <span>Map</span>
              <h2>수소충전소 위치</h2>
            </div>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="충전소 검색"
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchContainer>
          </SectionTitle>
          <StationList>
            {(searchTerm ? filteredStations : stations).map((station) => (
              <StationItem
                key={station.id}
                $isActive={activeStation === station.id}
                onClick={() => handleStationClick(station.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleStationClick(station.id);
                  }
                }}
              >
                <div className="station-name">{station.chrstn_nm}</div>
                <div className="station-details">
                  <div className="address-row">
                    <p>{station.road_nm_addr || station.lotno_addr}</p>
                    <DirectionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDirectionClick(
                          station.road_nm_addr || station.lotno_addr
                        );
                      }}
                    >
                      길찾기
                    </DirectionButton>
                  </div>
                  <InfoDetails>
                    <div>
                      <span>판매가격</span>
                      <span>
                        {parseInt(station.ntsl_pc).toLocaleString()}원
                      </span>
                    </div>
                    <div>
                      <span>충전압력</span>
                      <span>
                        {station.realTimeInfo?.tt_pressr
                          ? `${Math.floor(
                              parseInt(station.realTimeInfo.tt_pressr) / 10
                            )} BAR`
                          : '-'}
                      </span>
                    </div>
                  </InfoDetails>
                </div>
              </StationItem>
            ))}
          </StationList>
        </InfoSection>
        <MapArea>
          <div ref={mapContainerRef} id="map" />
        </MapArea>
      </Card>
    </Container>
  );
};

export default MapSection;
