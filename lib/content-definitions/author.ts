import { s } from 'velite';

export const Author = s.object({
  name: s.string(),
  image: s.string().optional(),
});
