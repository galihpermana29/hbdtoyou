# Wedding Template 1: every asset, and whether it is a Frame or content

The template's artwork was sliced out of Figma while the design tool was rate-limited, and nobody had checked afterwards which files were the design's and which had been approximated or taken from elsewhere.
Sixteen of the thirty-five files are photographs of the designer's own example wedding, and a photograph the template holds rather than the couple is a stranger's face presented as theirs.
This file is the account: what every file in `public/templates/wedding-template-1/` is, where in the design it comes from, and which of the two kinds it is.

## The two kinds

A **Frame** is artwork the template draws whatever the couple supplies.
It is the same on every invitation, it never varies, and a section may name it directly.
The polaroid's border, the torn paper edge, the envelope, the film strip's sprockets.

**Content** is anything carrying the designer's example wedding.
The photograph inside the polaroid is the couple's; the polaroid's border is not.
No section names a photograph.
Every one of them lives in `DEFAULT_WEDDING_TEMPLATE_1_CONTENT`, the sample invitation, and reaches a section only as content.

A section still falls back to the sample where a couple has given nothing, because a draft has to look like something before it is finished.
What has changed is that the fallback is now one nameable wedding instead of a path buried in a component, so it can be taken away in one place once a published invitation is fetched from a real record.
Until then, a couple who uploads no photographs still publishes the designer's - the Create Flow marks no photo field required, which the epic's "Substitution" section assumes it does.

## How each file was judged

Figma's `imageHash` is the SHA-1 of the image's own bytes.
So a file on disk is the design's own image exactly when `shasum -a 1` of it equals the `imageHash` the design gives that fill, which is a judgement a person can repeat rather than an opinion about how two pictures look.
Twenty-eight of the thirty-five files match a design hash that way.
Four are renders rather than source images - the closed envelope, the event photograph, a guest's avatar and the vinyl's label - and each was re-rendered from its own node through the bridge and compared pixel by pixel; the envelope came back byte-identical, the avatar and the label pixel-identical, and the event photograph is the design's photograph carrying the design's own crop, drawn flat because the tilt the design bakes in is applied in CSS here.
The remaining three are the SVGs, compared path by path against the design's vector export.

## Frames

| File | Figma node | `imageHash` |
| --- | --- | --- |
| `paper.jpg` | Hero `Rectangle 1`, Holy Verse, Love Story `Rectangle 1`, Guest Messages `Frame 65`-`Frame 69`, Token of Love `Rectangle 1`, Photo Share | `3ceb3637a6154dca980ae0762e9d05a159628a10` |
| `torn-paper.png` | `image 513`-`image 519` across the Hero, the Bride & Groom's Introduction and the Love Story | `677408079ab824b398f99d4d9ce675f7196c805d` |
| `polaroid-frame.png` | Love Story `Polaroid/polaroid`, Venue Details `Polaroid/image 515` | `9494c9d61e4847f531f3630b1a6ba9299aa5f4ad` |
| `envelope.png` | `envelope card/envelope` and `envelope card/flap` | `dcfb9ff2af3464ef28fb0c3c39b03dc7c802ac07` |
| `envelope-closed.png` | `Group 330` (394:3061), flattened | rendered |
| `wax-seal.png` | `envelope card/image 537` | `55996388b3046cfe5609d94d9bc22c9be8573190` |
| `hero-bg-card.png` | Hero `image 533` and `image 534` | `50704d372b7ef292bd070ef282a44877745c0090` |
| `portrait-frame.png` | Bride & Groom `image 523` and `image 524` | `acf472a788f1a66c1782f4049dcf4412ae8de70d` |
| `bridegroom-emblem.png` | Bride & Groom `image 533` | `7d96c13728a541fa19c0d9347ac01dc1cadaeff8` |
| `lovestory-film-frame.png` | Love Story `Strip/Frame` | `c92780602e1fa341a5e9e39522e08ba434729ffe` |
| `lovestory-torn-strip.png` | Love Story `image 520` | `350bed78d49ae7d0bef3b7504a6d7b8c197b878e` |
| `lovestory-map-bg.png` | Love Story `Frame 31/image 516` | `c7c2dd56b5db4047425ebe04599317d2fcc9d833` |
| `token-decor.png` | Token of Love `image 537` | `80743b8b341b585ffa602b6f0a61752b5cf04aa6` |
| `messages-avatar.png` | Guest Messages `Ellipse 11` / `Ellipse 12` | `adeffda26f81663b4523a582d12615726877bf90`, rendered |
| `footer-logo.png` | Footer `Frame 53/image 17` | `d6041128e2b49e4a559c252130993b9397ee4722` |
| `vinyl-record.png` | Vinyl `Mask group/image 530` | `984d3d49d261e8098735eb8aabb14d3187b4295b` |
| `vinyl-exclude.png` | Vinyl `Exclude` | `8841373b16a9e05d18455db4da736e103f33535d`, rendered |
| `lovestory-pin.svg` | Love Story `Frame 31` marker | vector |
| `lovestory-polaroid-cover.svg` | Love Story `Polaroid/cover` | vector |
| `vinyl-mask.svg` | Vinyl `Exclude` outline | vector |

