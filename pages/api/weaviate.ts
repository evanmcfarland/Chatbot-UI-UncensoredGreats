/* If Readability was working, this takes the google search
and cuts the relevant html extracted data down to the first 2000 chars.
Need to revamp this to be a weaviate search. 
 */


// New Code For Weaviate Search

// Just Carl Jung for now, but this will be the thing.
// import authorData from '@/data/author_data.json';

// function get_random_author() {
//   const authors = Object.keys(authorData);
//   return authors[Math.floor(Math.random() * authors.length)];
// }


const carlJung: Author = {
  category: ["Psychology", "Mysticism", "Philosophy"],
  cap_first: "Carl",
  first: "carl",
  last: "jung",
  image: "carlpfp.png",
  description:
    "_🇨🇭 Psychiatrist & Psychoanalyst (1875-1961) | 🌐 Founder of Analytical Psychology | 🧠 Pioneer of the collective unconscious, archetypes, & individuation | 🌠 \"Show me a sane man and I will cure him for you.\"_",
  books: [
    "Psychiatric Studies",
    "Psychogenesis of Mental Disease",
    "Freud and Psychoanalysis",
    "Symbols of Transformation",
    "Psychological Types",
    "Analytical Psychology",
    "Structure and Dynamics of the Psyche",
    "I Archetypes and the Collective Unconscious",
    "II AION Researches into the Phenomenology of the Self",
    "Civilization in Transition",
    "Psychology and Religion West and East",
    "Psychology and Alchemy",
    "Alchemical Studies",
    "Mysterium Coniunctionis",
    "Spirit in Man, Art, and Literature",
    "Practice of Psychotherapy",
    "Development of Personality",
    "The Symbolic Life",
  ],
  sentences_json:
    "https://raw.githubusercontent.com/evanmcfarland/A-Statistical-Approach-to-Happiness/main/data/Carl%20Jung/jung_books_sentences.json",
  segments_json:
    "https://raw.githubusercontent.com/evanmcfarland/A-Statistical-Approach-to-Happiness/main/data/Carl%20Jung/jung_books_segments.json",
  paragraphs_json:
    "https://raw.githubusercontent.com/evanmcfarland/A-Statistical-Approach-to-Happiness/main/data/Carl%20Jung/jung_books_paragraphs.json",
};

import { NextApiRequest, NextApiResponse } from 'next';
import weaviate, { AuthUserPasswordCredentials }  from 'weaviate-ts-client';

import { OPENAI_API_HOST } from '@/utils/app/const';

import { Message } from '@/types/chat';
import endent from 'endent';

import { WeaviateBody, WeaviateResponse, Author, ExtractedData } from '@/types/weaviate';

const breadth = 5;
const scope = `${carlJung.cap_first}_Segments`;

const WEAVIATE_USERNAME = process.env.WEAVIATE_USERNAME as string;
const WEAVIATE_PASSWORD = process.env.WEAVIATE_PASSWORD as string;
const key = process.env.OPENAI_API_KEY;
export async function bookSearch(query: string, breadth: number, scope: string, key: string) {
  console.log('Breadth value:', breadth)
  const client = weaviate.client ({
    scheme: 'https',
    host: 'uncensoredgreats.weaviate.network',
    headers: { 'X-OpenAI-Api-Key' : key },
    authClientSecret: new AuthUserPasswordCredentials({
      username: WEAVIATE_USERNAME,
      password: WEAVIATE_PASSWORD,
    })
  });

  return client.graphql
    .get()
    .withClassName(scope)
    .withFields('title heading content')
    .withNearText({ concepts: [query] })
    .withLimit(breadth)
    .do()
    .then((res: any) => {
      // return res.data.Get[scope].items; // So this doesn't get the response in at all.
      return res.data.Get[scope];  // This gets it working, but returns an error from chat.ts somethimes around line 3000, where length=0?
    })
    .catch((err: Error) => {
      console.error(err)
    });
}

export function extractData(sources: WeaviateResponse[]): ExtractedData {
  if (!sources || sources.length === 0) {
    return {
      titles: [],
      headings: [],
      contents: [],
    };
  }

  const titles = sources.map((r) => r.title);
  const headings = sources.map((r) => r.heading);
  const contents = sources.map((r) => r.content);


  return {
    titles,
    headings,
    contents,
  };
}


