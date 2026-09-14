# Claw of Us template registration

The frontend reads template records from the external Memoify API. After this
branch is deployed, an admin must add the record from **Dashboard → Templates →
Create Template**. This uses the existing `POST /templates` action.

Use these values:

```json
{
  "name": "Claw of Us - arcadeclawv1",
  "slug": "arcadeclawv1",
  "label": "free",
  "thumbnail_uri": "https://memoify.live/thumbnails/arcadeclawv1.jpg",
  "type": "gift",
  "category": "original",
  "tag": ["interactive", "arcade", "photos"]
}
```

`name` must retain the `Display name - route` format because the create,
dashboard, and template-card flows derive `arcadeclawv1` from it. The first
release is intentionally registered with the existing `free` label. The
standard content-level lock still applies when the backend returns
`user_type: "free"` or `status: "locked"`, matching the other gift viewers.

No `frame_data` is needed. To change the template card to premium later, edit
this record in Dashboard → Templates and change only `label` to `premium`.
