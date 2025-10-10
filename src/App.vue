<script setup lang="ts">
import { ref, computed } from 'vue';
import Alert from './Alert.vue';

interface officiality {
  is: boolean | null
  outOfScope: boolean
  reason: string
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
    return null; // tbd
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
}

</script>

<template>
  <header>
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

    <label v-if="documentHeldByAuthority === true">
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

    <label v-if="documentBackupEtc === false">
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

    <label v-if="documentTransferredWithinAuth === false">
      <hr />
      <h4>Is the document a competition document, tender or other such document which has been advertised and shall be
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

    <label v-if="documentCompetition === false">
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
        <h4>Is the document a letter or other communication which is directed in person to an official at a public
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
          <h4>Does the document refer to a case or other matter falling within the authorities purview, and is not
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
  </footer>
</template>

<style scoped></style>
