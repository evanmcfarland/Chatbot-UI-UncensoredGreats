// import { ChatBody, Message } from './chat';

// export interface GoogleBody extends ChatBody {
//   googleAPIKey: string;
//   googleCSEId: string;
// }

// export interface GoogleResponse {
//   message: Message;
// }

// export interface GoogleSource {
//   title: string;
//   link: string;
//   displayLink: string;
//   snippet: string;
//   image: string;
//   text: string;
// }

// weaviate.ts
import { ChatBody, Message } from './chat';

export interface WeaviateBody extends ChatBody {
  weaviateAPIKey: string;
  weaviateCSEId: string;
}

export interface WeaviateResponse {
  title: string;
  heading: string;
  content: string;
}

export interface Author {
  category: string[];
  cap_first: string;
  first: string;
  last: string;
  image: string;
  description: string;
  books: string[];
  sentences_json: string;
  segments_json: string;
  paragraphs_json: string;
}

export type ExtractedData = {
  titles: string[];
  headings: string[];
  contents: string[];
};

