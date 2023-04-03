import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey:"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",
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{role: "user", content: "Hello world"}],
});
console.log(completion.data.choices[0].message);
