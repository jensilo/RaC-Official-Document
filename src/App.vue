<script setup lang="ts">
import { ref, computed } from 'vue';
import Alert from './Alert.vue';

interface officiality {
  is: boolean | null
  outOfScope: boolean
  reason: string
}

enum type {
  Ledger = 'ledger',
  CourtRuling = 'court-ruling',
  Record = 'record',
  Other = 'other',
}

const documentHeldByAuthority = ref<boolean | null>(null);
const documentBackupEtc = ref<boolean | null>(null);
const documentTransferredWithinAuth = ref<boolean | null>(null);
const documentCompetition = ref<boolean | null>(null);
const documentHasArrived = ref<boolean | null>(null);

// Path: The document has arrived to the authority
const documentDirectedToOfficial = ref<boolean | null>(null);
const documentRefersToCase = ref<boolean | null>(null);
const documentWorkingMaterial = ref<boolean | null>(null);

// Path: The document has NOT arrived to the authority
const documentType = ref<type | null>(null);

// Path: Ledger
const documentReadyForNotation = ref<boolean | null>(null);

// Path: CourtRuling
const documentDecisionAnnounced = ref<boolean | null>(null);

// Path: Record
const documentRiskdagRecord = ref<boolean | null>(null);
const documentApproved = ref<boolean | null>(null);

// Path: Other
const documentOtherWorkingMaterial = ref<boolean | null>(null);
const documentDispatched = ref<boolean | null>(null);
const documentSpecificMatter = ref<boolean | null>(null);
const documentOtherApproved = ref<boolean | null>(null);
const documentMemoranda = ref<boolean | null>(null);
const documentSettled = ref<boolean | null>(null);
const doucmentArchived = ref<boolean | null>(null);

