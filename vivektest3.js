/// <reference types="cypress" />

describe('Running Dawn website', function () {
  it('To run queries in the chatbot', function () {
    
    cy.task("readExcel", {
      filePath: "cypress/fixtures/queries.xlsx",
      sheetName: "Sheet1"
    }).then((queries) => {
      
      cy.viewport(1366, 768);
      cy.visit('https://chat.va-stg.dht.live/');
      cy.wait(3000);
      cy.get('.btn').click();
      cy.get('.terms_agree_agree_btn').click();

      cy.wrap(queries).each((query) => {
        cy.get('#myTextArea', { timeout: 60000 })
          .should('be.visible')
          .and('be.enabled')
          .type(query);

        cy.get('.chatbox_btn', { timeout: 60000 }).click();

        cy.get('.btc_chat_card_bot_span.btc_chat_card_bot_span_msg', { timeout: 60000 })
          .should('have.length.greaterThan', 0)
          .last()
          .then(() => {
            // response handled, no logging
          });

        cy.get('div.chatbox__messages', { timeout: 60000 }).should('be.visible');
        cy.get('div.chatbox__messages').scrollTo('bottom');
        cy.get('.thumbs_up', { timeout: 60000 }).should('be.visible');
        cy.get('#myTextArea').should('be.visible');
      });
    });
  });
});
