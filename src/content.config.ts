import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Contenus des pages (textes), un fichier YAML par page et par langue : src/content/pages/<lang>/<page>.yaml */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z.record(z.string(), z.any()),
});

/** Articles de blog : src/content/blog/<lang>/<slug>.md */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    translationKey: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, blog };
