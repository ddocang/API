// 진동 그래프 카드 리스트 컴포넌트
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  VibrationGraphContainer,
  VibrationGraphCard,
  CustomTooltip,
} from '../styles';
import { colors } from '@/app/styles/colors';

interface VibrationDataPoint {
  time: string;
  value: number;
}

interface VibrationSensor {
  id: number;
  name: string;
  value: string;
  data: VibrationDataPoint[];
  detailedData: any[];
}

type ChartColorSet = {
  line: string;
  fill: string;
};

interface VibrationGraphsProps {
  vibrationSensors: VibrationSensor[];
  colorAssignments: Record<number, ChartColorSet>;
  handleGraphClick: (sensor: VibrationSensor) => void;
}

const VibrationGraphs: React.FC<VibrationGraphsProps> = ({
  vibrationSensors,
  colorAssignments,
  handleGraphClick,
}) => {
  return (
    <VibrationGraphContainer>
      {vibrationSensors.map((sensor) => (
        <VibrationGraphCard
          key={sensor.id}
          onClick={() => handleGraphClick(sensor)}
          style={{ cursor: 'pointer' }}
        >
          <h4>
            {sensor.name}
            <span className="status">정상</span>
          </h4>
          <div className="graph-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sensor.data}
                margin={{
                  top: 5,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id={`gradient-${sensor.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colorAssignments[sensor.id].line}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={colorAssignments[sensor.id].line}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={colors.chart.grid.line}
                  opacity={colors.chart.grid.opacity}
                />
                <ReferenceLine
                  y={0.5}
                  stroke="#04A777"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <ReferenceLine
                  y={1.0}
                  stroke="#FFD600"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <ReferenceLine
                  y={1.5}
                  stroke="#D90429"
                  strokeWidth={1}
                  strokeDasharray="4 2"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.chart.axis.line }}
                />
                <YAxis
                  domain={[0, 2]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.chart.axis.line }}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <CustomTooltip>
                          <div className="time">{label}</div>
                          <div className="value">
                            {Number(payload[0].value).toFixed(2)}g
                          </div>
                        </CustomTooltip>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colorAssignments[sensor.id].line}
                  strokeWidth={2}
                  fill={`url(#gradient-${sensor.id})`}
                  fillOpacity={1}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </VibrationGraphCard>
      ))}
    </VibrationGraphContainer>
  );
};

export default VibrationGraphs;
