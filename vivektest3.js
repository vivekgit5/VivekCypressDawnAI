/// <reference types="cypress" />

describe('Running Dawn website chatbot automation', function () {
  it('Run multiple queries in the chatbot and capture HTML responses', function () {

    // Start building the HTML report
    let htmlReport = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Chatbot Responses</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .query { font-weight: bold; color: #2c3e50; margin-top: 20px; }
          .response { margin-left: 20px; padding: 10px; background: #f4f6f9; border-radius: 5px; }
        </style>
      </head>
      <body>
      <h1>Chatbot Query & Response Log</h1>
    `;

    // Read queries from Excel
    cy.task("readExcel", {
      filePath: "cypress/fixtures/queries.xlsx",
      sheetName: "Sheet1"
    }).then((queries) => {

      // Setup viewport + visit chatbot
      cy.viewport(1221, 687);
      cy.visit('https://chat.dawn-us-dev.dht.live/');
      cy.wait(3000);

      // Accept terms
      cy.get('.btn').click();
      cy.get('.terms_agree_agree_btn').click();

      // wait for chatbot to fully load
      cy.wait(3000);

      // Loop through queries from Excel
      cy.wrap(queries).each((query, index) => {
        
        // Type the user query
        cy.get('#myTextArea', { timeout: 60000 })
          .should('be.visible')
          .and('be.enabled')
          .clear()
          .type(query);

        // Send query
        cy.get('.chatbox_btn', { timeout: 60000 }).click();
        cy.get('#myTextArea',{ timeout: 60000 }).should('be.visible').and('be.enabled');

        // Calculate which child should contain the bot response
        // First response is at nth-child(2), second at nth-child(4), etc.
        const childIndex = (index + 1) * 2;

        // Scroll into the specific bot response (pick only one element)
        cy.get(`:nth-child(${childIndex}) > .va_bot_msg`, { timeout: 60000 })
          .first() // ✅ ensures only one element selected
          .scrollIntoView({ offset: { top: -100, left: 0 }, duration: 500 })
          .should('exist')
          .invoke('prop', 'innerHTML')
          .then((responseHtml) => {
            // Append query + response to HTML report
            htmlReport += `
              <div class="query">Q${index + 1}: ${query}</div>
              <div class="response">${responseHtml}</div>
            `;
          });

        // Optional: verify thumbs up button is visible after response
        cy.get('.thumbs_up', { timeout: 60000 })
          .first() // ✅ if multiple thumbs show up
          .scrollIntoView({ offset: { top: -100, left: 0 }, duration: 500 })
          .should('exist');

        // Ensure input is ready for next query
        cy.get('#myTextArea').should('be.visible');
      }).then(() => {
        // Close the HTML
        htmlReport += `</body></html>`;

        // Write results to an HTML file
        cy.writeFile('cypress/results/chatbot_responses.html', htmlReport);

        cy.log('✅ Chatbot responses saved to chatbot_responses.html');
      });
    });
  });
});
