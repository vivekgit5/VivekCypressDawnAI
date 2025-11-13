/// <reference types="cypress" />

describe('Running Dawn website chatbot automation', function () {
  it('Run multiple queries in the chatbot and capture HTML responses', function () {

    const testUrl = 'https://chat-myair.dawn-us-pre-prod.dht.live/'; // ✅ Store tested URL
    let totalQueries = 0; // ✅ Will count queries dynamically
    const testTimestamp = new Date().toLocaleString(); // ✅ Capture current date/time

    // Start building the HTML report
    let htmlReport = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Chatbot Responses</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6; 
            background: #f9f9fb;
            color: #2c3e50;
          }
          h1 {
            text-align: center;
            color: #34495e;
            margin-bottom: 10px;
          }
          .summary {
            margin: 20px auto;
            padding: 15px;
            max-width: 900px;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          .summary div {
            margin: 8px 0;
            font-size: 15px;
          }
          .summary strong {
            color: #2c3e50;
          }
          .query-block {
            margin: 20px auto;
            padding: 15px;
            max-width: 900px;
            background: #ffffff;
            border: 1px solid #e1e4e8;
            border-radius: 8px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          }
          .query {
            font-weight: bold; 
            color: #2980b9; 
            margin-bottom: 8px;
          }
          .query.skipped {
            color: #7f8c8d;
            font-style: italic;
          }
          .response {
            margin-top: 5px;
            padding: 12px; 
            background: #f4f6f9; 
            border-radius: 6px; 
            border-left: 4px solid #3498db;
          }
          .conversation {
            margin: 30px auto;
            padding: 15px;
            max-width: 900px;
            background: #eafaf1; 
            border: 1px solid #b2f0d0;
            border-left: 6px solid #2ecc71; 
            border-radius: 8px;
            font-weight: bold;
            text-align: center;
            color: #27ae60;
          }
        </style>
      </head>
      <body>
      <h1>📋 Chatbot Query & Response Log</h1>
    `;

    // Read queries from Excel
    cy.task("readExcel", {
      filePath: "cypress/fixtures/queries.xlsx",
      sheetName: "Sheet1"
    }).then((queries) => {

      totalQueries = queries.length; // ✅ count queries

      // Setup viewport + visit chatbot
      cy.viewport(1221, 687);
      cy.visit(testUrl);
      cy.pause(40000)

      // Accept terms
      //cy.get('.btn').click();
      //cy.get('.terms_agree_agree_btn').click();
      cy.wait(5000);

      // Loop through queries from Excel
      cy.wrap(queries).each((rawQuery, index) => {

        const originalQuery = rawQuery || ""; // keep as-is for reporting
        const query = originalQuery.trim();   // trimmed for typing

        if (!query) {
          cy.log(`Query at index ${index} was empty/whitespace. Adding skipped note to report.`);

          // Add skipped query block to report (show original too)
          htmlReport += `
            <div class="query-block">
              <div class="query skipped">Q${index + 1}: (skipped — empty query: "${originalQuery}")</div>
              <div class="response">—</div>
            </div>
          `;

          return;
        }

        // ✅ Break query into lines and remove empty ones
        const lines = query
          .split(/\n|\t/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

        // ✅ Type into textarea with Shift+Enter for newlines
        cy.get('#myTextArea', { timeout: 60000 })
          .should('be.visible')
          .and('be.enabled')
          .clear()
          .then(($el) => {
            lines.forEach((line, i) => {
              cy.wrap($el).type(line, { force: true });
              if (i < lines.length - 1) {
                cy.wrap($el).type('{shift}{enter}', { force: true });
              }
            });
          });

        // ✅ Finally, send the query with Enter
        cy.get('#myTextArea').type('{enter}', { force: true });

        // Wait until input is enabled again
        cy.get('#myTextArea', { timeout: 60000 })
          .should('be.visible')
          .and('be.enabled');

        // Calculate which child should contain the bot response
        const childIndex = (index + 1) * 2;

        // Scroll into the specific bot response
        cy.get(`:nth-child(${childIndex}) > .va_bot_msg`, { timeout: 60000 })
          .first()
          .scrollIntoView({ offset: { top: -100, left: 0 }, duration: 500 })
          .should('exist')
          .invoke('prop', 'innerHTML')
          .then((responseHtml) => {
            // Append query + response to HTML report
            htmlReport += `
              <div class="query-block">
                <div class="query">Q${index + 1}: ${originalQuery.replace(/\n/g, '<br>')}</div>
                <div class="response">${responseHtml}</div>
              </div>
            `;
          });

        // Optional: verify thumbs up button is visible after response
        cy.get('.thumbs_up', { timeout: 60000 })
          .first()
          .scrollIntoView({ offset: { top: -100, left: 0 }, duration: 500 })
          .should('exist');

        cy.get('#myTextArea').should('be.visible');
      }).then(() => {

        // ✅ Grab conversation ID before closing HTML
        //cy.get('.btc_chat_group .chat_id', { timeout: 60000 })
          //.invoke('text')
          //.then((conversationId) => {

            // ✅ Add summary section at the TOP of report
            const summaryBlock = `
              <div class="summary">
                <div><strong>🕒 Test Run Time:</strong> ${testTimestamp}</div>
                <div><strong>🌐 Tested URL:</strong> ${testUrl}</div>
                <div><strong>🔢 Total Queries Tested:</strong> ${totalQueries}</div>
              </div>
            `;
            htmlReport = htmlReport.replace(
              '<h1>📋 Chatbot Query & Response Log</h1>',
              `<h1>📋 Chatbot Query & Response Log</h1>${summaryBlock}`
            );

            // ✅ Add conversation ID at the bottom
            htmlReport += `
              <div class="conversation">💬 Conversation ID: ${testUrl}</div>
            `;

            // ✅ Log in Cypress test runner
            cy.log('🕒 Test Run Time:', testTimestamp);
            cy.log('🌐 Tested URL:', testUrl);
            cy.log('🔢 Total Queries Tested:', totalQueries);
            cy.log('💬 Conversation ID:', testUrl);

            // Close the HTML
            htmlReport += `</body></html>`;

            // Write results to an HTML file
            cy.writeFile('cypress/results/chatbot_responses.html', htmlReport);

            cy.log('✅ Chatbot responses saved to chatbot_responses.html');
          });
      });
    });
  });
