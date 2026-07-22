# Page recipes

Choose one primary recipe. Combine only when the business workflow genuinely spans both structures.

## L01 Standard list

Use for searchable business collections with up to 6 common filters.

Order:

1. Page title, one-line purpose, total count.
2. Filter Card.
3. Query and reset.
4. Table Card with optional sort/export actions.
5. Count and pagination.

Hard rules:

- Put identity first and row actions last.
- Keep one primary query action.
- Demonstrate loading, empty, error, and normal table bodies.
- Keep pagination state local and operable.

## L02 Advanced-filter list

Use when there are more than 6 filters or distinct basic/advanced groups.

Structure:

- Show 3–6 high-frequency filters initially.
- Toggle an advanced region for the rest.
- Show active filter count and removable summary when useful.
- Preserve table and pagination rules from L01.

Do not render 10+ equally weighted fields in one uninterrupted grid.

## D01 Standard detail

Use for a single object with a manageable number of information groups.

Order:

1. Back action, object title, state.
2. Common actions; destructive actions separated.
3. Summary fields.
4. 2–4 grouped detail sections.
5. Related records.

Use description lists or label/value rows. Do not turn every field into a metric card.

## D02 Complex tabbed detail

Use when one object aggregates multiple peer business domains.

Structure:

- Stable identity/summary region.
- Common and destructive action groups.
- Up to 7 peer Tabs.
- Each tab owns its loading, empty, and error state.
- Put tables inside the relevant tab, not at page root.

If more than 7 tabs are required, group them into primary domains or use secondary navigation.

## F01 Create/edit form

Use for creating or modifying one object.

Structure:

1. Page title and scope.
2. Form sections grouped by business meaning.
3. Prefer 4–6 visible fields per group.
4. Inline help and validation near the field.
5. Cancel/back plus one primary save action.
6. Unsaved-change warning demonstration.

Preserve user input during validation errors. Use safe defaults but never invent consequential business defaults.

## A01 Review/approval workspace

Use when the primary job is comparing evidence and making a decision.

Structure:

1. Object identity and current review state.
2. Submitted content/evidence as the largest region.
3. Rule or history context beside or below evidence.
4. Approve/reject actions separated from navigation.
5. Rejection reason required when business rules demand it.
6. Confirmation and success feedback.

Do not place approve and reject as visually identical primary actions. Make consequences explicit.
