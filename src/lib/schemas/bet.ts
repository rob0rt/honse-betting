import { BetType } from '$lib/prisma/enums';
import * as v from 'valibot';

// Win, Place, Show
export const SingleHorseBetSchema = v.object({
	horse: v.number()
});

export const ExactaBetSchema = v.object({
	first: v.number(),
	second: v.number(),
	box: v.boolean()
});

export const TrifectaBetSchema = v.object({
	first: v.number(),
	second: v.number(),
	third: v.number(),
	box: v.boolean()
});

export const BetDataSchema = v.intersect([
	v.union([
		v.object({
			type: v.union([v.literal(BetType.WIN), v.literal(BetType.PLACE), v.literal(BetType.SHOW)]),
			data: SingleHorseBetSchema
		}),
		v.object({
			type: v.literal(BetType.EXACTA),
			data: ExactaBetSchema
		}),
		v.object({
			type: v.literal(BetType.TRIFECTA),
			data: TrifectaBetSchema
		})
	]),
	v.object({
		amount: v.number()
	})
]);

export type Bet = v.InferOutput<typeof BetDataSchema>;
