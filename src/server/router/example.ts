import { createRouter } from './context';
import { z } from 'zod';
import axios from 'axios';

const DATABASE_URL = 'https://jsonplaceholder.typicode.com';

const ZodToDo = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

type ToDo = z.infer<typeof ZodToDo>;

export const exampleRouter = createRouter()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? 'world'}`,
      };
    },
  })
  .query('getTodos', {
    async resolve(): Promise<ToDo[]> {
      const response = await axios
        .get<ToDo[]>(`${DATABASE_URL}/todos`)
        .then((data) => data.data.map((dataItem) => ZodToDo.parse(dataItem)));

      return response;
    },
  });
