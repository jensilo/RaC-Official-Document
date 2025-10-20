import { reactive, computed } from 'vue';

interface officiality {
  is: boolean | null
  outOfScope: boolean
  reason: string
}

enum docType {
  Ledger = 'ledger',
  CourtRuling = 'court-ruling',
  Memoranda = 'memoranda',
  Other = 'other',
}

interface DocumentState {
  heldByAuthority: boolean | null;
  docTypeChoice: docType | null;
  readyForNotation: boolean | null;
  decisionAnnounced: boolean | null;
  riskdagRecord: boolean | null;
  approved: boolean | null;
  dispatched: boolean | null;
  specificMatter: boolean | null;
  otherApproved: boolean | null;
  settled: boolean | null;
}

// --- Initial State and Helper ---

const initialState: DocumentState = {
  heldByAuthority: null,
  docTypeChoice: null,
  readyForNotation: null,
  decisionAnnounced: null,
  riskdagRecord: null,
  approved: null,
  dispatched: null,
  specificMatter: null,
  otherApproved: null,
  settled: null,
};

// --- Classification Logic Function (Pure Logic) ---

function genericReason(law: string): string {
  return `see ${law} for further information on this concrete matter.`
}

// This function performs the core classification based on a static state snapshot
// It is the most critical part for isolated unit testing.
function classifyDocument(stateSnapshot: DocumentState): officiality | null {
  const { heldByAuthority, docTypeChoice, readyForNotation, decisionAnnounced, riskdagRecord, approved, dispatched, specificMatter, otherApproved, settled } = stateSnapshot;

  // Initial exclusion/scope checks
  if (heldByAuthority === false) {
    return { is: false, outOfScope: false, reason: 'Document must be held by authority or public body (see Ch 2, art 4 FPA).' };
  }

  if (heldByAuthority === null) {
    return null;
  }

  if (docTypeChoice === docType.Ledger) {
    if (readyForNotation === true) {
      return { is: true, outOfScope: false, reason: genericReason('Ch 2, art 10 ph 2 p. 1 FPA') };
    } else if (readyForNotation === false) {
      return { is: false, outOfScope: false, reason: genericReason('Ch 2, art 10 ph 2 p. 1 FPA') };
    }
  }

  if (docTypeChoice === docType.CourtRuling) {
    if (decisionAnnounced === true) {
      return { is: true, outOfScope: false, reason: genericReason('Ch 2, art 10 ph 2 p. 2 FPA') };
    } else if (decisionAnnounced === false) {
      return { is: false, outOfScope: false, reason: genericReason('Ch 2, art 10 ph 2 p. 2 FPA') };
    }
  }

  if (docTypeChoice === docType.Memoranda) {
    if (riskdagRecord === true) {
      return { is: null, outOfScope: true, reason: genericReason('Ch 2, art 10 ph 3 FPA') }
    }

    if (approved === true) {
      return { is: true, outOfScope: false, reason: genericReason('Ch 2, art 10 ph 2 p. 3 FPA') };
    } else if (approved === false) {
      return { is: false, outOfScope: false, reason: genericReason('Ch 2, art 10 ph 2 p. 3 FPA') };
    }
  }

  if (docTypeChoice === docType.Other) {
    if (dispatched === true) {
      return { is: true, outOfScope: false, reason: genericReason('Ch 2, art 4 and 10 ph. 1 FPA') };
    } else if (dispatched === null) {
      return null;
    }

    if (specificMatter === true) {
      if (settled === true) {
        return { is: true, outOfScope: false, reason: genericReason('Ch 2, art 4 and 10 ph. 1 FPA') };
      } else if (settled === false) {
        return { is: false, outOfScope: false, reason: genericReason('Ch 2, art 4 and 10 FPA') };
      }
    } else if (specificMatter === false) {
      if (otherApproved === true) {
        return { is: true, outOfScope: false, reason: genericReason('Ch 2, art 4 and 10 FPA') };
      } else if (otherApproved === false) {
        return { is: false, outOfScope: false, reason: genericReason('Ch 2, art 4 and 10 FPA') };
      }
    }
  }

  return null;
}

// --- Composable: useDocumentOfficiality ---

export function useDocumentOfficiality() {
  const state = reactive<DocumentState>({ ...initialState });

  const documentOfficiality = computed<officiality | null>(() => {
    return classifyDocument(state);
  });

  function resetAll() {
    // Use Object.assign to reset the reactive object's properties, maintaining reactivity
    Object.assign(state, initialState);
  }

  // Also export the static interfaces and enums for consumers (e.g., tests)
  return {
    state,
    documentOfficiality,
    resetAll,
    docType,
    initialState
  };
}

// Export the pure logic function for easy unit testing without Vue's reactivity wrapper
export { classifyDocument, docType, type officiality, type DocumentState };