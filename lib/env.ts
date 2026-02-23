import { z } from 'zod';

/**
 * Environment variable validation schema
 * Ensures all required env vars are present and valid
 */
const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url('Must be a valid URL').min(1, 'API URL is required'),
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().min(1, 'Paystack public key is required'),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validated and type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables at build time
 * Throws if validation fails
 */
function validateEnv(): Env {
    const parsed = envSchema.safeParse({
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        NODE_ENV: process.env.NODE_ENV,
    });

    if (!parsed.success) {
        console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables');
    }

    return parsed.data;
}

/**
 * Validated environment variables
 * Use this instead of process.env directly
 */
export const env = validateEnv();
