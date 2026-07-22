# Component contracts

Use these real imports from the selected standard runtime (bundled V2 or compatible `platform-main`). Compose them; never reimplement them in a prototype page.

## Imports

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
```

## Button

Variants: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`.

Sizes: `sm`, `default`, `lg`, `icon`.

Rules:

- Use one `default` per action region.
- Use `outline` for independent secondary actions.
- Use `ghost` for return, copy, and lightweight row actions.
- Use `destructive` only when the result can harm or disable data/access.
- Give icon buttons `title` and `aria-label`.
- Use a confirmation interaction before destructive state mutation.

## Input, Label, Select

- Put a visible `Label` above every control.
- Use placeholder for format/examples, never as the only label.
- Represent enumerable values with Select.
- Use an explicit `全部` option mapped to no filter.
- Keep controlled values in React state.
- Reset state directly; never reload the page.

## Card

- Use Card for filter panels, data containers, summaries, and strong detail groups.
- Do not put every text block in a Card.
- Avoid nested Cards with equal visual weight.
- Use CardHeader/CardTitle for genuine module titles, not repeated page titles.

## Table

- Place the primary business identity in the first column.
- Put actions in the last column.
- Use `—` for absent values.
- Keep row actions to 1–3 visible items.
- Use Badge for state.
- Preserve the component's internal horizontal scrolling; add a meaningful `min-w-*` table width when necessary.
- Provide loading and empty rows with a correct `colSpan`.

## Badge

- `default`: current normal/positive state until semantic colors expand.
- `secondary`: identity, completed, or low-emphasis category.
- `outline`: neutral/pending/metadata.
- `destructive`: frozen, rejected, invalid, or dangerous.
- Always include state text; never communicate by color alone.

## Tabs

- Use for peer sections under the same business object.
- Keep the preferred visible count at 7 or fewer.
- Group or restructure larger sets before adding horizontal overflow.
- Make Tabs controlled when switching affects other state.

## Avatar and Separator

- Provide AvatarFallback from a real visible name character.
- Give AvatarImage a meaningful alt.
- Use Separator for relationships that need a rule but not another card.

## Missing components

The current library does not yet standardize Dialog, Drawer, Toast, Checkbox, Radio, Switch, DatePicker, Textarea, Upload, Breadcrumb, Skeleton, or Pagination.

For a prototype that needs one:

1. Build a page-scoped accessible composition using semantic HTML and existing tokens.
2. Keep it in the prototype page; do not add it to global `components/ui` without explicit authorization.
3. Mark it in delivery as `待规范沉淀`.
4. Do not pretend it is already a platform component.
