/**
Script used to return API model details in a standardized format to send back to the person.

Without it, we wouldn't be able to communicate with OpenAI or Azure Servers.

API Handler for OpenAI or Azure API models, setups for fetch request is done for both.
Handle the request and return the response, parse the json, map the models to an array and filter non-matching ones.
Return the response with the models array and status 200.

 */




import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { key } = (await req.json()) as {
      key: string;
    };

    let url = `${OPENAI_API_HOST}/v1/models`;
    if (OPENAI_API_TYPE === 'azure') {
      url = `${OPENAI_API_HOST}/openai/deployments?api-version=${OPENAI_API_VERSION}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(OPENAI_API_TYPE === 'openai' && {
          Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
        }),
        ...(OPENAI_API_TYPE === 'azure' && {
          'api-key': `${key ? key : process.env.OPENAI_API_KEY}`
        }),
        ...((OPENAI_API_TYPE === 'openai' && OPENAI_ORGANIZATION) && {
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        }),
      },
    });

    if (response.status === 401) {
      return new Response(response.body, {
        status: 500,
        headers: response.headers,
      });
    } else if (response.status !== 200) {
      console.error(
        `OpenAI API returned an error ${
          response.status
        }: ${await response.text()}`,
      );
      throw new Error('OpenAI API returned an error');
    }

    const json = await response.json();

    const models: OpenAIModel[] = json.data
      .map((model: any) => {
        const model_name = (OPENAI_API_TYPE === 'azure') ? model.model : model.id;
        for (const [key, value] of Object.entries(OpenAIModelID)) {
          if (value === model_name) {
            return {
              id: model.id,
              name: OpenAIModels[value].name,
            };
          }
        }
      })
      .filter(Boolean);

    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
