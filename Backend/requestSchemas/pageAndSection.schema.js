const { z } = require("zod");

const thumbnailSchema = z
    .object({
        type: z.enum(["video", "image"]),
        source: z.string(),
    })
    .optional();

const ctaSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("phone"),
        label: z.string().optional(),
        text: z.string().min(1, { message: "CTA text is required." }),
        phone_number: z.string().min(1, { message: "Phone number is required for type 'phone'" }),
    }),
    z.object({
        type: z.literal("link"),
        label: z.string().optional(),
        text: z.string().min(1, { message: "CTA text is required." }),
        link: z.string().min(1, { message: "Link is required for type 'link'" }),
    }),
]);

const contentSchema = z.lazy(() =>
    z.discriminatedUnion("type", [
        z.object({
            order: z.number(),
            type: z.literal("text"),
            label: z.string().optional(),
            text: z.string().min(1),
            suffix: z.string().optional()
        }),
        z.object({
            order: z.number(),
            type: z.literal("list"),
            label: z.string().optional(),
            contents: z.array(contentSchema).min(1),
            
        }),
        z.object({
            order: z.number(),
            type: z.literal("group"),
            label: z.string().optional(),
            contents: z.array(contentSchema).min(1),
        }),
        z.object({
            order: z.number(),
            type: z.literal("cards"),
            label: z.string().optional(),
            contents: z.array(contentSchema).min(1),
        }),
        z.object({
            order: z.number(),
            type: z.literal("card"),
            label: z.string().optional(),
            title: z.string().min(1),
            description: z.string().min(1),
        }),
        z.object({
            order: z.number(),
            type: z.literal("reference_content"),
            label: z.string().optional(),
            ref: z.string().min(1),
            limit: z.number().optional(),
        }),
        z.object({
            order: z.number(),
            type: z.literal("phone"),
            label: z.string().optional(),
            text: z.string().min(1),
            phone_number: z.string().min(1),
        }),
        z.object({
            order: z.number(),
            type: z.literal("link"),
            label: z.string().optional(),
            text: z.string().min(1),
            link: z.string().min(1),
        }),
    ])
);

const sectionSchema = z.object({
    section_id: z.string().min(1, { message: "Section ID is required." }),
    heading: z.string().min(1),
    subheading: z.string().min(1),
    order: z.number(),
    thumbnail: thumbnailSchema,
    contents: z.array(contentSchema).min(1),
});

const upsertPageSchema = z.object({
    seo: z.object({
        metaTitle: z.string().min(1),
        metaDescription: z.string().min(1),
        ogImage: z.string().optional(),
    }),
    sections: z.array(sectionSchema).min(1),
});

const updateSectionSchema = sectionSchema.omit({ section_id: true });

module.exports = {
    upsertPageSchema,
    updateSectionSchema,
};
