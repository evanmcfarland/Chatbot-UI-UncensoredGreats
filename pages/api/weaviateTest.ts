import fetch from 'node-fetch';

async function testApi() {
    const messages = [
      // Add your test messages here
      { role: 'user', content: 'What is the importance of Carl Jung\'s work?' }
    ];
  
    const key = ''; // Your OpenAI API Key if you want to test with it
    const model = { id: 'text-davinci-002' }; // Or use any other available model
  
    const response = await fetch('http://localhost:3000/api/your-api-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        key,
        model,
      }),
    });
  
    const data = await response.json();
    console.log(data);
  }
  
  testApi();
  