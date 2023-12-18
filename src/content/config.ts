// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

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
	trades: tradesCollection,
};