const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { messages, key, model } = req.body as WeaviateBody;
    console.log('messages', messages)

    const userMessage = messages[messages.length - 1];
    const query = userMessage.content.trim();

    const scope = `${carlJung.cap_first}_Segments`;
    const weaviateResults = await bookSearch(query, breadth, scope, key);
    const { contents } = extractData(weaviateResults);

    const contentString = contents.join('\n');

    const answerRes = await fetch(`${OPENAI_API_HOST}/v1/chat/completions`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`,
        ...(process.env.OPENAI_ORGANIZATION && {
          'OpenAI-Organization': process.env.OPENAI_ORGANIZATION,
        }),
      },
      method: 'POST',
      body: JSON.stringify({
        model: model.id,
        messages: [
          {role: 'system', content: ("You are Carl Jung.")},
          {role: 'user', content: (query + "Respond using the provided context as if you are Carl Jung: " + "context by Carl Jugn: " +  contentString )},
        ],
        
        max_tokens: 1000,
        temperature: 1,
        stream: false,
      }),
    });
    console.log('query', query)
    console.log('contents', contents)

    const { choices: choices2 } = await answerRes.json();
    const answer = choices2[0].message.content;

    console.log('OpenAI API Response:', answer);
    console.log("Messages after response", messages)

    res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error' });
  }
};

export default handler;



 




// // OG Code that queries Google.
// import { NextApiRequest, NextApiResponse } from 'next';

// import { OPENAI_API_HOST } from '@/utils/app/const';
// import { cleanSourceText } from '@/utils/server/google';

// import { Message } from '@/types/chat';
// import { GoogleBody, GoogleSource } from '@/types/google';

// import { Readability } from '@mozilla/readability';
// import endent from 'endent';
// import jsdom, { JSDOM } from 'jsdom';

// // Handler function that takes a request and response object. Includes API request input requirements.
// const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
//   try {
//     const { messages, key, model, googleAPIKey, googleCSEId } =
//       req.body as GoogleBody;

//     const userMessage = messages[messages.length - 1];
//     const query = encodeURIComponent(userMessage.content.trim());

//     const googleRes = await fetch(
//       `https://customsearch.googleapis.com/customsearch/v1?key=${
//         googleAPIKey ? googleAPIKey : process.env.GOOGLE_API_KEY
//       }&cx=${
//         googleCSEId ? googleCSEId : process.env.GOOGLE_CSE_ID
//       }&q=${query}&num=5`,
//     );

//     const googleData = await googleRes.json();

//     const sources: GoogleSource[] = googleData.items.map((item: any) => ({
//       title: item.title,
//       link: item.link,
//       displayLink: item.displayLink,
//       snippet: item.snippet,
//       image: item.pagemap?.cse_image?.[0]?.src,
//       text: '',
//     }));

//     const sourcesWithText: any = await Promise.all(
//       sources.map(async (source) => {
//         try {
//           const timeoutPromise = new Promise((_, reject) =>
//             setTimeout(() => reject(new Error('Request timed out')), 5000),
//           );

//           const res = (await Promise.race([
//             fetch(source.link),
//             timeoutPromise,
//           ])) as any;

//           // if (res) {
//           const html = await res.text();

//           const virtualConsole = new jsdom.VirtualConsole();
//           virtualConsole.on('error', (error) => {
//             if (!error.message.includes('Could not parse CSS stylesheet')) {
//               console.error(error);
//             }
//           });

//           const dom = new JSDOM(html, { virtualConsole });
//           const doc = dom.window.document;
//           const parsed = new Readability(doc).parse();

//           if (parsed) {
//             let sourceText = cleanSourceText(parsed.textContent);

//             return {
//               ...source,
//               // TODO: switch to tokens
//               text: sourceText.slice(0, 2000),
//             } as GoogleSource;
//           }
//           // }

//           return null;
//         } catch (error) {
//           console.error(error);
//           return null;
//         }
//       }),
//     );

//     const filteredSources: GoogleSource[] = sourcesWithText.filter(Boolean);

//     const answerPrompt = endent`
//     Provide me with the information I requested. Use the sources to provide an accurate response. Respond in markdown format. Cite the sources you used as a markdown link as you use them at the end of each sentence by number of the source (ex: [[1]](link.com)). Provide an accurate response and then stop. Today's date is ${new Date().toLocaleDateString()}.

//     Example Input:
//     What's the weather in San Francisco today?

//     Example Sources:
//     [Weather in San Francisco](https://www.google.com/search?q=weather+san+francisco)

//     Example Response:
//     It's 70 degrees and sunny in San Francisco today. [[1]](https://www.google.com/search?q=weather+san+francisco)

//     Input:
//     ${userMessage.content.trim()}

//     Sources:
//     ${filteredSources.map((source) => {
//       return endent`
//       ${source.title} (${source.link}):
//       ${source.text}
//       `;
//     })}

//     Response:
//     `;

//     const answerMessage: Message = { role: 'user', content: answerPrompt };

//     const answerRes = await fetch(`${OPENAI_API_HOST}/v1/chat/completions`, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`,
//         ...(process.env.OPENAI_ORGANIZATION && {
//           'OpenAI-Organization': process.env.OPENAI_ORGANIZATION,
//         }),
//       },
//       method: 'POST',
//       body: JSON.stringify({
//         model: model.id,
//         messages: [
//           {
//             role: 'system',
//             content: `Use the sources to provide an accurate response. Respond in markdown format. Cite the sources you used as [1](link), etc, as you use them. Maximum 4 sentences.`,
//           },
//           answerMessage,
//         ],
//         max_tokens: 1000,
//         temperature: 1,
//         stream: false,
//       }),
//     });

//     const { choices: choices2 } = await answerRes.json();
//     const answer = choices2[0].message.content;

//     res.status(200).json({ answer });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error'})
//   }
// };

// export default handler;
