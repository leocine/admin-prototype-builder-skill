# QA checklist

Run this after export and before delivery.

## Business

- Page goal and user role are visible from the page structure.
- Filters, fields, and actions match the supplied requirement.
- Enablement, permission, and state-transition rules are represented.
- Destructive effects require confirmation.
- Demonstration facts are clearly fictional; no production claims are invented.

## Components

- Source imports real `@/components/ui/*` components.
- No Button/Input/Table/Card/Tabs implementation is copied into the page.
- One primary button exists per action region.
- Every input has a visible label.
- Icon-only controls have `title` and `aria-label`.
- State is shown with text, not color alone.
- Missing values display `—`.

## States and interaction

- Loading, normal, empty, error, disabled, and success can be inspected.
- Query, reset, sort, pagination, tabs, form, and confirmation controls work when present.
- Reset does not reload the page.
- Error states offer recovery.
- Success states confirm the result and next state.

## Layout

- At desktop width, information hierarchy is immediately clear.
- At narrow width, filters stack and actions wrap.
- Tabs and tables scroll inside themselves, not at document level.
- No clipped text, overlapping controls, or unreachable actions.
- Page title is not redundantly repeated in a card.
- Cards form meaningful boundaries and are not nested mechanically.

## Offline artifact

- `npm run build` passes in the selected bundled or external runtime.
- `export-prototype.mjs` succeeds.
- `validate-prototype.mjs` reports zero failures.
- Exported HTML contains inline CSS and JavaScript.
- No external CDN, remote font, remote image, localhost, or asset-file dependency remains.
- The file opens directly through `file://`.
- Final HTML and React source are both linked in delivery.