const documentOfficiality = computed<officiality | null>(() => {
  if (documentHeldByAuthority.value === false) {
    return { is: false, outOfScope: false, reason: "Document must be held by authority or public body to be considered for officiality." };
  }

  if (documentBackupEtc.value === true) {
    return { is: false, outOfScope: false, reason: "see Ch 2, art 13 ph 2 and 14 p. 1, 2, 3 for further information on this concrete matter." };
  }

  if (documentTransferredWithinAuth.value === true) {
    return { is: null, outOfScope: true, reason: "see Ch 2 art 11 FPA for further information on this concrete matter." };
  }

  if (documentCompetition.value === true) {
    return { is: null, outOfScope: true, reason: "see Ch 2, art 9 ph 2 FPA for further information on this concrete matter." };
  }

  if (documentHasArrived.value === true) { // the document has arrived 
    if (documentDirectedToOfficial.value === true) { // the document is directed to an official

      if (documentRefersToCase.value === true) {
        return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 9 FPA for further information on this concrete matter." };
      }

      if (documentRefersToCase.value === false) {
        return { is: false, outOfScope: false, reason: "see Ch 2, art 8 FPA for further information on this concrete matter." };
      }

    } else if (documentDirectedToOfficial.value === false) { // the document is NOT directed to an official

      if (documentWorkingMaterial.value === true) {
        return { is: false, outOfScope: false, reason: "see Ch 2 art 12 ph 2 FPA for further information on this concrete matter." };
      }

      if (documentWorkingMaterial.value === false) {
        return { is: true, outOfScope: false, reason: "see Ch 2 art 4 and 9 FPA for further information on this concrete matter." };
      }

    }
  } else if (documentHasArrived.value === false) { // the document has NOT arrived
    switch (documentType.value) {
      case type.Ledger:
        if (documentReadyForNotation.value === true) {
          return { is: true, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 1 FPA for further information on this concrete matter." };
        }
        if (documentReadyForNotation.value === false) {
          return { is: false, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 1 for further information on this concrete matter." };
        }
        break;
      case type.CourtRuling:
        if (documentDecisionAnnounced.value === true) {
          return { is: true, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 2 FPA for further information on this concrete matter." };
        }
        if (documentDecisionAnnounced.value === false) {
          return { is: false, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 2 FPA for further information on this concrete matter." };
        }
        break;
      case type.Record:
        if (documentRiskdagRecord.value === false) {
          if (documentApproved.value === true) {
            return { is: true, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 3 FPA for further information on this concrete matter." };
          }
          if (documentApproved.value === false) {
            return { is: false, outOfScope: false, reason: "see Ch 2, art 10 ph 2 p. 3 FPA for further information on this concrete matter." };
          }
          break; // no fall-through
        }
        if (documentRiskdagRecord.value === null) {
          break; // no fall-through
        }
      // intended fall-through (if documentRiskdagRecord is true)
      case type.Other:
        if (documentOtherWorkingMaterial.value === true) {
          return { is: false, outOfScope: false, reason: "see Ch 2, art 12 ph 2 FPA for further information on this concrete matter." };
        } else if (documentOtherWorkingMaterial.value === null) {
          return null; // skip
        }

        // documentOtherWorkingMaterial.value === false at this point

        if (documentDispatched.value === true) {
          return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 10 ph. 1 for further information on this concrete matter." };
        } else if (documentDispatched.value === null) {
          return null;
        }

        // documentDispatched.value === false at this point

        if (documentSpecificMatter.value === true) {
          if (documentMemoranda.value === true) {
            if (doucmentArchived.value === true) {
              return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 12 ph 1 FPA for further information on this concrete matter." };
            }
            if (doucmentArchived.value === false) {
              return { is: false, outOfScope: false, reason: "see Ch 2, art 4 and 12 ph 1 FPA for further information on this concrete matter." };
            }
          }

          if (documentMemoranda.value === false) {
            if (documentSettled.value === true) {
              return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 10 ph. 1 FPA for further information on this concrete matter." };
            }
            if (documentSettled.value === false) {
              return { is: false, outOfScope: false, reason: "see Ch 2, art 4 and 10 FPA for further information on this concrete matter." };
            }
          }
        }

        if (documentSpecificMatter.value === false) {
          if (documentOtherApproved.value === true) {
            return { is: true, outOfScope: false, reason: "see Ch 2, art 4 and 10 FPA for further information on this concrete matter." };
          }
          if (documentOtherApproved.value === false) {
            return { is: false, outOfScope: false, reason: "see Ch 2, art 4 and 10 for further information on this concrete matter." };
          }
        }
    }
  }

  return null;
})

function resetAll() {
  documentHeldByAuthority.value = null;
  documentBackupEtc.value = null;
  documentTransferredWithinAuth.value = null;
  documentCompetition.value = null;
  documentHasArrived.value = null;

  // Path: The document has arrived to the authority
  documentDirectedToOfficial.value = null;
  documentRefersToCase.value = null;
  documentWorkingMaterial.value = null;

  // Path: The document has NOT arrived to the authority
  documentType.value = null;

  // Path: Ledger
  documentReadyForNotation.value = null;

  // Path: CourtRuling
  documentDecisionAnnounced.value = null;

  // Path: Record
  documentRiskdagRecord.value = null;
  documentApproved.value = null;
}

</script>

<template>
  <header>
    <br />
    <h1>Rules-as-Code (RaC) - Is This A Public Document?</h1>
  </header>
  <main class="container">
    <h3>Answer the following questions to classify this document as public or not.</h3>
    <Alert type="info" title="This only applies for writings and images" description="As per the definition of documents in Ch 2, art 4 FPA, 
      this tool only evaluates writings and images for whether they are to be considered official." />

    <br />

    <label>
      <h4>Is the document held by an authority?</h4>
      (I) "held by an authority" means whether the document is in physical posession by a governmental or public body.
      (Ch 2, art 4 and 5 FPA)
      <select name="document-held-by-authority" required v-model="documentHeldByAuthority">
        <option selected disabled :value="null">
          Yes/No
        </option>
        <option :value="true">Yes</option>
        <option :value="false">No</option>
      </select>
    </label>

    <div v-if="documentHeldByAuthority === true">
      <label>
        <hr />
        <h4>Is the document:</h4>
        <ul>
          <li>A backup</li>
          <li>Letters, telegrams or other such documents delivered to or drawn up by a public authority solely for the
            purpose of forwarding a communication</li>
          <li>Documents delivered to or drawn up by a public authority solely for the purpose of publication in a
            periodical published under the auspices of the authority</li>
          <li>Printed matter or other documents forming part of a library or deposited by a private person in a public
            archive solely for the purpose of care and safekeeping, or for research and study purposes, and private
            letters or written matters otherwise transferred to a public authority solely for the purposes referred to
            above?</li>
        </ul>
        (I) Ch 2, art 13 ph 2 and 14 p. 1, 2, 3
        <select name="document-backup-etc" required v-model="documentBackupEtc">
          <option selected disabled :value="null">
            Yes/No
          </option>
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </label>

      <div v-if="documentBackupEtc === false">
        <label>
          <hr />
          <h4>Is it a document that a public authority has transferred to another body within the same authority?</h4>
          (I) Ch 2 art 11 FPA
          <select name="document-transferred-within-auth" required v-model="documentTransferredWithinAuth">
            <option selected disabled :value="null">
              Yes/No
            </option>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </label>

        <div v-if="documentTransferredWithinAuth === false">
          <label>
            <hr />
            <h4>Is the document a competition document, tender or other such document which has been advertised and
              shall
              be
              delivered under sealed cover?</h4>
            (I) Ch 2, art 9 ph 2 FPA
            <select name="document-competition" required v-model="documentCompetition">
              <option selected disabled :value="null">
                Yes/No
              </option>
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </label>

          <div v-if="documentCompetition === false">
            <label>
              <hr />
              <h4>The document has arrived to the authority or is in the hands of a competent official</h4>
              (I) Ch 2, art 9 FPA
              <select name="document-has-arrived" required v-model="documentHasArrived">
                <option selected disabled :value="null">
                  Yes/No
                </option>
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </label>

            <!-- Path: The document has arrived to the authority -->
            <div v-if="documentHasArrived === true">
              <label>
                <hr />
                <h4>Is the document a letter or other communication which is directed in person to an official at a
                  public
                  authority</h4>
                (I) Ch 2, art 8 FPA
                <select name="document-directed-to-official" required v-model="documentDirectedToOfficial">
                  <option selected disabled :value="null">
                    Yes/No
                  </option>
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </label>

              <div v-if="documentDirectedToOfficial === true">
                <label>
                  <hr />
                  <h4>Does the document refer to a case or other matter falling within the authorities purview, and is
                    not
                    intended for the addressee solely in his/her capacity as holder of another position?</h4>
                  (I) Ch 2, art 8 FPA
                  <select name="document-refers-to-case" required v-model="documentRefersToCase">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>
              </div>

              <div v-else-if="documentDirectedToOfficial === false">
                <label>
                  <hr />
                  <h4>Is it working material that has been received for the purpose of obtain comments?</h4>
                  (I) Ch 2 art 12 ph 2 FP
                  <select name="document-working-material" required v-model="documentWorkingMaterial">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>
              </div>
            </div>

            <!-- Path: The document has NOT arrived to the authority -->
            <div v-else-if="documentHasArrived === false">
              <label>
                <hr />
                <h4>What type of document is it?</h4>
                (I) Ch 2, art 10 FPA
                <ul>
                  <li>
                    <b>Ledger*:</b> Day books, ledgers, registers or other lists that are kept on an ongoing basis
                  </li>
                  <li>
                    <b>Court Ruling*:</b> Court rulings and other decisions that shall be pronounced or dispatched under
                    relevant previsions of law, or records and other documents in so far as they relate to such a
                    decision
                  </li>
                  <li>
                    <b>Memoranda*:</b> Other records and comparable memoranda held by a public authority
                  </li>
                  <li>
                    <b>Other*:</b> Others...
                  </li>
                </ul>
                <select name="document-working-material" required v-model="documentType">
                  <option selected disabled :value="null">
                    Choose...
                  </option>
                  <option :value="type.Ledger">Ledger*</option>
                  <option :value="type.CourtRuling">Court Ruling*</option>
                  <option :value="type.Record">Memoranda*</option>
                  <option :value="type.Other">Other*</option>
                </select>
              </label>

              <label v-if="documentType === type.Ledger">
                <hr />
                <h4>Has the document been made ready for notation or entry?</h4>
                <select name="document-ready-for-notation" required v-model="documentReadyForNotation">
                  <option selected disabled :value="null">
                    Yes/No
                  </option>
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </label>

              <label v-if="documentType === type.CourtRuling">
                <hr />
                <h4>Has the decision been announced or dispatched?</h4>
                <select name="document-decision-announced" required v-model="documentDecisionAnnounced">
                  <option selected disabled :value="null">
                    Yes/No
                  </option>
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </label>

              <div v-if="documentType === type.Record">
                <label>
                  <hr />
                  <h4>Is it records of Riksdag committees, auditors of local authorities, government-appointed
                    commission
                    of
                    inquiry or local authorities that are related to a matter dealt with solely in order to prepare the
                    matter
                    for
                    decision</h4>
                  (I) Ch 2, art 10 ph 3 FPA
                  <select name="document-riskdag-record" required v-model="documentRiskdagRecord">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>

                <label v-if="documentRiskdagRecord === false">
                  <hr />
                  <h4>Has the document been finally checked and approved by authority or has otherwise received final
                    form?
                  </h4>
                  <select name="document-approved" required v-model="documentApproved">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>
              </div>

              <div
                v-if="(documentType === type.Record && documentRiskdagRecord === true) || documentType === type.Other">
                <label>
                  <hr />
                  <h4>Is it working material that has been sent with the purpose of obtain comments?</h4>
                  <select name="document-other-working-material" required v-model="documentOtherWorkingMaterial">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>

                <div v-if="documentOtherWorkingMaterial === false">
                  <label>
                    <hr />
                    <h4>Has the document been dispatched?</h4>
                    <select name="document-dispatched" required v-model="documentDispatched">
                      <option selected disabled :value="null">
                        Yes/No
                      </option>
                      <option :value="true">Yes</option>
                      <option :value="false">No</option>
                    </select>
                  </label>

                  <div v-if="documentDispatched === false">
                    <label>
                      <hr />
                      <h4>Does the document relate to a specific matter?</h4>
                      <select name="document-specific-matter" required v-model="documentSpecificMatter">
                        <option selected disabled :value="null">
                          Yes/No
                        </option>
                        <option :value="true">Yes</option>
                        <option :value="false">No</option>
                      </select>
                    </label>

                    <div v-if="documentSpecificMatter === true">
                      <label>
                        <hr />
                        <h4>Is the document a memoranda?</h4>
                        (I) Ch 2, art 12 ph 1 FPA
                        <select name="document-memoranda" required v-model="documentMemoranda">
                          <option selected disabled :value="null">
                            Yes/No
                          </option>
                          <option :value="true">Yes</option>
                          <option :value="false">No</option>
                        </select>
                      </label>

                      <label v-if="documentMemoranda === true">
                        <hr />
                        <h4>Is the memoranda archived?</h4>
                        <select name="document-archived" required v-model="doucmentArchived">
                          <option selected disabled :value="null">
                            Yes/No
                          </option>
                          <option :value="true">Yes</option>
                          <option :value="false">No</option>
                        </select>
                      </label>

                      <label v-if="documentMemoranda === false">
                        <hr />
                        <h4>Has the matter been settled by the authority?</h4>
                        (I) Ch 2, art 10 ph 1 FPA
                        <select name="document-settled" required v-model="documentSettled">
                          <option selected disabled :value="null">
                            Yes/No
                          </option>
                          <option :value="true">Yes</option>
                          <option :value="false">No</option>
                        </select>
                      </label>

                    </div>

                    <div v-else-if="documentSpecificMatter === false">
                      <label>
                        <hr />
                        <h4>Has the document been finally checked and approved by the authority or has it otherwise
                          received
                          final
                          form?</h4>
                        (I) Ch 2, art 10, ph 1 FPA
                        <select name="document-other-approved" required v-model="documentOtherApproved">
                          <option selected disabled :value="null">
                            Yes/No
                          </option>
                          <option :value="true">Yes</option>
                          <option :value="false">No</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <Alert v-if="documentOfficiality?.is === true" type="success" title="The document is official"
      :description="documentOfficiality?.reason" />

    <Alert v-if="documentOfficiality?.is === false" type="error" title="The document is not official"
      :description="documentOfficiality?.reason" />

    <Alert v-if="documentOfficiality?.outOfScope === true" type="info" title="The document is out of scope"
      :description="documentOfficiality?.reason" />

    <hr />

    <button @click="resetAll">Reset All Choices</button>

    <br />
    <br />

  </main>
  <footer>
    <h5>This application was developed as a part of the coursework to RaC applications at Karlstad universitet.</h5>
    <br />
    <br />
    <br />
  </footer>
</template>

<style scoped></style>
