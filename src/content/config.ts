// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

// Define a `type` and `schema` for each collection
const reportsCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		pubDate: z.date(),
		author: z.string(),
		tags: z.array(z.string()),
	}),
});

const tradesCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		entryDate: z.date(),
		entryPrice: z.number(),
		initialStopLoss: z.number(),
		shares: z.number(),
		exitDate: z.date().optional(),
		exitPrice: z.number().optional(),
	}),
});

// Export a single `collections` object to register your collection(s)
export const collections = {
	reports: reportsCollection,
	trades: tradesCollection,
};
