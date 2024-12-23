const NAME = "Pedro";
const LAST_NAME = "Bondal";
const EMAIL = "pedro@test.com";
const FEEDBACK = Cypress._.repeat("This is a test text! ", 20);

describe("TAT Customer Service Center", () => {
  beforeEach(() => {
    cy.visit("src/index.html");
  });

  it("checks the application title", () => {
    cy.title().should("be.equal", "TAT Customer Service Center");
  });

  it("fills in the required fields and submits the form", () => {
    cy.fillNameAndTextArea(NAME, LAST_NAME, FEEDBACK);
    cy.get("#email").should("be.visible").type(EMAIL);
    cy.submitForm();

    cy.get(".success").should("be.visible");
  });

  it("displays an error message when submitting the form with an email with invalid formatting", () => {
    cy.fillNameAndTextArea(NAME, LAST_NAME, FEEDBACK);
    cy.get("#email").should("be.visible").type("invalid-e-mail");
    cy.submitForm();

    cy.get(".error").should("be.visible");
  });

  it("phone field only accepts numbers", () => {
    cy.get("#phone").should("be.visible").type("abcdefg");
    cy.get("#phone").should("have.value", "");
  });

  it("displays an error message when the phone becomes required but is not filled in before the form submission", () => {
    cy.fillAllDefaultRequiredFields(NAME, LAST_NAME, EMAIL, FEEDBACK);
    cy.get("#phone-checkbox").should("be.visible").check();
    cy.submitForm();

    cy.get(".error").should("be.visible");
  });

  it("fills and clears the first name, last name, email, and phone fields", () => {
    cy.fillAllDefaultRequiredFields(NAME, LAST_NAME, EMAIL, FEEDBACK);
    cy.get("#phone").should("be.visible").type("999999999");

    cy.get("#firstName").should("have.value", NAME);
    cy.get("#lastName").should("have.value", LAST_NAME);
    cy.get("#email").should("have.value", EMAIL);
    cy.get("#phone").should("have.value", "999999999");
    cy.get("#open-text-area").should("have.value", FEEDBACK);

    cy.get("#firstName").clear().should("have.value", "");
    cy.get("#lastName").clear().should("have.value", "");
    cy.get("#email").clear().should("have.value", "");
    cy.get("#phone").clear().should("have.value", "");
    cy.get("#open-text-area").clear().should("have.value", "");
  });

  it("displays an error message when submitting the form without filling the required fields", () => {
    cy.submitForm();
    cy.get(".error").should("be.visible");
  });

  it("selects a product (YouTube) by its content", () => {
    cy.get("select").select("YouTube").should("have.value", "youtube");
  });

  it("selects a product (Mentorship) by its value", () => {
    cy.get("select").select("mentorship").should("have.value", "mentorship");
  });

  it("selects a product (Blog) by its index", () => {
    cy.get("select").select(1).should("have.value", "blog");
  });

  it("checks the type of service 'Feedback'", () => {
    cy.get("input[type='radio'][value='feedback']")
      .check()
      .should("be.checked");
  });

  it("checks each type of service", () => {
    cy.get("#support-type")
      .find("input[type='radio']")
      .each(($radio) => {
        cy.wrap($radio).check().should("be.checked");
      });
  });

  it("checks both checkboxes, then unchecks the last one", () => {
    cy.get("#check")
      .find("input[type='checkbox']")
      .as("checkboxes")
      .check()
      .each(($checkbox) => {
        cy.wrap($checkbox).should("be.checked");
      });

    cy.get("@checkboxes").last().uncheck().should("not.be.checked");
  });

  it("selects a file from the fixtures folder", () => {
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json")
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("selects a file simulating a drag-and-drop", () => {
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("selects a file using a fixture to which an alias was given", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get("#file-upload")
      .selectFile("@sampleFile")
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifies that the privacy policy page opens in another tab without the need for a click", () => {
    cy.contains("a", "Privacy Policy")
      .should("have.attr", "href", "privacy.html")
      .and("have.attr", "target", "_blank");
  });

  it("access the privacy policy page by removing the target, then clicking on the link", () => {
    cy.contains("a", "Privacy Policy").invoke("removeAttr", "target").click();
    cy.contains("h1", "TAT CSC - Privacy Policy").should("be.visible");
  });
});
