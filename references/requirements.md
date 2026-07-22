# Requirement intake

## Minimum usable input

Extract six fields from natural language. Do not force the user to fill a form when the information is already present.

| Field | What it changes |
| --- | --- |
| Page name | File name, title, business vocabulary |
| User role | Visible actions and permissions |
| Page goal | Primary action and information hierarchy |
| Inputs/filters | Form controls and query behavior |
| Display data | Table columns or detail groups |
| Actions and rules | Buttons, states, confirmations, transitions |

## Ask only material questions

Ask when different answers create different workflows, such as:

- Can an approved item be revoked?
- Which roles can approve?
- Is rejection reason mandatory?
- Is selection single-row or batch?
- Does “delete” mean soft delete, archive, or permanent deletion?

Do not ask:

- Button color, radius, control height, table header background.
- Whether filters sit above the table.
- How empty/loading states look.
- Which existing component variant to use.

## Default assumptions

When not specified and low risk:

- Build a desktop-first responsive prototype.
- Use local fictional demonstration data labelled `原型数据`.
- Do not call real APIs.
- Put the highest-frequency filters first.
- Use 20 rows per page for list pagination demonstrations.
- Keep one primary action per region.
- Require confirmation for destructive actions.
- Preserve form state while switching between demonstration states.

State assumptions in delivery; do not interrupt work for them.

## Product language

- Reuse the user's domain terms consistently.
- Use action labels as `verb + object`: `创建活动`, `通过审核`, `冻结用户`.
- Name empty states specifically: `暂无退款订单`, not `暂无数据`.
- Explain an error and next step: `订单加载失败，请重新加载`.
- Use `—` for unavailable values.
