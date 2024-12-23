Cypress.Commands.add("fillNameAndTextArea", (name, lastName, feedback) => {
  cy.get("#firstName").should("be.visible").type(name);
  cy.get("#lastName").should("be.visible").type(lastName);
  cy.get("#open-text-area").should("be.visible").type(feedback, { delay: 0 });
});

Cypress.Commands.add(
  "fillAllDefaultRequiredFields",
  (name, lastName, email, feedback) => {
    cy.fillNameAndTextArea(name, lastName, feedback);
    cy.get("#email").should("be.visible").type(email);
  }
);

Cypress.Commands.add("submitForm", () => {
  //cy.get("button[type='submit']").should("be.visible").click();
  cy.contains("button", "Send").should("be.visible").click();
});
