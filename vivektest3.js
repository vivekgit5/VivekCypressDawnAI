/// <reference types="cypress" />

// Helper function to setup the chatbot and read queries from the Excel file
function setupChatbot(testUrl) {
  cy.viewport(1221, 687);
  cy.visit(testUrl);
  cy.wait(5000); // Wait for the page to load completely

  // Manually set the chatbot configuration to simulate form fill
  cy.window().then((win) => {
    win.chatbotConfig = {
      name: "Vivek_new",
      email: "myair.i9ne@taas.dht.live",
      my_therapy_navigator_enabled: true,
      my_therapy_navigator_opt_out: false,
      access_token: "eyJraWQiOiItS2hpSkJVMFRUQUg1UG9QNGxvVVN4dkxVbWpqeGZDNzhOUjl4QWVJeXFJIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjN6ZFJMRE9KbzhBMFhWYnJkd2RfN3NaX1BDMzNzUUF1MlFpbXZiUkw4ZmsiLCJpc3MiOiJodHRwczovL3Jlc21lZC1kaHQtdWF0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzcmNrZGwyNUN6MzY1N2cxZDciLCJhdWQiOiJodHRwczovL2Rhd24ucmVzbWVkLmNvbS9hcGkiLCJpYXQiOjE3NjMyMDYzODksImV4cCI6MTc2MzIwODE4OSwiY2lkIjoiMG9hcmNrNXlscGs2NVFpYXIxZDciLCJ1aWQiOiIwMHVycTBmZHU5dDJxTklUZjFkNyIsInNjcCI6WyJkYXduIl0sImF1dGhfdGltZSI6MTc2MzIwNjM4OSwic3ViIjoibXlhaXIuaTluZUB0YWFzLmRodC5saXZlIn0.IAPeVPvgK3qF9ZEEKLBqKLAYG45R30gibwzpGQYDtT4eLiUCID9nPKrKargTffY6SiRRpkBCQWcg8SL2HsMLoIfQv6IPNe4c33rUepnlAEkkniSjYgXnvoPah8Qa1Z3krJeF5JoF9V6jH-O0B2meCuPQFaEtNbQUBad423ueQXQeoz_YNWCEe6VRPF3h3YzTLM82ekfMHawVdEDFVrItqgh_F2e-q6BbzL81t8RYV6C23G_W43OK2CxiKgTEtJ1s67LhzA4jXGOVmqZ1L1tiD9j0v7YveN1keSwV7K-hthv6e8xyibG259hkxX3su5JCaj8667oVAVVpTtzb3uzMww"  // You can remove or replace with a real token
    };
  });

  // Wait for the chatbot to be ready
  cy.wait(10000);
}

describe('Running Dawn Website Chatbot Automation', function () {
  const testUrl = 'https://chat-myair.dawn-us-pre-prod.dht.live/'; // URL to be tested
  const testTimestamp = new Date().toLocaleString(); // Capture the current test date and time

  // Initialize HTML report structure
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

  it('Run multiple queries in the chatbot and capture HTML responses', function () {
    // Read queries from the Excel file using cy.task()
    cy.task("readExcel", {
      filePath: "cypress/fixtures/queries.xlsx",
      sheetName: "Sheet1"
    }).then((queries) => {
      // Debug log to ensure the queries are being loaded properly
      cy.log("Loaded Queries:", queries);
      const totalQueries = queries.length; // Count the number of queries dynamically

      // Store the queries globally so they can be accessed in the test
      Cypress.env('queries', queries);
      Cypress.env('totalQueries', totalQueries); // Store totalQueries in Cypress.env

      // Proceed with test after queries are loaded
      setupChatbot(testUrl); // Ensure queries are loaded before proceeding

      // Wait for queries to be available in Cypress environment
      cy.wait(2000); // Optional, adjust based on your load time

      // Get the queries and totalQueries from Cypress environment
      const queriesFromEnv = Cypress.env('queries');
      const totalQueriesFromEnv = Cypress.env('totalQueries');

      // Debug log to ensure queries are being used correctly
      cy.log("Loaded Queries for execution:", queriesFromEnv);
      cy.log("Total Queries:", totalQueriesFromEnv);

      // Ensure queries is an array
      if (Array.isArray(queriesFromEnv) && queriesFromEnv.length > 0) {
        // Loop through the queries from the Excel file
        cy.wrap(queriesFromEnv).each((rawQuery, index) => {
          const originalQuery = rawQuery || ""; // Keep the original query for reporting
          const query = originalQuery.trim();   // Trim the query for typing

          // Skip empty or whitespace-only queries
          if (!query) {
            cy.log(`Query at index ${index} was empty/whitespace. Skipping.`);
            htmlReport += `
              <div class="query-block">
                <div class="query skipped">Q${index + 1}: (skipped — empty query: "${originalQuery}")</div>
                <div class="response">—</div>
              </div>
            `;
            return;
          }

          // Type the query into the chatbot input field
          cy.get('#myTextArea', { timeout: 60000 })
            .should('be.visible')
            .and('be.enabled')
            .clear()
            .type(query, { force: true });

          cy.get('#myTextArea').type('{enter}', { force: true });

          // Wait for the response and capture it
          cy.wait(3000);

          cy.get('.va_bot_msg', { timeout: 60000 })
            .last()
            .scrollIntoView()
            .should('exist')
            .invoke('prop', 'innerHTML')
            .then((responseHtml) => {
              // Append the query and response to the HTML report
              htmlReport += `
                <div class="query-block">
                  <div class="query">Q${index + 1}: ${originalQuery.replace(/\n/g, '<br>')}</div>
                  <div class="response">${responseHtml}</div>
                </div>
              `;
            });
        }).then(() => {
          // Add the summary block to the top of the HTML report
          const summaryBlock = `
            <div class="summary">
              <div><strong>🕒 Test Run Time:</strong> ${testTimestamp}</div>
              <div><strong>🌐 Tested URL:</strong> ${testUrl}</div>
              <div><strong>🔢 Total Queries Tested:</strong> ${totalQueriesFromEnv}</div>
            </div>
          `;
          htmlReport = htmlReport.replace(
            '<h1>📋 Chatbot Query & Response Log</h1>',
            `<h1>📋 Chatbot Query & Response Log</h1>${summaryBlock}`
          );

          // Add conversation ID at the bottom (optional)
          htmlReport += `</body></html>`;

          // Save the HTML report
          cy.writeFile('cypress/results/chatbot_responses.html', htmlReport);
          cy.log('✅ Chatbot responses saved to chatbot_responses.html');
        });
      } else {
        cy.log("No queries found or queries are not an array.");
      }
    });
  });

  it('Run MTN evergreen queries in the chatbot and capture HTML responses', function () {
    setupChatbot(testUrl); // Reuse the helper function for setup

    // Use Cypress to interact with the specific query element
    cy.contains('p.va_predefine_text.text-black', 'Is my therapy working for me?').click();
  });
});
