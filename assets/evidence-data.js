window.REFOCUS_EVIDENCE = {
  "methods": [
    "Source",
    "AnyBokeh",
    "GenFocus",
    "DiffCamera",
    "RAV",
    "RefocusCraft"
  ],
  "details": [
    {
      "id": "bookshop",
      "title": "Book-cover lettering",
      "description": "Matched close-up of the printed lettering on the middle book cover.",
      "video": "media/evidence/details/bookshop.mp4",
      "poster": "media/evidence/details/bookshop-poster.webp",
      "context": "media/evidence/details/bookshop-context.jpg",
      "crop": 128,
      "fps": 5,
      "frames": 25,
      "uuid": "cdf7a308-70d9-42d5-9b7b-42491aa69060",
      "contextFrame": 5
    },
    {
      "id": "kitchen",
      "title": "Fine grid pattern",
      "description": "Matched close-up of the kitchen scale keypad and fine grid pattern.",
      "video": "media/evidence/details/kitchen.mp4",
      "poster": "media/evidence/details/kitchen-poster.webp",
      "context": "media/evidence/details/kitchen-context.jpg",
      "crop": 128,
      "fps": 5,
      "frames": 25,
      "uuid": "1eee3c4e-bd40-4377-8dc7-53a79e49ac66",
      "contextFrame": 11
    }
  ],
  "temporal": {
    "id": "face",
    "title": "Facial appearance over time",
    "description": "The same fixed facial region across all 25 frames.",
    "video": "media/evidence/temporal/face.mp4",
    "poster": "media/evidence/temporal/poster.webp",
    "context": "media/evidence/temporal/context.webp",
    "crop": 120,
    "fps": 5,
    "frames": 25,
    "uuid": "938b0b24-269b-45d2-9b22-fd9e30adf9c5",
    "contextFrame": 12
  },
  "control": {
    "source": "media/evidence/control/source.webp",
    "focusRows": [
      {
        "id": "near",
        "label": "Near",
        "subject": "Tomato",
        "focus_xy": [
          348,
          424
        ]
      },
      {
        "id": "middle",
        "label": "Middle",
        "subject": "Potato",
        "focus_xy": [
          188,
          241
        ]
      },
      {
        "id": "far",
        "label": "Far",
        "subject": "Tree",
        "focus_xy": [
          439,
          113
        ]
      }
    ],
    "strengths": [
      {
        "index": 0,
        "id": "low",
        "label": "Low"
      },
      {
        "index": 1,
        "id": "medium",
        "label": "Medium"
      },
      {
        "index": 2,
        "id": "high",
        "label": "High"
      },
      {
        "index": 3,
        "id": "strongest",
        "label": "Strongest"
      }
    ],
    "variants": [
      {
        "id": "near-low",
        "focus": "near",
        "strength": 0,
        "video": "media/evidence/control/near-low.mp4",
        "poster": "media/evidence/control/near-low-poster.webp"
      },
      {
        "id": "near-medium",
        "focus": "near",
        "strength": 1,
        "video": "media/evidence/control/near-medium.mp4",
        "poster": "media/evidence/control/near-medium-poster.webp"
      },
      {
        "id": "near-high",
        "focus": "near",
        "strength": 2,
        "video": "media/evidence/control/near-high.mp4",
        "poster": "media/evidence/control/near-high-poster.webp"
      },
      {
        "id": "near-strongest",
        "focus": "near",
        "strength": 3,
        "video": "media/evidence/control/near-strongest.mp4",
        "poster": "media/evidence/control/near-strongest-poster.webp"
      },
      {
        "id": "middle-low",
        "focus": "middle",
        "strength": 0,
        "video": "media/evidence/control/middle-low.mp4",
        "poster": "media/evidence/control/middle-low-poster.webp"
      },
      {
        "id": "middle-medium",
        "focus": "middle",
        "strength": 1,
        "video": "media/evidence/control/middle-medium.mp4",
        "poster": "media/evidence/control/middle-medium-poster.webp"
      },
      {
        "id": "middle-high",
        "focus": "middle",
        "strength": 2,
        "video": "media/evidence/control/middle-high.mp4",
        "poster": "media/evidence/control/middle-high-poster.webp"
      },
      {
        "id": "middle-strongest",
        "focus": "middle",
        "strength": 3,
        "video": "media/evidence/control/middle-strongest.mp4",
        "poster": "media/evidence/control/middle-strongest-poster.webp"
      },
      {
        "id": "far-low",
        "focus": "far",
        "strength": 0,
        "video": "media/evidence/control/far-low.mp4",
        "poster": "media/evidence/control/far-low-poster.webp"
      },
      {
        "id": "far-medium",
        "focus": "far",
        "strength": 1,
        "video": "media/evidence/control/far-medium.mp4",
        "poster": "media/evidence/control/far-medium-poster.webp"
      },
      {
        "id": "far-high",
        "focus": "far",
        "strength": 2,
        "video": "media/evidence/control/far-high.mp4",
        "poster": "media/evidence/control/far-high-poster.webp"
      },
      {
        "id": "far-strongest",
        "focus": "far",
        "strength": 3,
        "video": "media/evidence/control/far-strongest.mp4",
        "poster": "media/evidence/control/far-strongest-poster.webp"
      }
    ]
  }
};
