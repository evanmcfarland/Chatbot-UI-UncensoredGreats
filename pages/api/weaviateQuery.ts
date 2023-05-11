
import weaviate, { AuthUserPasswordCredentials } from 'weaviate-ts-client';
import { WeaviateResponse, ExtractedData } from '@/types/weaviate';

const WEAVIATE_USERNAME = process.env.WEAVIATE_USERNAME;
const WEAVIATE_PASSWORD = process.env.WEAVIATE_PASSWORD;
const key = process.env.OPENAI_API_KEY;
export async function bookSearch(query: string, breadth: number, scope: string, key: string) {
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
      console.log('Weaviate Results:', res.data.Get[scope]);
      console.log("This function is actually being called and does not get an error");
      return res.data.Get[scope]; 
    })
    .catch((err: Error) => {
      console.error(err);
      console.log("This function is actually being called but gets an error")
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
    console.log("contents: ", contents)
  
    return {
      titles,
      headings,
      contents,
    };
}

