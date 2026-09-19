# Board of Us template registration

The frontend reads template records from the external Memoify API. An
authenticated admin must create this record in the live environment through
**Dashboard → Templates → Create Template**:

```json
{
  "name": "Board of Us - boardofusv1",
  "slug": "boardofusv1",
  "label": "free",
  "thumbnail_uri": "https://memoify.live/thumbnails/boardofusv1.jpg",
  "type": "gift",
  "category": "original",
  "tag": ["interactive", "board game", "photos", "birthday", "anniversary"]
}
```

`name` must retain the `Display name - route` format because the catalog,
creator, dashboard, and viewer flows derive `boardofusv1` from it. No
`frame_data` is required.

The checked-in fallback thumbnail is `public/thumbnails/boardofusv1.jpg`.
Once the row exists, Board of Us appears in the Original template list and can
be opened directly with `/create?template=<template-id>`.
