/// <reference types="cypress" />

describe('Running Dawn website', function () {
  it('To run queries in the chatbot and log responses in Cypress console', function () {
    // Define the array of queries (add as many as you need)
    const queries = [
      'How do I set up my AirSense 11 device for the first time?',
      'What specific issues would you like to discuss during your appointment?',
      'What should I do if I experience dry mouth or nasal congestion while using the AirSense 11?',
      'How do I clean and maintain the humidifier tub and air tubing?',
      'What are the contraindications for using AirSense 11 CPAP therapy?',
      // Add more queries here
    ];

    cy.viewport(1366, 768);
    cy.visit('https://chat.va-stg.dht.live/');
    cy.wait(3000);
    cy.get('.btn').click();
    cy.get('.terms_agree_agree_btn').click();

    // Loop through each query and type it in the chat
    cy.wrap(queries).each((query, index) => {
      // Ensure the #myTextArea is enabled and visible before typing
      cy.get('#myTextArea', { timeout: 60000 })
        .should('be.visible')
        .and('be.enabled')
        .type(query);

      // Click the send button
      cy.get('.chatbox_btn', { timeout: 60000 }).click();

      // Wait for the bot response
      cy.get('.btc_chat_card_bot_span.btc_chat_card_bot_span_msg', { timeout: 60000 })
        .should('have.length.greaterThan', 0)
        .last()
        .then((lastMessage) => {
          const botResponse = lastMessage.text().trim();
          cy.log(`User (${index + 1}): ${query}`);
          cy.log(`Bot: ${botResponse}`);
        });

      // Scroll to the bottom of the chatbot      
      cy.get('div.chatbox__messages',{ timeout: 60000 }).should('be.visible');
      cy.get('div.chatbox__messages').scrollTo('bottom');

      // Wait for thumbs_up before moving to the next query
      cy.get('.thumbs_up', { timeout: 60000 }).should('be.visible');
      cy.get('#myTextArea').should('be.visible');
    });
  });
});
