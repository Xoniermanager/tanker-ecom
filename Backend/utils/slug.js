const slugify = require("slugify");

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

module.exports = { generateSlugIfNeeded };
