import React, { useState, useEffect } from 'react';
import { getVibrationUnit } from '@/hooks/useVibrationThresholds';

interface SensorInfo {
  id: string;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  thresholds: Record<string, number>;
  setThresholds: (next: Record<string, number>) => void;
  sensors: SensorInfo[]; // 센서 리스트를 props로 받음
}

export default function VibrationThresholdModal({
  open,
  onClose,
  thresholds,
  setThresholds,
  sensors,
}: Props) {
  const [inputs, setInputs] = useState<Record<string, number>>(thresholds);

  useEffect(() => {
    setInputs(thresholds);
  }, [open, thresholds]);

  const handleChange = (id: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const handleSave = () => {
    setThresholds(inputs);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.45)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '32px 28px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          textAlign: 'center',
          minWidth: 340,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          진동 위험값(임계값) 설정
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginBottom: 18,
          }}
        >
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'center',
              }}
            >
              <span
                style={{ minWidth: 110, textAlign: 'right', fontWeight: 600 }}
              >
                {sensor.name}
              </span>
              <input
                type="number"
                value={inputs[sensor.id] ?? ''}
                onChange={(e) => handleChange(sensor.id, e.target.value)}
                style={{
                  fontSize: 17,
                  padding: '7px 14px',
                  border: '1px solid #FB8B24',
                  borderRadius: 6,
                  width: 90,
                  textAlign: 'center',
                  background: '#f8fafc',
                  color: '#222',
                }}
                min={0}
              />
              <span style={{ minWidth: 40, color: '#FB8B24', fontWeight: 500 }}>
                {getVibrationUnit(sensor.id)}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            style={{
              background: '#2563eb',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              cursor: 'pointer',
            }}
            onClick={handleSave}
          >
            저장
          </button>
          <button
            style={{
              background: '#eee',
              color: '#333',
              fontWeight: 600,
              fontSize: 16,
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
