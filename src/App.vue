<script setup lang="ts">
import { useDocumentOfficiality, docType } from './useDocumentOfficiality';
import Alert from './Alert.vue';

// Use the composable
const { state, documentOfficiality, resetAll } = useDocumentOfficiality();

// Expose type enum to the template
const documentType = docType;

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
      <select name="document-held-by-authority" required v-model="state.heldByAuthority">
        <option selected disabled :value="null">
          Yes/No
        </option>
        <option :value="true">Yes</option>
        <option :value="false">No</option>
      </select>
    </label>

    <div v-if="state.heldByAuthority === true">
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
        <select name="document-backup-etc" required v-model="state.backupEtc">
          <option selected disabled :value="null">
            Yes/No
          </option>
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </label>

      <div v-if="state.backupEtc === false">
        <label>
          <hr />
          <h4>Is it a document that a public authority has transferred to another body within the same authority?</h4>
          (I) Ch 2 art 11 FPA
          <select name="document-transferred-within-auth" required v-model="state.transferredWithinAuth">
            <option selected disabled :value="null">
              Yes/No
            </option>
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </label>

        <div v-if="state.transferredWithinAuth === false">
          <label>
            <hr />
            <h4>Is the document a competition document, tender or other such document which has been advertised and
              shall
              be
              delivered under sealed cover?</h4>
            (I) Ch 2, art 9 ph 2 FPA
            <select name="document-competition" required v-model="state.competition">
              <option selected disabled :value="null">
                Yes/No
              </option>
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </label>

          <div v-if="state.competition === false">
            <label>
              <hr />
              <h4>The document has arrived to the authority or is in the hands of a competent official</h4>
              (I) Ch 2, art 9 FPA
              <select name="document-has-arrived" required v-model="state.hasArrived">
                <option selected disabled :value="null">
                  Yes/No
                </option>
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </label>

            <div v-if="state.hasArrived === true">
              <label>
                <hr />
                <h4>Is the document a letter or other communication which is directed in person to an official at a
                  public
                  authority</h4>
                (I) Ch 2, art 8 FPA
                <select name="document-directed-to-official" required v-model="state.paths.arrived.directedToOfficial">
                  <option selected disabled :value="null">
                    Yes/No
                  </option>
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </label>

              <div v-if="state.paths.arrived.directedToOfficial === true">
                <label>
                  <hr />
                  <h4>Does the document refer to a case or other matter falling within the authorities purview, and is
                    not
                    intended for the addressee solely in his/her capacity as holder of another position?</h4>
                  (I) Ch 2, art 8 FPA
                  <select name="document-refers-to-case" required v-model="state.paths.arrived.refersToCase">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>
              </div>

              <div v-else-if="state.paths.arrived.directedToOfficial === false">
                <label>
                  <hr />
                  <h4>Is it working material that has been received for the purpose of obtain comments?</h4>
                  (I) Ch 2 art 12 ph 2 FP
                  <select name="document-working-material" required v-model="state.paths.arrived.workingMaterial">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>
              </div>
            </div>

            <div v-else-if="state.hasArrived === false">
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
                <select name="document-working-material" required v-model="state.paths.notArrived.docType">
                  <option selected disabled :value="null">
                    Choose...
                  </option>
                  <option :value="documentType.Ledger">Ledger*</option>
                  <option :value="documentType.CourtRuling">Court Ruling*</option>
                  <option :value="documentType.Record">Memoranda*</option>
                  <option :value="documentType.Other">Other*</option>
                </select>
              </label>

              <label v-if="state.paths.notArrived.docType === documentType.Ledger">
                <hr />
                <h4>Has the document been made ready for notation or entry?</h4>
                <select name="document-ready-for-notation" required v-model="state.paths.notArrived.readyForNotation">
                  <option selected disabled :value="null">
                    Yes/No
                  </option>
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </label>

              <label v-if="state.paths.notArrived.docType === documentType.CourtRuling">
                <hr />
                <h4>Has the decision been announced or dispatched?</h4>
                <select name="document-decision-announced" required v-model="state.paths.notArrived.decisionAnnounced">
                  <option selected disabled :value="null">
                    Yes/No
                  </option>
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </label>

              <div v-if="state.paths.notArrived.docType === documentType.Record">
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
                  <select name="document-riskdag-record" required v-model="state.paths.notArrived.riskdagRecord">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>

                <label v-if="state.paths.notArrived.riskdagRecord === false">
                  <hr />
                  <h4>Has the document been finally checked and approved by authority or has otherwise received final
                    form?
                  </h4>
                  <select name="document-approved" required v-model="state.paths.notArrived.approved">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>
              </div>

              <div
                v-if="(state.paths.notArrived.docType === documentType.Record && state.paths.notArrived.riskdagRecord === true) || state.paths.notArrived.docType === documentType.Other">
                <label>
                  <hr />
                  <h4>Is it working material that has been sent with the purpose of obtain comments?</h4>
                  <select name="document-other-working-material" required
                    v-model="state.paths.notArrived.otherWorkingMaterial">
                    <option selected disabled :value="null">
                      Yes/No
                    </option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>

                <div v-if="state.paths.notArrived.otherWorkingMaterial === false">
                  <label>
                    <hr />
                    <h4>Has the document been dispatched?</h4>
                    <select name="document-dispatched" required v-model="state.paths.notArrived.dispatched">
                      <option selected disabled :value="null">
                        Yes/No
                      </option>
                      <option :value="true">Yes</option>
                      <option :value="false">No</option>
                    </select>
                  </label>

                  <div v-if="state.paths.notArrived.dispatched === false">
                    <label>
                      <hr />
                      <h4>Does the document relate to a specific matter?</h4>
                      <select name="document-specific-matter" required v-model="state.paths.notArrived.specificMatter">
                        <option selected disabled :value="null">
                          Yes/No
                        </option>
                        <option :value="true">Yes</option>
                        <option :value="false">No</option>
                      </select>
                    </label>

                    <div v-if="state.paths.notArrived.specificMatter === true">
                      <label>
                        <hr />
                        <h4>Is the document a memoranda?</h4>
                        (I) Ch 2, art 12 ph 1 FPA
                        <select name="document-memoranda" required v-model="state.paths.notArrived.memoranda">
                          <option selected disabled :value="null">
                            Yes/No
                          </option>
                          <option :value="true">Yes</option>
                          <option :value="false">No</option>
                        </select>
                      </label>

                      <label v-if="state.paths.notArrived.memoranda === true">
                        <hr />
                        <h4>Is the memoranda archived?</h4>
                        <select name="document-archived" required v-model="state.paths.notArrived.documentArchived">
                          <option selected disabled :value="null">
                            Yes/No
                          </option>
                          <option :value="true">Yes</option>
                          <option :value="false">No</option>
                        </select>
                      </label>

                      <label v-if="state.paths.notArrived.memoranda === false">
                        <hr />
                        <h4>Has the matter been settled by the authority?</h4>
                        (I) Ch 2, art 10 ph 1 FPA
                        <select name="document-settled" required v-model="state.paths.notArrived.settled">
                          <option selected disabled :value="null">
                            Yes/No
                          </option>
                          <option :value="true">Yes</option>
                          <option :value="false">No</option>
                        </select>
                      </label>

                    </div>

                    <div v-else-if="state.paths.notArrived.specificMatter === false">
                      <label>
                        <hr />
                        <h4>Has the document been finally checked and approved by the authority or has it otherwise
                          received
                          final
                          form?</h4>
                        (I) Ch 2, art 10, ph 1 FPA
                        <select name="document-other-approved" required v-model="state.paths.notArrived.otherApproved">
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