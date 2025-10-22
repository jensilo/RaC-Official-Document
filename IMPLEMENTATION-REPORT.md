# Implementation Report

## Table of Contents

1.  [Introduction](#1-introduction)
2.  [Initial Planning and Technology Choices](#2-initial-planning-and-technology-choices)
    1.  [Initial Considerations and Architectural Pivot](#21-initial-considerations-and-architectural-pivot)
    2.  [Frontend Technology Stack](#22-frontend-technology-stack)
3.  [System Architecture and Implementation](#3-system-architecture-and-implementation)
    1.  [Component-Based Architecture](#31-component-based-architecture)
    2.  [Decoupled Logic with Vue Composables](#32-decoupled-logic-with-vue-composables)
    3.  [User Interface and Experience](#33-user-interface-and-experience)
4.  [Challenges and Solutions](#4-challenges-and-solutions)
    1.  [Managing Business Logic Complexity](#41-managing-business-logic-complexity)
    2.  [Adaptation to Evolving Requirements](#42-adaptation-to-evolving-requirements)
5.  [Deployment](#5-deployment)
6.  [Critical Assessment](#6-critical-assessment)
7.  [Conclusion](#7-conclusion)

## 1. Introduction

This report details the implementation of a prototype for a Rules-as-Code (RaC) application. The primary objective of this project was to develop a tool to assess whether a document should be considered "official" under the Swedish Freedom of the Press Act (FPA). The application is designed to guide users through a series of questions, ultimately providing a classification of the document's officiality status based on the rules defined in the FPA.

This report will cover the initial planning phase, the technology choices made, the architecture of the system, and the implementation details. It will also discuss the challenges encountered during development, the solutions devised to overcome them, and the process of adapting to changes in the underlying legal rules. Finally, the report will touch upon the deployment strategy and provide a critical assessment of the final prototype.

## 2. Initial Planning and Technology Choices

### 2.1. Initial Considerations and Architectural Pivot

The initial plan for the application was to develop a frontend interface that would communicate with a Camunda API. The Camunda engine would host the business logic derived from the FPA as a BPMN model. However, this approach was reconsidered due to several factors:

*   **Cost:** The Camunda API is a paid service with a limited 30-day trial. This would have restricted the long-term availability and demonstration of the application.
*   **Complexity:** The Camunda API has its own set of complexities and API-specific quirks, which would have introduced additional development overhead.
*   **User Experience:** A core requirement for the application was to provide a user-friendly, step-by-step guide through the decision-making process. A simple API call to Camunda would likely have resulted in a less interactive and more static user experience, potentially displaying all possible questions at once. To create a dynamic, guided questionnaire, a significant portion of the BPMN logic would need to be replicated on the frontend anyway, diminishing the value of the Camunda backend.

Given these considerations, a decision was made to pivot to a frontend-only application. The BPMN model was used as a specification for the implementation of the business logic directly within the frontend code. This approach offered greater control over the user experience, eliminated the dependency on a paid external service, and simplified the overall architecture.

### 2.2. Frontend Technology Stack

The following technologies were selected for the development of the prototype:

*   **Vue.js (v3):** Vue.js was chosen as the primary frontend framework due to its modern, straightforward, and component-based architecture. The developer's prior familiarity with Vue.js also contributed to a more efficient development process. Vue's reactivity system and composable API were particularly well-suited for managing the state of the questionnaire.

*   **PicoCSS:** To ensure a clean and usable interface from the outset without significant effort in custom styling, PicoCSS was employed. PicoCSS provides sane default styles for native HTML elements, resulting in a visually appealing and responsive design with minimal configuration.

## 3. System Architecture and Implementation

The application is structured to separate concerns, with a clear distinction between the user interface (View) and the business logic (Model). This is achieved through a combination of Vue's component-based architecture and the use of a composable function for state management and classification logic.

### 3.1. Component-Based Architecture

The user interface is built with a small set of Vue components:

*   **`App.vue`:** The main application component that orchestrates the user interface. It is responsible for rendering the questionnaire and displaying the results.
*   **`Alert.vue`:** A reusable component for displaying informational messages, warnings, and the final classification result. This component is designed with custom styles to provide clear visual feedback to the user.

### 3.2. Decoupled Logic with Vue Composables

The core logic of the application is encapsulated in the `src/useDocumentOfficiality.ts` file. This file exports a composable function, `useDocumentOfficiality`, which manages the state of the questionnaire and contains the classification logic. This decoupling of logic from the view offers several advantages:

*   **Maintainability:** The business logic is centralized in one place, making it easier to understand, modify, and debug.
*   **Testability:** The classification logic is implemented as a pure function, `classifyDocument`, which can be tested in isolation without requiring a browser environment or Vue-specific test utilities.
*   **Reusability:** The `useDocumentOfficiality` composable could be reused in other parts of the application or in different applications altogether.

The `useDocumentOfficiality` composable exposes the following to the `App.vue` component:

*   `state`: A reactive object that holds the user's answers to the questionnaire.
*   `documentOfficiality`: A computed property that automatically re-evaluates the document's officiality status whenever the `state` changes.
*   `resetAll`: A function to reset the questionnaire to its initial state.

The `classifyDocument` function takes a snapshot of the state and returns the officiality status. This is a key aspect of the architecture, as it ensures that the classification logic is predictable and has no side effects.

```typescript
// src/useDocumentOfficiality.ts

function classifyDocument(stateSnapshot: DocumentState): officiality | null {
  // ... classification logic based on the FPA rules ...
}

export function useDocumentOfficiality() {
  const state = reactive<DocumentState>({ ...initialState });

  const documentOfficiality = computed<officiality | null>(() => {
    return classifyDocument(state);
  });

  function resetAll() {
    Object.assign(state, initialState);
  }

  return {
    state,
    documentOfficiality,
    resetAll,
    // ...
  };
}
```

### 3.3. User Interface and Experience

The user interface is designed as a step-by-step questionnaire. Questions are revealed progressively based on the user's previous answers. This approach simplifies the user experience by presenting only relevant information at each stage of the process. The use of `<transition>` elements in `App.vue` provides smooth animations as new questions appear, further enhancing the user experience.

The final result of the assessment is displayed using the `Alert.vue` component, which provides clear visual feedback (success, error, or info) to the user.

## 4. Challenges and Solutions

### 4.1. Managing Business Logic Complexity

The primary challenge during development was managing the complexity of the business logic derived from the BPMN model. The initial implementation attempts resulted in highly coupled and difficult-to-maintain code, often referred to as "spaghetti code." The nested conditional logic of the FPA rules made the code hard to read and debug.

This challenge was addressed through a series of refactorings that led to the decoupled architecture described in the previous section. By separating the classification logic into a pure function (`classifyDocument`), the complexity was contained and could be managed more effectively. This separation of concerns proved to be the most critical factor in improving the stability and maintainability of the codebase.

### 4.2. Adaptation to Evolving Requirements

Halfway through the project, the underlying rule tree (BPMN) was simplified. This required a corresponding update to the application's logic. The decoupled architecture greatly facilitated this process. The changes were primarily confined to the `classifyDocument` function, with minimal impact on the user interface components. The process involved reviewing the new BPMN diagram, identifying the changes in the logic, and updating the `classifyDocument` function accordingly. While this was still a meticulous process, the well-defined structure of the code prevented it from becoming a major rewrite.

## 5. Deployment

The application is deployed as a static website using GitHub Pages. This is a simple and effective way to host a frontend application that does not require a server-side backend. The deployment process is automated using a GitHub Action, which is a CI/CD (Continuous Integration/Continuous Deployment) feature of GitHub.

The GitHub Action is configured to trigger on every push to the `main` branch. It performs the following steps:

1.  **Build:** It checks out the code and builds the Vue.js application using the `npm run build` command. This command bundles all the necessary HTML, CSS, and JavaScript files into a `dist` directory.
2.  **Deploy:** It then deploys the contents of the `dist` directory to the `gh-pages` branch of the repository. GitHub Pages is configured to serve the files from this branch.

This automated workflow ensures that the latest version of the application is always available at the public URL provided by GitHub Pages. Since the application is purely client-side, the classification of documents occurs entirely on the user's device, ensuring privacy and instantaneous feedback.

## 6. Critical Assessment

The implemented prototype successfully fulfills the project's requirements. The technology choices proved to be effective, and the resulting application is a working tool that accurately reflects the logic of the FPA rules.

The step-by-step questionnaire format provides a simple and intuitive user experience. It effectively guides the user through the complex legal rules without overwhelming them with information. The immediate feedback and clear presentation of the result contribute to a positive user experience.

The decision to implement the business logic on the frontend, while initially a deviation from the plan, was ultimately a sound one. It resulted in a more maintainable, testable, and cost-effective solution. The decoupled architecture, in particular, is a key strength of the implementation, as it allows for easier maintenance and future development.

The application successfully demonstrates the potential of Rules-as-Code in making complex legal frameworks more accessible and understandable to a wider audience.

## 7. Conclusion

This report has provided a comprehensive overview of the implementation of the Rules-as-Code prototype. The project successfully translated a complex set of legal rules into a user-friendly web application. The chosen technology stack and architecture have proven to be robust and maintainable, providing a solid foundation for future development. The final prototype effectively demonstrates the value of RaC in making complex legal knowledge accessible and actionable.