/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EpistemicData {
  objectiveEvidence: number; // EO [0, 1]
  perceivedEvidence: number; // EP [0, 1]
  assignedCredence: number;  // CA [0, 1]
  deepRationality: number;   // SD [0, 1]
}

export interface EpistemicMetrics {
  calculationError: number; // ΔE = |EP - EO|
  coreIrrationality: number; // IC = |CA - EP|
  warrantedUncertaintyWidth: number; // ω ∝ f(1 - SD)
}

export type EpistemicArchetype = 'Ideal Agent' | 'Biased Expert' | 'Honest Novice' | 'Epistemic Delusion' | 'Standard Agent';
