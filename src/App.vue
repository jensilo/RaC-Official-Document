<script setup lang="ts">
import { useDocumentOfficiality, docType } from './useDocumentOfficiality'
import Alert from './Alert.vue'

const { state, documentOfficiality, resetAll } = useDocumentOfficiality()

// Expose type enum to the template
const documentType = docType
</script>

<template>
  <header>
    <br />
    <h1>Rules-as-Code (RaC) - Is This A Public Document?</h1>
  </header>
  <main class="container">
    <h3>Answer the following questions to classify this document as public or not.</h3>
    <Alert
      type="info"
      title="This only applies for writings and images"
      description="This tool only evaluates writings and images for whether they are to be considered official. (Ch 2 art 4 and 10 FPA)"
    />

    <br />

    <label>
      <h4>Is the document held by a public authority?</h4>
      (I) "held by an authority" means whether the document is in physical posession by a
      governmental or public body. (Ch 2, art 4 and 5 FPA)
      <select name="document-held-by-authority" required v-model="state.heldByAuthority">
        <option selected disabled :value="null">Yes/No</option>
        <option :value="true">Yes</option>
        <option :value="false">No</option>
      </select>
    </label>

    <transition name="fade">
      <div v-if="state.heldByAuthority === true">
        <label>
          <hr />
          <h4>What type of document is it?</h4>
          (I) Ch 2, art 10 FPA
          <ul>
            <li>
              <b>Ledger*:</b> Day books, ledgers, registers or other lists that are kept on an
              ongoing basis.
            </li>
            <li>
              <b>Court Ruling*:</b> Court rulings and other decisions that shall be pronounced or
              dispatched under relevant previsions of law, or records and other documents in so far
              as they relate to such a decision.
            </li>
            <li>
              <b>Memoranda*:</b> Other records and comparable memoranda held by a public authority.
            </li>
            <li><b>Other*:</b> Others...</li>
          </ul>
          <select name="document-working-material" required v-model="state.docTypeChoice">
            <option selected disabled :value="null">Choose...</option>
            <option :value="documentType.Ledger">Ledger*</option>
            <option :value="documentType.CourtRuling">Court Ruling*</option>
            <option :value="documentType.Memoranda">Memoranda*</option>
            <option :value="documentType.Other">Other*</option>
          </select>
        </label>

        <transition name="fade">
          <label v-if="state.docTypeChoice === documentType.Ledger">
            <hr />
            <h4>Has the document been made ready for notation or entry?</h4>
            (I) Ch 2, art 10 ph 2 p. 1 FPA
            <select name="document-ready-for-notation" required v-model="state.readyForNotation">
              <option selected disabled :value="null">Yes/No</option>
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </label>
        </transition>

        <transition name="fade">
          <label v-if="state.docTypeChoice === documentType.CourtRuling">
            <hr />
            <h4>Has the decision been announced or dispatched?</h4>
            (I) Ch 2, art 10 ph 2 p. 2 FPA
            <select name="document-decision-announced" required v-model="state.decisionAnnounced">
              <option selected disabled :value="null">Yes/No</option>
              <option :value="true">Yes</option>
              <option :value="false">No</option>
            </select>
          </label>
        </transition>

        <transition name="fade">
          <div v-if="state.docTypeChoice === documentType.Memoranda">
            <label>
              <hr />
              <h4>
                Is it records of Riksdag committees, auditors of local authorities,
                government-appointed commission of inquiry or local authorities that are related to
                a matter dealt with solely in order to prepare the matter for decision?
              </h4>
              (I) Ch 2, art 10 ph 3 FPA
              <select name="document-riskdag-record" required v-model="state.riskdagRecord">
                <option selected disabled :value="null">Yes/No</option>
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </label>

            <transition name="fade">
              <label v-if="state.riskdagRecord === false">
                <hr />
                <h4>
                  Has the document been finally checked and approved by authority or has otherwise
                  received final form?
                </h4>
                (I) Ch 2, art 10 ph 2 p. 3 FPA
                <select name="document-approved" required v-model="state.approved">
                  <option selected disabled :value="null">Yes/No</option>
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </label>
            </transition>
          </div>
        </transition>

        <transition name="fade">
          <div v-if="state.docTypeChoice === documentType.Other">
            <label>
              <hr />
              <h4>Has the document been dispatched?</h4>
              (I) Ch 2, art 10 ph 1 FPA
              <select name="document-dispatched" required v-model="state.dispatched">
                <option selected disabled :value="null">Yes/No</option>
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </label>

            <transition name="fade">
              <div v-if="state.dispatched === false">
                <label>
                  <hr />
                  <h4>Does the document relate to a specific matter?</h4>
                  (I) Ch 2, art 10 ph 1 FPA
                  <select name="document-specific-matter" required v-model="state.specificMatter">
                    <option selected disabled :value="null">Yes/No</option>
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </label>

                <transition name="fade" mode="out-in">
                  <label v-if="state.specificMatter === true" key="specific-matter-true">
                    <hr />
                    <h4>Has the matter been settled by the authority?</h4>
                    (I) Ch 2, art 10 ph 1 FPA
                    <select name="document-settled" required v-model="state.settled">
                      <option selected disabled :value="null">Yes/No</option>
                      <option :value="true">Yes</option>
                      <option :value="false">No</option>
                    </select>
                  </label>

                  <label v-else-if="state.specificMatter === false" key="specific-matter-false">
                    <hr />
                    <h4>
                      Has the document been finally checked and approved by the authority or has it
                      otherwise received final form?
                    </h4>
                    (I) Ch 2, art 10, ph 1 FPA
                    <select name="document-other-approved" required v-model="state.otherApproved">
                      <option selected disabled :value="null">Yes/No</option>
                      <option :value="true">Yes</option>
                      <option :value="false">No</option>
                    </select>
                  </label>
                </transition>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </transition>

    <Alert
      v-if="documentOfficiality?.is === true"
      type="success"
      title="The document is official"
      :description="documentOfficiality?.reason"
    />

    <Alert
      v-if="documentOfficiality?.is === false"
      type="error"
      title="The document is not official"
      :description="documentOfficiality?.reason"
    />

    <Alert
      v-if="documentOfficiality?.outOfScope === true"
      type="info"
      title="The document is out of scope"
      :description="documentOfficiality?.reason"
    />

    <hr />

    <button @click="resetAll">Reset All Choices</button>

    <br />
    <br />
  </main>
  <footer>
    <h5>
      This application was developed as a part of the coursework to RaC applications at Karlstad
      universitet.
    </h5>
    <br />
    <br />
    <br />
  </footer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
