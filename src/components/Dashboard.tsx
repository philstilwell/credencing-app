/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, memo, useCallback, useMemo } from 'react';
import { EpistemicData, EpistemicArchetype } from '../types';
import { Target, Eye, User, Brain, AlertTriangle, Activity } from 'lucide-react';

interface DashboardProps {
  data: EpistemicData;
  onChange: (data: EpistemicData) => void;
}

const Dashboard = memo(function Dashboard({ data, onChange }: DashboardProps) {
  const calcError = Math.abs(data.perceivedEvidence - data.objectiveEvidence);
  const coreIrrationality = Math.abs(data.assignedCredence - data.perceivedEvidence);
  const omega = (1 - data.deepRationality) * 0.25;

  // Fragility: High when credence is far from evidence OR on the absolute edge of the uncertainty bounds
  const fragility = useMemo(() => {
    const distFromCenter = Math.abs(data.assignedCredence - data.perceivedEvidence);
    const normalizedDist = distFromCenter / (omega || 0.01);
    const skillBonus = data.deepRationality * 0.4;
    return Math.min(1, Math.max(0, (normalizedDist * 0.6) + (coreIrrationality * 1.5) - skillBonus));
  }, [data, coreIrrationality, omega]);
  
  // Archetype logic
  let archetype: EpistemicArchetype = 'Standard Agent';
  if (data.deepRationality > 0.85 && calcError < 0.02 && coreIrrationality < 0.02) {
    archetype = 'Ideal Agent';
  } else if (data.deepRationality > 0.8 && coreIrrationality > 0.15) {
    archetype = 'Biased Expert';
  } else if (data.deepRationality < 0.3 && coreIrrationality < 0.05) {
    archetype = 'Honest Novice';
  } else {
    const omega = (1 - data.deepRationality) * 0.25; // Simple probability spread equivalent
    if (coreIrrationality > omega) {
      archetype = 'Epistemic Delusion';
    }
  }

  const update = useCallback((key: keyof EpistemicData, val: number) => {
    onChange({ ...data, [key]: val });
  }, [data, onChange]);

  const setPreset = useCallback((preset: EpistemicData) => {
    onChange(preset);
  }, [onChange]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      {/* Archetype Quick-Actions */}
      <div className="space-y-3">
        <h3 className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Agent Archetypes</h3>
        <div className="flex flex-wrap gap-2">
          <PresetButton 
            label="The Sage" 
            onClick={() => setPreset({ objectiveEvidence: 0.5, perceivedEvidence: 0.5, assignedCredence: 0.5, deepRationality: 0.9 })}
            active={archetype === 'Ideal Agent'}
          />
          <PresetButton 
            label="Honest Novice" 
            onClick={() => setPreset({ objectiveEvidence: 0.5, perceivedEvidence: 0.5, assignedCredence: 0.5, deepRationality: 0.2 })}
            active={archetype === 'Honest Novice'}
          />
          <PresetButton 
            label="Biased Expert" 
            onClick={() => setPreset({ objectiveEvidence: 0.3, perceivedEvidence: 0.3, assignedCredence: 0.7, deepRationality: 0.85 })}
            active={archetype === 'Biased Expert'}
          />
          <PresetButton 
            label="Delusion" 
            onClick={() => setPreset({ objectiveEvidence: 0.5, perceivedEvidence: 0.5, assignedCredence: 0.9, deepRationality: 0.2 })}
            active={archetype === 'Epistemic Delusion'}
          />
        </div>
      </div>

      {/* Scenario Overlays */}
      <div className="space-y-3 border-t border-white/5 pt-4">
        <h3 className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Practical Scenarios</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setPreset({ objectiveEvidence: 0.8, perceivedEvidence: 0.2, assignedCredence: 0.2, deepRationality: 0.4 })}
            className="px-2 py-1 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded text-[9px] text-slate-400 transition-colors"
          >
            "The Gaslight"
          </button>
          <button 
            onClick={() => setPreset({ objectiveEvidence: 0.5, perceivedEvidence: 0.5, assignedCredence: 0.95, deepRationality: 0.9 })}
            className="px-2 py-1 bg-white/5 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 rounded text-[9px] text-slate-400 transition-colors"
          >
            "Academic Dogma"
          </button>
          <button 
            onClick={() => setPreset({ objectiveEvidence: 0.6, perceivedEvidence: 0.55, assignedCredence: 0.55, deepRationality: 0.95 })}
            className="px-2 py-1 bg-white/5 hover:bg-green-500/10 border border-white/5 hover:border-green-500/30 rounded text-[9px] text-slate-400 transition-colors"
          >
            "Strict Empiricism"
          </button>
        </div>
      </div>

      {/* Archetype Badge */}
      <div className={`glass-panel p-6 border flex flex-col gap-1 ${
        archetype === 'Ideal Agent' ? 'border-blue-500/50 text-blue-300' :
        archetype === 'Biased Expert' ? 'border-orange-500/50 text-orange-400' :
        archetype === 'Honest Novice' ? 'border-green-500/50 text-green-400' :
        archetype === 'Epistemic Delusion' ? 'border-red-500/50 text-red-500 animate-pulse' :
        'border-white/10 text-slate-400'
      }`}>
        <div className="text-[9px] uppercase font-bold tracking-[0.2em] opacity-50 mb-1">Archetype Profile</div>
        <div className="text-2xl font-light tracking-tight flex items-center gap-2">
          {archetype}
          {archetype === 'Epistemic Delusion' && <AlertTriangle size={18} className="text-red-500" />}
        </div>
      </div>

      {/* Sliders Container */}
      <div className="glass-panel p-8 space-y-7 border-white/5 bg-white/[0.01]">
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-4">Primary Anchors</h2>
        
        <div className="space-y-1">
          <SliderField 
            label="Objective Evidence (E₀)" 
            value={data.objectiveEvidence} 
            onChange={(v) => update('objectiveEvidence', v)}
            color="accent-blue-500"
            icon={<Target size={14} className="opacity-50" />}
          />
          <p className="text-[10px] text-slate-500 pl-6 italic leading-relaxed">The raw data available in reality.</p>
        </div>

        <div className="space-y-1">
          <SliderField 
            label="Balance of Evidence (Eₚ)" 
            value={data.perceivedEvidence} 
            onChange={(v) => update('perceivedEvidence', v)}
            color="accent-blue-400"
            icon={<Eye size={14} className="opacity-50" />}
          />
          <p className="text-[10px] text-slate-500 pl-6 italic leading-relaxed">What the agent's mind identifies as true.</p>
        </div>

        <div className="space-y-1">
          <SliderField 
            label="Assigned Credence (Cₐ)" 
            value={data.assignedCredence} 
            onChange={(v) => update('assignedCredence', v)}
            color="accent-white"
            icon={<User size={14} className="opacity-50" />}
          />
          <p className="text-[10px] text-slate-500 pl-6 italic leading-relaxed">The degree of belief the agent adopts.</p>
        </div>

        <div className="space-y-1 border-t border-white/5 pt-4">
          <SliderField 
            label="Deep Rationality (Sᴅ)" 
            value={data.deepRationality} 
            onChange={(v) => update('deepRationality', v)}
            color="accent-yellow-400"
            icon={<Brain size={14} className="opacity-50" />}
          />
          <p className="text-[10px] text-slate-500 pl-6 italic leading-relaxed">The quality of the agent's algorithmic tools.</p>
        </div>
      </div>

      {/* Numerical Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard 
          label="Error (ΔE)" 
          value={`${(calcError * 100).toFixed(0)}%`} 
          color={calcError > 0.1 ? 'text-orange-400' : 'text-slate-300'}
        />
        <MetricCard 
          label="Bias (IC)" 
          value={`${(coreIrrationality * 100).toFixed(0)}%`} 
          color={coreIrrationality > 0.1 ? 'text-red-500' : 'text-slate-300'}
        />
        <MetricCard 
          label="Fragility" 
          value={`${(fragility * 100).toFixed(0)}%`} 
          color={fragility > 0.5 ? 'text-red-400' : fragility > 0.25 ? 'text-yellow-400' : 'text-green-400'}
        />
      </div>

      {/* Epistemic Diagnostics */}
      <div className="glass-panel p-6 space-y-4 border-white/5 bg-black/20">
        <h3 className="text-[9px] uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
          <Activity size={10} /> State Assessment
        </h3>
        <p className="text-[11px] text-slate-300 leading-relaxed italic">
          {coreIrrationality > 0.15 ? (
            <span className="text-red-400">Critical affective override detected. The subject is actively ignoring their own perceived evidence. </span>
          ) : coreIrrationality > 0.05 ? (
            <span className="text-orange-300">Minor doxastic slippage. Emotional or social factors are beginning to tug at the belief anchor. </span>
          ) : (
            <span className="text-green-400/80">Belief is tethered to perception. The subject is operating in good faith. </span>
          )}
          
          {calcError > 0.1 ? (
            <span className="text-blue-300">High epistemic fog suggests the algorithmic toolkit is either insufficient or unapplied. </span>
          ) : (
            <span className="text-slate-400">Low epistemic error indicates a functional bridge between reality and the mind. </span>
          )}

          {fragility > 0.4 ? (
            <span className="text-red-300 block mt-2 border-l-2 border-red-500/50 pl-2">System alert: High fragility detected. The doxastic state is unstable and prone to abrupt collapse or fundamentalism.</span>
          ) : (
            <span className="text-slate-500 block mt-2">Doxastic stability is within safe parameters.</span>
          )}
        </p>
      </div>
    </div>
  );
});

function PresetButton({ label, onClick, active }: { label: string; onClick: () => void; active: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border ${
        active 
          ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
          : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10 hover:text-slate-300'
      }`}
    >
      {label}
    </button>
  );
}

const SliderField = memo(function SliderField({ label, value, onChange, color, icon }: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void;
  color: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400">
        <span className="flex items-center gap-2">{icon} {label}</span>
        <span className="text-white">{(value).toFixed(3)}</span>
      </div>
      <div className="relative h-1 w-full bg-white/5 rounded-full">
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.001" 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        <div className="absolute top-0 bottom-0 left-0 bg-blue-500/30 rounded-full" style={{ width: `${value * 100}%` }}></div>
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all pointer-events-none" 
          style={{ left: `calc(${value * 100}% - 8px)` }}
        ></div>
      </div>
    </div>
  );
});

export default Dashboard;

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-panel p-4 flex flex-col justify-center border-white/5">
      <span className="text-[10px] uppercase text-blue-400 font-bold mb-1 tracking-widest">{label}</span>
      <span className={`text-2xl font-light ${color}`}>{value}</span>
    </div>
  );
}
