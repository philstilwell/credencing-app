/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { EpistemicData } from '../types';

interface EpistemicChartProps {
  data: EpistemicData;
}

const EpistemicChart = memo(function EpistemicChart({ data }: EpistemicChartProps) {
  const R = 180; // Outer radius
  const cx = 200; // Center X
  const cy = 200; // Center Y

  // Map probability [0, 1] to angle [PI, 0]
  const getAngle = (p: number) => Math.PI * (1 - p);

  const getPos = (p: number, r: number) => {
    const angle = getAngle(p);
    return {
      x: cx + r * Math.cos(angle),
      y: cy - r * Math.sin(angle),
    };
  };

  const eoPos = useMemo(() => getPos(data.objectiveEvidence, R), [data.objectiveEvidence]);
  const epPos = useMemo(() => getPos(data.perceivedEvidence, R), [data.perceivedEvidence]);
  const caPos = useMemo(() => getPos(data.assignedCredence, R), [data.assignedCredence]);
  const skillRadius = R * data.deepRationality;
  const skillPos = useMemo(() => getPos(data.perceivedEvidence, skillRadius), [data.perceivedEvidence, skillRadius]);

  // Warranted uncertainty spread (omega)
  const omega = (1 - data.deepRationality) * (Math.PI / 4);
  
  // Better arc path for the warranted uncertainty (green area)
  const uncertaintyPath = useMemo(() => {
    const angle = getAngle(data.perceivedEvidence);
    const a1 = angle + omega;
    const a2 = angle - omega;
    
    // Ensure we don't go out of bounds [0, PI]
    const clampedA1 = Math.min(Math.PI, a1);
    const clampedA2 = Math.max(0, a2);
    
    const bx1 = cx + R * Math.cos(clampedA1);
    const by1 = cy - R * Math.sin(clampedA1);
    const bx2 = cx + R * Math.cos(clampedA2);
    const by2 = cy - R * Math.sin(clampedA2);

    return `M ${skillPos.x} ${skillPos.y} L ${bx1} ${by1} A ${R} ${R} 0 0 1 ${bx2} ${by2} Z`;
  }, [data.perceivedEvidence, omega, skillPos]);

  // Core Irrationality Path (Red Delta)
  const irrationalityPath = useMemo(() => {
    const aStart = getAngle(data.perceivedEvidence);
    const aEnd = getAngle(data.assignedCredence);
    
    const x1 = cx + R * Math.cos(aStart);
    const y1 = cy - R * Math.sin(aStart);
    const x2 = cx + R * Math.cos(aEnd);
    const y2 = cy - R * Math.sin(aEnd);
    
    const largeArc = Math.abs(aStart - aEnd) > Math.PI ? 1 : 0;
    const sweep = aStart > aEnd ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} ${sweep} ${x2} ${y2} Z`;
  }, [data.perceivedEvidence, data.assignedCredence]);

  return (
    <div className="relative w-full aspect-[400/240] max-w-[500px] mx-auto glass-panel border-white/5 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <svg viewBox="0 0 400 240" className="w-full h-full relative z-10 font-sans">
        {/* Background Grids */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={R * 0.8} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={cx} cy={cy} r={R * 0.6} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={cx} cy={cy} r={R * 0.4} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx={cx} cy={cy} r={R * 0.2} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Radial Axis Grid */}
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1={cx} y1={cy} x2={cx} y2={cy - R} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

        {/* Labels */}
        <text x={cx - R} y={cy + 15} className="fill-slate-500 text-[10px] font-mono" textAnchor="middle">0%</text>
        <text x={cx + R} y={cy + 15} className="fill-slate-500 text-[10px] font-mono" textAnchor="middle">100%</text>

        {/* Warranted Uncertainty (Green Arc) */}
        <path 
           d={uncertaintyPath} 
           fill="rgba(34, 197, 94, 0.25)" 
        />

        {/* Core Irrationality (Red Void) */}
        {Math.abs(data.assignedCredence - data.perceivedEvidence) > 0.01 && (
          <path 
            d={irrationalityPath} 
            fill="rgba(239, 68, 68, 0.35)" 
            style={{ filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.4))' }}
          />
        )}

        {/* Assigned Credence Line */}
        <line 
          x1={cx} y1={cy} 
          x2={caPos.x} y2={caPos.y} 
          stroke="#60a5fa" 
          strokeWidth="3" 
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 5px rgba(96, 165, 250, 0.5))' }}
        />

        {/* Perceived Evidence Notch */}
        <circle 
          cx={epPos.x} cy={epPos.y} r="4" 
          fill="white" 
          style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))' }}
        />

        {/* Bayesian Shadow (Ideal Position) */}
        <circle 
          cx={getPos(data.objectiveEvidence, R).x} 
          cy={getPos(data.objectiveEvidence, R).y} 
          r="8" 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.15)" 
          strokeWidth="1" 
          strokeDasharray="2 2"
        />

        {/* Objective Truth Chevron */}
        <path 
          d="M -6 -10 L 6 -10 L 0 0 Z"
          fill="#3b82f6" 
          transform={`translate(${eoPos.x}, ${eoPos.y}) rotate(${90 - (getAngle(data.objectiveEvidence) * 180 / Math.PI)})`}
          style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' }}
        />

        {/* Skill Depth Dot */}
        <circle 
          cx={skillPos.x} cy={skillPos.y} r="5" 
          fill="#facc15" 
          style={{ filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.5))' }}
        />
      </svg>

      {/* Legend inside chart area - simplified */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-[8px] uppercase tracking-[0.2em] text-slate-500 font-bold z-20">
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,1)]"></div> Objective Evidence</div>
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Balance of Evidence</div>
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_5px_rgba(250, 204, 21, 1)]"></div> Skill Depth</div>
      </div>
    </div>
  );
});

export default EpistemicChart;
