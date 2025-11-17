import * as v from 'valibot';

export const AccessTokenResponseSchema = v.object({
	access_token: v.string(),
	token_type: v.string(),
	expires_in: v.number(),
	refresh_token: v.string(),
	scope: v.string()
});

export type AccessTokenResponse = v.InferOutput<typeof AccessTokenResponseSchema>;
