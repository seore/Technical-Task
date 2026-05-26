import {z} from "zod";

export const productQuerySchema = z.object ({
    q: z.string().trim().max(100).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    tag: z.string().trim().max(50).optional(),
    sort: z.enum(["price_asc", "price_desc", "rating_desc"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export type ProductQ = z.infer<typeof productQuerySchema>;