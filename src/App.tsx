/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ReactNode, useCallback } from 'react';
import { EpistemicData } from './types';
import EpistemicChart from './components/EpistemicChart';
import Dashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Terminal, Activity, UserCheck, ShieldAlert, Brain, UserMinus } from 'lucide-react';

type Tab = 'intro' | 'model' | 'explanation' | 'formalization';

export default function App() {
  const [data, setData] = useState<EpistemicData>({
    objectiveEvidence: 0.41,
    perceivedEvidence: 0.62,
    assignedCredence: 0.86,
    deepRationality: 0.60
  });

  const handleDataChange = useCallback((newData: EpistemicData) => {
    setData(newData);
  }, []);

  const [activeTab, setActiveTab] = useState<Tab>('intro');

  const getDynamicDescription = useCallback(() => {
    const calcError = Math.abs(data.perceivedEvidence - data.objectiveEvidence);
    const coreIrrationality = Math.abs(data.assignedCredence - data.perceivedEvidence);
    const isAbout = (val: number, target: number) => Math.abs(val - target) < 0.01;

    // Check Scenarios first
    if (isAbout(data.objectiveEvidence, 0.8) && isAbout(data.perceivedEvidence, 0.2) && isAbout(data.assignedCredence, 0.2) && isAbout(data.deepRationality, 0.4)) {
      return "The Gaslight: Objective reality (E₀) is high, but perceived evidence (Eₚ) has been suppressed or manipulated via social or authoritative pressure. The agent 'correctly' believes their false perception—the error is algorithmic (Deep Rationality deficit) rather than a failure of will.";
    }
    if (isAbout(data.objectiveEvidence, 0.5) && isAbout(data.perceivedEvidence, 0.5) && isAbout(data.assignedCredence, 0.95) && isAbout(data.deepRationality, 0.9)) {
      return "Academic Dogma: The agent's tools correctly identify the evidence as a coin-flip (0.5), yet they adopt an extreme credence (0.95). This is a pure failure of Core Rationality, where the intellect acts as a bodyguard for a structural paradigm or ideological identity.";
    }
    if (isAbout(data.objectiveEvidence, 0.6) && isAbout(data.perceivedEvidence, 0.55) && isAbout(data.assignedCredence, 0.55) && isAbout(data.deepRationality, 0.95)) {
      return "Strict Empiricism: High-resolution tracking of reality. The agent's perceived evidence and final credence are surgically aligned with the objective probabilistic state (E₀). This represents the target state of Bayesian alignment.";
    }

    // Check Archetypes
    if (data.deepRationality > 0.85 && calcError < 0.02 && coreIrrationality < 0.02) {
      return "Ideal Agent (The Sage): Maintains perfect alignment with a razor-sharp epistemic toolkit. The delta between reality, perception, and belief is minimized through disciplined application of algorithmic rigor.";
    }
    if (data.deepRationality > 0.8 && coreIrrationality > 0.15) {
      return "Biased Expert: Possesses the tools to see the truth (High Skill) but deliberately positions belief elsewhere (Low Will). This agent uses algorithmic agility to construct sophisticated rationalizations for pre-ordained conclusions.";
    }
    if (data.deepRationality < 0.3 && coreIrrationality < 0.05) {
      return "Honest Novice: Operates in good faith (High Will) but lacks the tools to resolve reality's 'epistemic fog' (Low Skill). They are aligned with their perception, even if that perception is blurry.";
    }
    
    const omega = (1 - data.deepRationality) * 0.25;
    if (coreIrrationality > omega) {
      return "Epistemic Delusion: The Doxastic Gap has collapsed. The agent's commitment (Cₐ) has drifted so far from their internal perception of evidence (Eₚ) that they are effectively in a state of self-induced delusion.";
    }

    return "Standard Agent: Operating within common cognitive bounds. Minor deviations represent standard human biases or biological noise, but the belief remains broadly tethered to the perceived evidence.";
  }, [data]);

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      <div className="atmospheric-bg"></div>
      <div className="glow-orb"></div>
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header Block spans full width above the grid for better alignment */}
        <header className="flex flex-col gap-6 pb-6">
          <div className="flex flex-col">
            <h1 className="text-4xl font-light tracking-tight text-white leading-none">
              Credencing: <span className="opacity-40">Visualizing Irrationality</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono mt-2 uppercase tracking-widest">
              Adventures in Epistemic Alignment
            </p>
          </div>
          
          <div className="flex flex-wrap gap-1 glass-panel p-1 border border-white/5 rounded-full w-fit">
            <TabButton 
              active={activeTab === 'intro'} 
              onClick={() => setActiveTab('intro')}
              icon={<Info size={14} />}
              label="Intro"
            />
            <TabButton 
              active={activeTab === 'model'} 
              onClick={() => setActiveTab('model')}
              icon={<Activity size={14} />}
              label="Interactive"
            />
            <TabButton 
              active={activeTab === 'explanation'} 
              onClick={() => setActiveTab('explanation')}
              icon={<Info size={14} />}
              label="Theory"
            />
            <TabButton 
              active={activeTab === 'formalization'} 
              onClick={() => setActiveTab('formalization')}
              icon={<Terminal size={14} />}
              label="Formalization"
            />
          </div>
        </header>

        {/* Main Application Grid Wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Left Column: Vision & Navigation */}
          <div className="lg:col-span-7 space-y-12">
            {/* View Port (Left Side Content) */}
            <main className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'intro' && (
                  <motion.div 
                    key="intro"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-12"
                  >
                    <div className="space-y-6">
                      <h2 className="text-4xl font-light tracking-tight text-white mb-2 underline decoration-blue-500/20 underline-offset-8">Why Study Credencing?</h2>
                      <p className="text-slate-100 text-lg leading-relaxed font-light">
                        Belief is not a binary toggle; it is a <span className="text-white font-medium italic underline decoration-blue-500/40 underline-offset-4">dynamic orientation</span> of the self toward the world. We call this process <span className="text-blue-400 font-bold tracking-wider">Credencing</span>.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="glass-panel p-6 space-y-4 border-white/20 bg-white/[0.04] shadow-xl">
                        <h3 className="text-lg font-light text-white flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div> Deep Rationality
                        </h3>
                        <p className="text-slate-200 text-xs leading-relaxed">
                          The <span className="text-blue-300 font-semibold underline decoration-blue-300/30 underline-offset-2">Skill</span> axis. Your algorithmic toolkit—math, logic, and probability to see through "epistemic fog."
                        </p>
                      </div>
                      <div className="glass-panel p-6 space-y-4 border-white/20 bg-white/[0.04] shadow-xl">
                        <h3 className="text-lg font-light text-white flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div> Core Rationality
                        </h3>
                        <p className="text-slate-200 text-xs leading-relaxed">
                          The <span className="text-red-400 font-semibold underline decoration-red-400/30 underline-offset-2">Will</span> axis. Your fortitude to align belief with what your mind sees as true.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'model' && (
                  <motion.div 
                    key="model"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <EpistemicChart data={data} />
                      <div className="glass-panel p-6 border-white/5 text-[13px] text-slate-200 serif-thought leading-relaxed bg-white/[0.03] shadow-inner min-h-[80px] flex items-center">
                         {getDynamicDescription()}
                      </div>
                    </div>

                    {/* Threshold Explanation Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/10">
                      <div className="p-4 bg-blue-500/[0.02] border border-blue-500/10 rounded-xl">
                        <h4 className="text-[9px] uppercase tracking-[0.2em] text-blue-400 font-black mb-2 flex items-center gap-2">
                           <Activity size={10} /> Standard Agent
                        </h4>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          Reasoning falls within a noise threshold. Minor deviations represent common biases.
                        </p>
                      </div>
                      <div className="p-4 bg-red-500/[0.04] border border-red-500/20 rounded-xl">
                        <h4 className="text-[9px] uppercase tracking-[0.2em] text-red-500 font-black mb-2 flex items-center gap-2">
                          <Terminal size={10} /> Delusion Threshold
                        </h4>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          Beyond 10%, the agent is no longer participating in rational discourse with themselves.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'explanation' && (
                  <motion.div 
                    key="explanation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-10"
                  >
                    <section className="space-y-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold block">The Analytical Distinction</span>
                      <h2 className="text-2xl font-light text-white leading-tight">Competence vs. Consistency</h2>
                      <p className="text-slate-400 leading-relaxed text-sm">
                        Historically, cognitive science has conflated algorithmic failures with affective overrides. This framework unbundles these concepts into two orthogonal dimensions.
                      </p>
                      <div className="space-y-6 pt-4">
                        <div className="border-l border-blue-500/30 pl-6 space-y-2">
                          <h3 className="text-white font-medium">1. Deep Rationality</h3>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            Exercise of tools of rationality, such as probability theory, statistics, and Bayesian analysis. Measures the presence of a well-calibrated toolkit.
                          </p>
                        </div>
                        <div className="border-l border-red-500/30 pl-6 space-y-2">
                          <h3 className="text-white font-medium">2. Core Rationality</h3>
                          <p className="text-slate-400 text-xs leading-relaxed">
                            Adoption of a degree of belief (credence) aligning with the Perceived Evidence. Deficits result in Core Irrationality, often driven by emotion.
                          </p>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                {activeTab === 'formalization' && (
                  <motion.div 
                    key="formalization"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8 pb-20"
                  >
                    <header className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-400">
                        <Terminal size={20} strokeWidth={1.5} />
                        <h1 className="text-[10px] uppercase tracking-[0.4em] font-bold">The Epistemic Formalism</h1>
                      </div>
                      <h2 className="text-3xl font-extralight tracking-tight text-white leading-tight">
                        Mapping the algorithmic gaps.
                      </h2>
                    </header>

                    <div className="space-y-12">
                      <section className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="h-[1px] w-8 bg-blue-500"></div>
                          <h3 className="text-xs uppercase tracking-widest text-white/60 font-bold">The Variable Set</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <VarDef sym="E₀" label="Objective Evidence" desc="The ground truth probability density in mind-independent reality (The Target)." />
                          <VarDef sym="Eₚ" label="Perceived Balance" desc="The agent's internal representation after algorithmic processing (The Lens)." />
                          <VarDef sym="Cₐ" label="Assigned Credence" desc="The final doxastic commitment adopted by the agent's will (The Anchor)." />
                          <VarDef sym="Sᴅ" label="Deep Rationality" desc="Resolution of inferential optics and statistical literacy (The Skill)." />
                        </div>
                      </section>

                      <section className="space-y-10">
                        <div className="flex items-center gap-3">
                          <div className="h-[1px] w-8 bg-blue-500"></div>
                          <h3 className="text-xs uppercase tracking-widest text-white/60 font-bold">The Axiom Stack</h3>
                        </div>
                        
                        <div className="space-y-12">
                          <div className="group space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline gap-4">
                                <span className="text-blue-400 font-mono text-xs">AXIOM I</span>
                                <code className="text-3xl text-white font-mono tracking-tighter">δ_ep = |Eₚ - E₀|</code>
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed border-l border-blue-500/20 pl-6">
                              <strong>The Epistemic Error.</strong> This is the "Algorithmic Gap." It measures the fidelity of the agent's internal optics. As <span className="text-white font-mono">Sᴅ</span> increases, <span className="text-white font-mono">δ_ep</span> approaches zero. It is a failure of <em>competence</em>.
                            </p>
                          </div>

                          <div className="group space-y-4">
                            <div className="flex items-baseline gap-4">
                              <span className="text-red-400 font-mono text-xs">AXIOM II</span>
                              <code className="text-3xl text-white font-mono tracking-tighter">δ_ic = |Cₐ - Eₚ|</code>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed border-l border-red-500/20 pl-6">
                              <strong>The Core Irrationality.</strong> This is the "Doxastic Gap." It measures the choice to defy one's own perception of evidence. It is a failure of <em>integrity</em>.
                            </p>
                          </div>

                          <div className="group space-y-4">
                            <div className="flex items-baseline gap-4">
                              <span className="text-green-400 font-mono text-xs">AXIOM III</span>
                              <code className="text-3xl text-white font-mono tracking-tighter">ω = (1 - S_D) * (π / 4)</code>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed border-l border-green-500/20 pl-6">
                              <strong>The Omega Variance.</strong> Represents the warranted uncertainty spread. Every agent is entitled to a range of healthy skepticism proportional to their own skill deficit. Rationality is not certainty; it is calibrated doubt.
                            </p>
                          </div>

                          <div className="group space-y-4">
                            <div className="flex items-baseline gap-4">
                              <span className="text-purple-400 font-mono text-xs">AXIOM IV</span>
                              <code className="text-3xl text-white font-mono tracking-tighter">Φ ∝ (δ_ic / S_D)</code>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed border-l border-purple-500/20 pl-6">
                              <strong>Epistemic Fragility.</strong> A second-order metric measuring the stability of a belief. High fragility (Φ) indicates a state that collapses under minimal evidence pressure or reduced emotional suppression.
                            </p>
                          </div>
                        </div>
                      </section>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>

          {/* Right Column: Controls & Secondary Context */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 pt-4">
            <AnimatePresence mode="wait">
              {activeTab === 'model' && (
                <motion.div 
                  key="model-controls"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Dashboard data={data} onChange={handleDataChange} />
                </motion.div>
              )}

              {activeTab === 'intro' && (
                <motion.div 
                  key="intro-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="glass-panel p-10 space-y-6 bg-blue-500/[0.06] border-blue-500/40 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Activity size={80} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-light text-white relative z-10">Unbundling Failure</h3>
                    <div className="space-y-4 text-slate-50 text-sm leading-relaxed relative z-10">
                      <p>
                        Traditional models fail to distinguish between the <strong>Honest Novice</strong> (who lacks tools) and the <strong>Biased Expert</strong> (who has tools but refuses to use them).
                      </p>
                      <p>
                        The intellect often serves merely as a bodyguard for affective identity.
                      </p>
                    </div>
                    <div className="pt-6">
                      <button 
                        onClick={() => setActiveTab('model')}
                        className="w-full px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-xl text-xs font-bold tracking-widest transition-all text-blue-400 flex items-center justify-center gap-3 uppercase"
                      >
                        Launch Simulator <Activity size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'explanation' && (
                <motion.div 
                  key="explanation-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <section className="space-y-6">
                    <h2 className="text-xl font-light text-white">Archetypes</h2>
                    <div className="grid grid-cols-1 gap-6">
                      <ArchetypeCard 
                        name="The Sage (Ideal Agent)" 
                        icon={<UserCheck size={16} className="text-green-400" />}
                        desc="Operates at the absolute frontier of rationality. Through disciplined Bayesian updating and a total lack of affective interference, the Sage ensures that their assigned credence remains surgically aligned with the objective probability density of the world. They possess both the analytical tools to see clearly and the moral courage to believe precisely what they see."
                        stats="SD > 0.85 | IC < 0.02"
                      />
                      <ArchetypeCard 
                        name="Honest Novice" 
                        icon={<Brain size={16} className="text-blue-400" />}
                        desc="Characterized by epistemic humility. While they lack the sophisticated statistical tools to narrow their 'epistemic fog' (ω), they maintain a high degree of integrity. They position their belief exactly where their limited perception points, admitting ignorance where it exists. They are rational in spirit, if not always in precision."
                        stats="SD < 0.3 | IC < 0.05"
                      />
                      <ArchetypeCard 
                        name="Biased Expert" 
                        icon={<ShieldAlert size={16} className="text-red-400" />}
                        desc="The most dangerous epistemic agent. This individual possesses high-resolution inferential optics but uses that intelligence exclusively to rationalize pre-ordained conclusions. Their intellect serves primarily as a bodyguard for their emotional identity, creating a massive delta between what they know and what they choose to believe."
                        stats="SD > 0.8 | IC > 0.15"
                      />
                      <ArchetypeCard 
                        name="Epistemic Delusion" 
                        icon={<UserMinus size={16} className="text-slate-500" />}
                        desc="A complete collapse of the credal structure. The agent lacks both the algorithmic ability to parse reality and the will to tether their belief to any perceived evidence. In this state, the assigned credence (Ca) drifts aimlessly or is anchored to pure desire, completely bypassing the filters of rational evaluation."
                        stats="IC > Threshold (ω)"
                      />
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'formalization' && (
                <motion.div 
                  key="formalization-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="space-y-8">
                    <div className="glass-panel p-8 flex flex-col justify-center gap-6 relative overflow-hidden bg-white/[0.01]">
                      <h2 className="serif-thought text-xl text-blue-100 relative z-10 leading-snug">"The Intellect as Bodyguard"</h2>
                      <p className="text-slate-400 text-[11px] leading-relaxed relative z-10 italic">
                        "Increased intelligence does not inherently cure bias; it often merely provides the agent with the algorithmic agility to construct sophisticated post-hoc rationalizations... The intellect serves merely as a bodyguard for affective identity."
                      </p>
                      <div className="pt-4 border-t border-white/5 relative z-10 text-center">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Phil Stilwell (2026)</span>
                      </div>
                    </div>

                    <div className="p-6 glass-panel border-white/5 bg-white/[0.02] rounded-xl space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Theoretical Derivation</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        These axioms describe a non-standard Bayesian landscape where the 'observer' is not a passive mirror, but a dynamic agent whose 'will' exerts a field-strength on the final credence (Ca). 
                      </p>
                    </div>

                    <a 
                      href="https://www.academia.edu/165572684/_A_Formal_Framework_for_Core_and_Deep_Rationality" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block group p-4 border border-blue-500/20 rounded-xl hover:bg-blue-500/5 transition-all text-center"
                    >
                      <span className="text-[10px] text-blue-400 font-mono uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Full Reference Paper →</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 flex justify-between items-center text-[10px] uppercase tracking-widest opacity-30 font-mono">
          <span>Session ID: 882-BETA</span>
          <div className="hidden md:flex gap-6">
            <span>Reflective Equilibrium: Stable</span>
            <span>© 2026 Epistemic Protocol</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        px-6 py-2 rounded-full flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-all
        ${active 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function VarDef({ sym, label, desc }: { sym: string; label: string; desc: string }) {
  return (
    <div className="glass-panel p-4 bg-white/2 border-white/5">
      <div className="text-white text-sm mb-1 font-light"><span className="text-blue-400 font-bold font-mono mr-2">{sym}</span> {label}</div>
      <div className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tight">{desc}</div>
    </div>
  );
}

function ArchetypeCard({ name, icon, desc, stats }: { name: string; icon: ReactNode; desc: string; stats: string }) {
  return (
    <div className="glass-panel p-5 bg-white/[0.01] border-white/5 hover:border-white/10 transition-colors space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{name}</h4>
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
      <div className="text-[9px] font-mono text-slate-600 bg-black/20 p-1.5 rounded w-fit uppercase tracking-tighter">
        {stats}
      </div>
    </div>
  );
}
