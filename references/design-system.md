# Backend design system

Use this as the visual contract. Actual values come from the selected runtime's `src/index.css`, `tailwind.config.ts`, and `src/components/ui`. The bundled V2 runtime is a portable extraction of the same standard.

## Direction

- Professional, restrained, clear, and trustworthy.
- Neutral black/white/grey foundation.
- Establish hierarchy through typography, spacing, and grouping rather than decoration.
- Use rounded controls to soften dense admin work, without marketing-style effects.

## Semantic tokens

Use only semantic Tailwind colors:

- `background`: page background.
- `card`: content surface.
- `foreground`: headings and primary information.
- `muted` / `muted-foreground`: secondary surfaces and supporting text.
- `primary`: the single primary action in a region.
- `secondary`: secondary action or surface.
- `accent`: hover or selected surface.
- `destructive`: destructive action or negative state.
- `border`, `input`, `ring`: boundaries and focus.

Do not write hex/RGB/HSL values in a business page. Do not import Tailwind fixed palettes such as `blue-500`.

## Type

| Role | Size | Use |
| --- | --- | --- |
| Page title | 20–24px semibold | Page identity |
| Module title | 16–18px semibold | Filters, table, detail group |
| Body | 14px regular | Forms, tables, details |
| Supporting | 12px regular | IDs, time, hints, metadata |

Use monospace only for machine-shaped values such as UID, IP, and order numbers.

## Spacing and shape

- Base unit: 4px. Prefer 8, 12, 16, 20, 24, 32px.
- Related items: 8–12px.
- Field groups: 16–20px.
- Card padding: 20–24px.
- Page modules: 20–24px.
- Page edge: 24–32px desktop; 16–20px narrow.
- Cards: approximately 16px radius.
- Buttons, inputs, selects, and tabs: pill-shaped per the existing components.
- Prefer borders to heavy shadows.

## Composition

- Do not put the page title in a card by default.
- Use cards only for clear information boundaries.
- Avoid card-inside-card repetition.
- Keep primary content left-aligned.
- Group dangerous actions separately from common actions.
- Reduce visible choices through grouping or progressive disclosure when a region exceeds 4–6 decisions.

## Responsive behavior

- Preserve critical actions on narrow screens.
- Let filters stack.
- Let action groups wrap.
- Let tabs and tables scroll inside their own containers.
- Do not let a wide table set the page width.
- Keep touch targets near 44px where practical.