`messages-avatar.png` is a Frame despite being a photograph of a person.
The design draws the same face on all five wishes, and a guest replying has no photograph to give: the RSVP asks for a name, whether they are coming, whether they bring somebody, and a message.
So it is artwork the template draws for every guest, in the way the polaroid's border is.

## Content

Each of these is the sample invitation's, held in `DEFAULT_WEDDING_TEMPLATE_1_CONTENT` and reaching a section only through the field named beside it.

| File | Content field | Figma node | `imageHash` |
| --- | --- | --- | --- |
| `couple-photo.png` | `heroPhotos[0]` | Hero `Rectangle 3` | `94fb9ef66f2684a8588ba1e534ad1912a4cd8205` |
| `bride-photo.jpg` | `bridePhoto` | Bride & Groom `bride/Rectangle 8` | `d4c76d3f6bfcc6523fb6fd85f2cfb212a44dd510` |
| `groom-photo.jpg` | `groomPhoto` | Bride & Groom `groom/Rectangle 9` | `b6aef86c0e6e9445e2253eed5ac5acf4f11696cc` |
| `lovestory-photo-1.png` | `loveStoryPhotos[0]` | Love Story `Strip/Photo 1` | `2034c933942472d4163f34d7aeb71c74220de82b` |
| `lovestory-photo-2.png` | `loveStoryPhotos[1]` | Love Story `Strip/Photo 2` | `3e14470097c5616266636bdd595b32e4a416ec86` |
| `lovestory-photo-3.png` | `loveStoryPhotos[2]` | Love Story `Strip/Photo 3` | `1548bbbde3ade2e6f35fb2acf0026d90e02cde3a` |
| `lovestory-polaroid-photo.jpg` | `polaroidPhoto` | Love Story `Polaroid/image` | `7c13228551a69dc1b8c43bf57dd8406335300303` |
| `lovestory-map-photo.png` | `mapPhoto` | Love Story `Frame 31/Rectangle 5` | `2c9774e91094520d97f6bf0f0e11d20d9c72404e` |
| `event-photo.png` | `eventPhotos[0]` | Venue Details `Polaroid/Vector 2` | `0f36257b9fd9570b6f878d19cac33bee1648a7ea`, rendered |
| `gallery-1.png` | `galleryPhotos[0]` | Photo Collection `image 528` | `9b8b2518ebee51ed4f2de76e46d1e31f2874daa0` |
| `gallery-2.png` | `galleryPhotos[1]` | Photo Collection `image 527` | `85b41c0d2da2c20e5772854536aaa7b837294c92` |
| `gallery-3.png` | `galleryPhotos[2]` | Photo Collection `image 524` | `2fd908d806afc4bb49b6686e7a4a9af7dd4b9474` |
| `gallery-4.png` | `galleryPhotos[3]` | Photo Collection `image 525` | `dafc3353e6e57ef44819d02d03981a30e6666a36` |
| `gallery-5.png` | `galleryPhotos[4]` | Photo Collection `image 529` | `1ef113b29963a3ee1deae15d8d8a65c608d4e124` |
| `token-photo.jpg` | `tokenPhoto` | Token of Love `Frame 43/Rectangle 3` | `bd5f52743067322c3afdee071424f959658ec159` |

## What was wrong, and what was done about it

One file was the wrong photograph.
`lovestory-polaroid-photo.png` was a second copy of `couple-photo.png`, so the Love Story's hidden polaroid revealed the Hero's picture rather than the design's, and the proposal the design photographed - a man on one knee, which is what the chapter beside it is called - was not in the template at all.
It is now `lovestory-polaroid-photo.jpg`, the design's own image.
This is the one place the Showcase does not look the way it did: the polaroid reveals a different picture, because the picture it revealed before was the wrong one.

Eleven files were copies of four.
The design draws one paper texture, one torn edge and one polaroid border, and the export had made a separate file for each place they appear: six papers, three torn edges and two borders, byte for byte identical.
They are now `paper.jpg`, `torn-paper.png` and `polaroid-frame.png`, one file each, which is both what the design says and 2.3MB less to send a guest.

Nine files had names that said the wrong thing.
`event-polaroid-frame.png` was the photograph and `event-polaroid.png` was the frame; `bridegroom-rect8.jpg` and `bridegroom-rect9.jpg` were the two faces.
A name that misstates which kind a file is, is how the confusion this document exists to end got started, so each was renamed to say which it is.

The Bride & Groom's Introduction drew its two portraits directly, with no content behind them, so every invitation showed the designer's bride and the designer's groom.
They are now `bridePhoto` and `groomPhoto`.
The Create Flow does not ask for either yet, so `formValuesToContent` takes both from the sample unconditionally; asking for them is `hbd-a09.20`.
