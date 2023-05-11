/* 
TLDR: This file is the actual API request that includes 
the prompt and relevant info, and returns the text response in a stream.


Imoporting the DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE, OpenAIError, and OpenAIStream from the utils folder,
chatbody and message from the types folder, and wasm, Tiktoken, and init from the tiktoken library.

The function takes a Request object as an argument and returns a Promise of a Response.

The Request object is expected to be in JSON format and contain certain properties,
such as model, messages, key, prompt, and temperature. These properties are destructured
from the parsed JSON request.

The tiktoken library is initialized with a WASM module, 
and a new Tiktoken instance is created. The Tiktoken instance is 
used to encode text into tokens, a common operation in natural
language processing (NLP).

If the prompt from the request is not provided or is empty, 
the function uses DEFAULT_SYSTEM_PROMPT as a fallback. Similarly, 
if the temperature is not provided, it uses DEFAULT_TEMPERATURE.

The prompt is encoded into tokens using the Tiktoken instance, 
and the number of tokens is counted.

The function then checks each message in the messages array from the request, 
starting from the end. Each message is encoded into tokens, and if the total 
number of tokens (including a buffer of 1000 tokens) doesn't exceed the 
model's token limit, the message is added to the messagesToSend array.

Once all valid messages have been added to messagesToSend, 
the Tiktoken instance is freed to free up memory.

The function then calls OpenAIStream with the model, prompt, temperature, 
key, and messagesToSend to make a request to OpenAI's API. 
The returned stream of data is wrapped in a Response object and returned.

If any error occurs during this process, it is caught and handled. 
If the error is an instance of OpenAIError, the function returns a 
Response with a 500 status code and the error message. 
If the error is of any other type, it returns a Response with a 500 status code and a generic 'Error' message.

*/

import { bookSearch, extractData } from '@/pages/api/weaviateQuery'; // NEW

import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';

import { ChatBody, Message } from '@/types/chat';

// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

export const config = {
  runtime: 'edge',
};

const breadth = 5 // NEW
const scope = "Carl_Segments" // NEW


const handler = async (req: Request): Promise<Response> => {
  try {
    const { model, messages, key, prompt, temperature } = (await req.json()) as ChatBody;

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }

    const userMessage = messages[messages.length - 1];    // NEW
    const query = userMessage.content.trim();      // NEW
    console.log("Before Bookrsearch")
    const weaviateResults = await bookSearch(query, breadth, scope, key);  // NEW
    console.log("After Booksearch")
    const { contents } = extractData(weaviateResults);  // NEW
    const contentString = contents.join('\n');         // NEW

    promptToSend += "\nRespond using the provided context as if you are Carl Jung: context by Carl Jung: " + contentString;       // NEW
    console.log(promptToSend)
    const prompt_tokens = encoding.encode(promptToSend); 

    let tokenCount = prompt_tokens.length;
    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = encoding.encode(message.content);

      if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
        break;
      }
      tokenCount += tokens.length;
      messagesToSend = [message, ...messagesToSend];
    }

    encoding.free();

    const stream = await OpenAIStream(model, promptToSend, temperatureToUse, key, messagesToSend);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;









// OG Chat Code: 


// import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
// import { OpenAIError, OpenAIStream } from '@/utils/server';

// import { ChatBody, Message } from '@/types/chat';

// // @ts-expect-error
// import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';

// import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
// import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

// export const config = {
//   runtime: 'edge',
// };

// const handler = async (req: Request): Promise<Response> => {
//   try {
//     const { model, messages, key, prompt, temperature } = (await req.json()) as ChatBody;

//     await init((imports) => WebAssembly.instantiate(wasm, imports));
//     const encoding = new Tiktoken(
//       tiktokenModel.bpe_ranks,
//       tiktokenModel.special_tokens,
//       tiktokenModel.pat_str,
//     );

//     let promptToSend = prompt;
//     if (!promptToSend) {
//       promptToSend = DEFAULT_SYSTEM_PROMPT;
//     }

//     let temperatureToUse = temperature;
//     if (temperatureToUse == null) {
//       temperatureToUse = DEFAULT_TEMPERATURE;
//     }

//     const prompt_tokens = encoding.encode(promptToSend);

//     let tokenCount = prompt_tokens.length;
//     let messagesToSend: Message[] = [];

//     for (let i = messages.length - 1; i >= 0; i--) {
//       const message = messages[i];
//       const tokens = encoding.encode(message.content);

//       if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
//         break;
//       }
//       tokenCount += tokens.length;
//       messagesToSend = [message, ...messagesToSend];
//     }

//     encoding.free();

//     const stream = await OpenAIStream(model, promptToSend, temperatureToUse, key, messagesToSend);

//     return new Response(stream);
//   } catch (error) {
//     console.error(error);
//     if (error instanceof OpenAIError) {
//       return new Response('Error', { status: 500, statusText: error.message });
//     } else {
//       return new Response('Error', { status: 500 });
//     }
//   }
// };

// export default handler;