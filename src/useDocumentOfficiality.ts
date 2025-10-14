import { reactive, computed } from 'vue';

interface officiality {
  is: boolean | null
  outOfScope: boolean
  reason: string
}

enum docType {
  Ledger = 'ledger',
  CourtRuling = 'court-ruling',
  Record = 'record',
  Other = 'other',
}

// --- Nested State Interfaces ---

interface DocumentPaths {
  arrived: {
    directedToOfficial: boolean | null;
    refersToCase: boolean | null;
    workingMaterial: boolean | null;
  };
  notArrived: {
    docType: docType | null;
    readyForNotation: boolean | null;
    decisionAnnounced: boolean | null;
    riskdagRecord: boolean | null;
    approved: boolean | null;
    otherWorkingMaterial: boolean | null;
    dispatched: boolean | null;
    specificMatter: boolean | null;
    otherApproved: boolean | null;
    memoranda: boolean | null;
    documentArchived: boolean | null;
    settled: boolean | null;
  };
}

interface DocumentState {
  heldByAuthority: boolean | null;
  backupEtc: boolean | null;
  transferredWithinAuth: boolean | null;
  competition: boolean | null;
  hasArrived: boolean | null;
  paths: DocumentPaths;
}

// --- Initial State and Helper ---

const initialState: DocumentState = {
  heldByAuthority: null,
  backupEtc: null,
  transferredWithinAuth: null,
  competition: null,
  hasArrived: null,
  paths: {
    arrived: {
      directedToOfficial: null,
      refersToCase: null,
      workingMaterial: null,
    },
    notArrived: {
      docType: null,
      readyForNotation: null,
      decisionAnnounced: null,
      riskdagRecord: null,
      approved: null,
      otherWorkingMaterial: null,
      dispatched: null,
      specificMatter: null,
      otherApproved: null,
      memoranda: null,
      documentArchived: null,
      settled: null,
    },
  },
};

// A helper function for deep copying the initial paths for reset
function getInitialPaths(): DocumentPaths {
  return JSON.parse(JSON.stringify(initialState.paths));
}

// --- Classification Logic Function (Pure Logic) ---

// This function performs the core classification based on a static state snapshot
// It is the most critical part for isolated unit testing.
function classifyDocument(stateSnapshot: DocumentState): officiality | null {
  const { heldByAuthority, backupEtc, transferredWithinAuth, competition, hasArrived, paths } = stateSnapshot;

  // Initial exclusion/scope checks
  if (heldByAuthority === false) {
    return { is: false, outOfScope: false, reason: "Document must be held by authority or public body to be considered for officiality." };
  }
  if (backupEtc === true) {
    return { is: false, outOfScope: false, reason: "see Ch 2, art 13 ph 2 and 14 p. 1, 2, 3 for further information on this concrete matter." };
  }
  if (transferredWithinAuth === true) {
    return { is: null, outOfScope: true, reason: "see Ch 2 art 11 FPA for further information on this concrete matter." };
  }
  if (competition === true) {
    return { is: null, outOfScope: true, reason: "see Ch 2, art 9 ph 2 FPA for further information on this concrete matter." };
  }

  // --- Path: Document Has Arrived ---
  if (hasArrived === true) {
    const { directedToOfficial, refersToCase, workingMaterial } = paths.arrived;

    if (directedToOfficial === true) {
      if (refersToCase === true) {
        return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 9 FPA for further information on this concrete matter." };
      }
      if (refersToCase === false) {
        return { is: false, outOfScope: false, reason: "see Ch 2, art 8 FPA for further information on this concrete matter." };
      }
    } else if (directedToOfficial === false) {
      if (workingMaterial === true) {
        return { is: false, outOfScope: false, reason: "see Ch 2 art 12 ph 2 FPA for further information on this concrete matter." };
      }
      if (workingMaterial === false) {
        return { is: true, outOfScope: false, reason: "see Ch 2 art 4 and 9 FPA for further information on this concrete matter." };
      }
    }
  }

  // --- Path: Document Has NOT Arrived ---
  else if (hasArrived === false) {
    const { docType: docTypeChoice, readyForNotation, decisionAnnounced, riskdagRecord, approved, otherWorkingMaterial, dispatched, specificMatter, otherApproved, memoranda, documentArchived, settled } = paths.notArrived;

    switch (docTypeChoice) {
      case docType.Ledger:
        if (readyForNotation === true) {
          return { is: true, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 1 FPA for further information on this concrete matter." };
        }
        if (readyForNotation === false) {
          return { is: false, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 1 for further information on this concrete matter." };
        }
        break;

      case docType.CourtRuling:
        if (decisionAnnounced === true) {
          return { is: true, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 2 FPA for further information on this concrete matter." };
        }
        if (decisionAnnounced === false) {
          return { is: false, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 2 FPA for further information on this concrete matter." };
        }
        break;

      case docType.Record:
        if (riskdagRecord === false) {
          if (approved === true) {
            return { is: true, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 3 FPA for further information on this concrete matter." };
          }
          if (approved === false) {
            return { is: false, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 3 FPA for further information on this concrete matter." };
          }
          break;
        }
        if (riskdagRecord === null) {
          break;
        }

      // intended fall-through (if riskdagRecord is true)
      case docType.Other:
        if (otherWorkingMaterial === true) {
          return { is: false, outOfScope: false, reason: "see Ch 2, art 12 ph 2 FPA for further information on this concrete matter." };
        } else if (otherWorkingMaterial === null) {
          return null;
        }

        if (dispatched === true) {
          return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 10 ph. 1 for further information on this concrete matter." };
        } else if (dispatched === null) {
          return null;
        }

        if (specificMatter === true) {
          if (memoranda === true) {
            if (documentArchived === true) {
              return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 12 ph 1 FPA for further information on this concrete matter." };
            }
            if (documentArchived === false) {
              return { is: false, outOfScope: false, reason: "see Ch 2, art 4 and 12 ph 1 FPA for further information on this concrete matter." };
            }
          }
          if (memoranda === false) {
            if (settled === true) {
              return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 10 ph. 1 FPA for further information on this concrete matter." };
            }
            if (settled === false) {
              return { is: false, outOfScope: false, reason: "see Ch 2, art 4 and 10 FPA for further information on this concrete matter." };
            }
          }
        }
        if (specificMatter === false) {
          if (otherApproved === true) {
            return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 10 FPA for further information on this concrete matter." };
          }
          if (otherApproved === false) {
            return { is: false, outOfScope: false, reason: "see Ch 2, art 4 and 10 for further information on this concrete matter." };
          }
        }
        break;
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
    // Re-assign paths with a fresh copy
    state.paths = getInitialPaths();
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
export { classifyDocument, docType, type officiality, type DocumentState, type DocumentPaths };