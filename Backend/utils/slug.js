const slugify = require("slugify");
const {v4: uuidv4} = require("uuid");

async function generateSlugIfNeeded(title, slug, repository, session) {
    const baseSlug = slug || slugify(title, { lower: true, strict: true });

    let finalSlug = baseSlug;
    let suffix = 1;

    while (await repository.findBySlug(finalSlug, session)) {
        finalSlug = `${baseSlug}-${suffix}`;
        suffix++;
    }

    return finalSlug;
}

async function generateBulkSlug(title = none, repository = none, session = none) {
    const baseSlug = slugify(title, { lower: true, strict: true });
     
    let finalSlug = `${baseSlug}-${uuidv4()}`;

    return finalSlug
}

module.exports = { generateSlugIfNeeded, generateBulkSlug };
