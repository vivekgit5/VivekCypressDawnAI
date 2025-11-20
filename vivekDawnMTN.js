/// <reference types="cypress" />

describe('Running Dawn Website Chatbot Automation', function () {
  const testUrl = 'https://chat-myair.dawn-us-pre-prod.dht.live/'; // URL to be tested
  let totalQueries = 0; // To count the number of queries
  const testTimestamp = new Date().toLocaleString(); // Capture current test date and time

  // Start building the HTML report for normal queries
  let normalHtmlReport = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Chatbot Responses - MTN Normal Queries</title>
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
        .response {
          margin-top: 5px;
          padding: 12px; 
          background: #f4f6f9; 
          border-radius: 6px; 
          border-left: 4px solid #3498db;
        }
      </style>
    </head>
    <body>
    <h1>📋 Chatbot Query & Response Log - Normal Queries</h1>
  `;

  // Start building the HTML report for predefined queries
  let predefinedHtmlReport = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Chatbot Responses - MTN Predefined Queries</title>
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
        .response {
          margin-top: 5px;
          padding: 12px; 
          background: #f4f6f9; 
          border-radius: 6px; 
          border-left: 4px solid #3498db;
        }
      </style>
    </head>
    <body>
    <h1>📋 Chatbot Query & Response Log - Predefined Queries</h1>
  `;

  it('Run predefined and multiple queries in the chatbot and capture HTML responses', function () {
    // Read queries from Excel
    cy.task("readExcel", {
      filePath: "cypress/fixtures/queries.xlsx",
      sheetName: "Sheet1"
    }).then((queries) => {
      totalQueries = queries.length; // Count queries dynamically

      // Setup viewport and visit the chatbot URL
      cy.viewport(1221, 687);
      cy.visit(testUrl);
      cy.wait(5000); // Wait for the page to load completely

      // Manually set chatbotConfig to simulate form fill
      cy.window().then((win) => {
        win.chatbotConfig = {
          name: "Vivek",
          email: "myair.rdm3@taas.dht.live",
          my_therapy_navigator_enabled: true,
          my_therapy_navigator_opt_out: false,
          access_token: "eyJraWQiOiItS2hpSkJVMFRUQUg1UG9QNGxvVVN4dkxVbWpqeGZDNzhOUjl4QWVJeXFJIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmY3Qjg3ZGFoNE43TmR5Slg5OG1FaXhiRV9nZUdYUkU1UUxBTEN1Vk5RNDgiLCJpc3MiOiJodHRwczovL3Jlc21lZC1kaHQtdWF0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzcmNrZGwyNUN6MzY1N2cxZDciLCJhdWQiOiJodHRwczovL2Rhd24ucmVzbWVkLmNvbS9hcGkiLCJpYXQiOjE3NjM2MjQxOTYsImV4cCI6MTc2MzYyNTk5NiwiY2lkIjoiMG9hcmNrNXlscGs2NVFpYXIxZDciLCJ1aWQiOiIwMHVycTJlazZ6RDdsazN6SzFkNyIsInNjcCI6WyJkYXduIl0sImF1dGhfdGltZSI6MTc2MzYyNDE5Niwic3ViIjoibXlhaXIucmRtM0B0YWFzLmRodC5saXZlIn0.cs_ZpRFwSUBb4Ob7cff8MPMn4v7TuTDokrVWpv3GF3zJaBiKJCddOuqfnAe4O3DoMKnjUfoN1IIsFTsNakLz7d3Gy5y9SFhTtMeFwwQ3IHUqTRLpkCYWEvN44duAN1H462MVHTGhh1AcAAh3CF1uaDZKqcu3i5ko1e_WS6F2Dwim0rG3ijvTcrpccz7MWjL-PG3Jtki6dbxACHq0Rz9_9fiedZ8eOjvUaNefGSjphhUsLFMFTPqD_9Bg9EuJMjaV4LOyyuRLnmXLAcOjgbW6bdd0UgXJOpXKnyYWgvBKQ_zMnHtS_8bP_-Qs7F1XVvWI-g1Ypl-s0F5WAXTDWhi0_w" // Make sure the token is valid
        };
      });

      // Wait for the chatbot to be ready to interact
      cy.wait(10000);

      // 1. **Run Predefined Queries First** (Test Predefined Queries)
      const predefinedQueries = [
        ':nth-child(1) > .va_predefine_text',
        ':nth-child(2) > .va_predefine_text',
        ':nth-child(3) > .va_predefine_text'
      ];

      predefinedQueries.forEach((querySelector, index) => {
        
        // Capture the actual query text before clicking the predefined query
        cy.get(querySelector).invoke('text').then((queryText) => {
          // Click predefined query
          cy.get(querySelector).click();

          // Wait for NEW BOT MESSAGE to appear
          cy.get('.va_bot_msg', { timeout: 60000 })
            .should('have.length.greaterThan', 0);

          // Capture *latest* bot message, not first()
          cy.get('.va_bot_msg')
            .last()
            .scrollIntoView()
            .should('exist')
            .invoke('prop', 'innerHTML')
            .then((predefinedResponse) => {

              predefinedHtmlReport += `
                <div class="query-block">
                  <div class="query">${queryText}</div> <!-- Display the actual predefined query -->
                  <div class="response">${predefinedResponse}</div>
                </div>
              `;
            });

          // Wait for thumbs-up button to appear (to ensure full response is rendered)
          cy.get('.thumbs_up', { timeout: 60000 })
            .first()
            .scrollIntoView({ offset: { top: -100, left: 0 }, duration: 500 })
            .should('exist');

          // Close the query interaction (using the close button)
          cy.get('.icn-close').click();

          // Optionally, click the 'Chat with us' button again if necessary
          cy.get('.btn.btn-outline-danger').click();
        });
      });

      // 2. **Now Run Normal Queries**
      cy.wrap(queries).each((rawQuery, index) => {
        const originalQuery = rawQuery || ""; // Keep original query for reporting
        const query = originalQuery.trim();   // Trim the query for typing

        // Skip empty or whitespace-only queries
        if (!query) {
          cy.log(`Query at index ${index} was empty/whitespace. Adding skipped note to report.`);
          normalHtmlReport += `
            <div class="query-block">
              <div class="query skipped">Q${index + 1}: (skipped — empty query: "${originalQuery}")</div>
              <div class="response">—</div>
            </div>
          `;
          return;
        }

        // Break query into lines and remove empty ones
        const lines = query
          .split(/\n|\t/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

        // Type query into the chatbot input field (textarea)
        cy.get('#myTextArea', { timeout: 60000 })
          .should('be.visible')
          .and('be.enabled')
          .clear()
          .then(($el) => {
            lines.forEach((line, i) => {
              cy.wrap($el).type(line, { force: true });
              if (i < lines.length - 1) {
                cy.wrap($el).type('{shift}{enter}', { force: true }); // Use Shift+Enter for newlines
              }
            });
          });

        // Send the query with Enter key
        cy.get('#myTextArea').type('{enter}', { force: true });

        // Wait until the input is enabled again
        cy.get('#myTextArea', { timeout: 60000 })
          .should('be.visible')
          .and('be.enabled');

        // Scroll into the response element and capture the bot response
        const childIndex = (index + 1) * 2;
        cy.get(`:nth-child(${childIndex}) > .va_bot_msg`, { timeout: 60000 })
          .first()
          .scrollIntoView({ offset: { top: -100, left: 0 }, duration: 500 })
          .should('exist')
          .invoke('prop', 'innerHTML')
          .then((responseHtml) => {
            // Append query and response to HTML report for normal queries
            normalHtmlReport += `
              <div class="query-block">
                <div class="query">Q${index + 1}: ${originalQuery.replace(/\n/g, '<br>')}</div>
                <div class="response">${responseHtml}</div>
              </div>
            `;
          });

        // Optionally verify thumbs-up button visibility after response
        cy.get('.thumbs_up', { timeout: 60000 })
          .first()
          .scrollIntoView({ offset: { top: -100, left: 0 }, duration: 500 })
          .should('exist');

        cy.get('#myTextArea').should('be.visible');
      }).then(() => {
        // Add summary block to the top of the HTML report for normal queries
        const summaryBlock = `
          <div class="summary">
            <div><strong>🕒 Test Run Time:</strong> ${testTimestamp}</div>
            <div><strong>🌐 Tested URL:</strong> ${testUrl}</div>
            <div><strong>🔢 Total Queries Tested:</strong> ${totalQueries}</div>
          </div>
        `;
        normalHtmlReport = normalHtmlReport.replace(
          '<h1>📋 Chatbot Query & Response Log</h1>',
          `<h1>📋 Chatbot Query & Response Log</h1>${summaryBlock}`
        );

        // Add conversation ID at the bottom (optional)
        normalHtmlReport += `
          <div class="conversation">💬 Conversation ID: ${testUrl}</div>
        `;

        // Log final details in Cypress test runner
        cy.log('🕒 Test Run Time:', testTimestamp);
        cy.log('🌐 Tested URL:', testUrl);
        cy.log('🔢 Total Queries Tested:', totalQueries);
        cy.log('💬 Conversation ID:', testUrl);

        // Close HTML document and write to file for normal queries
        normalHtmlReport += `</body></html>`;
        cy.writeFile('cypress/results/chatbot_normal_responses.html', normalHtmlReport);

        // Close HTML document and write to file for predefined queries
        predefinedHtmlReport += `</body></html>`;
        cy.writeFile('cypress/results/chatbot_predefined_responses.html', predefinedHtmlReport);

        cy.log('✅ Normal and predefined chatbot responses saved to respective HTML files');
      });
    });
  });
});
