# Repository Instructions

These instructions apply to the whole repository.

## Purpose

Maintain admin-prototype-builder as a portable Codex Skill. Preserve the bundled React runtime, standard components, references, export scripts, and offline-HTML contract.

## Change rules

- Keep generated prototypes, node_modules, dist, screenshots, credentials, real business data, and local caches out of the repository.
- Do not add real API endpoints, tokens, passwords, private keys, customer data, or production configuration.
- Keep SKILL.md concise and place detailed domain guidance in references/.
- Validate scripts after changing them and run the Skill quick validator before publishing.
- Update README when installation, usage, output, or repository structure changes.

## Versioning

Every change intended for main must increment assets/platform-runtime/package.json:

- Patch: documentation, fixes, validation, or compatible maintenance.
- Minor: backward-compatible capabilities, components, recipes, or workflows.
- Major: incompatible behavior, structure, or installation changes.

Keep the README current stable version equal to v plus the package version. Never reuse or move an existing version Tag.
Update .github/RELEASE_NOTES.md for every version. Write the title and all explanatory content in Chinese, and keep its first heading equal to the version Tag.
Keep Release notes focused on update content. Do not include usage-impact or validation-result sections in the public Release body.

## Pull request and release

1. Work on a codex/* branch.
2. Run node .github/scripts/validate-release.mjs --base <main SHA> before merging.
3. Describe changes, user impact, and validation in the pull request.
4. Merge through a pull request; do not push ordinary updates directly to main.
5. Let .github/workflows/release.yml create the Tag, clean ZIP, and GitHub Release after the merge. Release titles must contain only the version number, such as v2.0.4.
6. Confirm the workflow succeeds and the new Release is downloadable by authorized collaborators.
7. If automatic release fails, fix the workflow or repository state. Do not create a mismatched manual Release.

A formal repository update is incomplete until its GitHub Release exists.
