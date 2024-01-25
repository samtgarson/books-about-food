import { Profile } from '@books-about-food/core/models/profile'
import { parse } from 'superjson'

export const dummyProfiles = parse<Profile[]>(`{
  "json": [
    {
      "_type": "profile",
      "id": "8e4ff634-f317-466f-98ac-9f7008e7f6ba",
      "name": "name",
      "description": null,
      "slug": "slug",
      "website": null,
      "instagram": "instagram",
      "avatar": {
        "id": "9060b6f3-32e0-4fc7-8132-ea230fd28570",
        "path": "profile-avatars/8e4ff634-f317-466f-98ac-9f7008e7f6ba/9060b6f3-32e0-4fc7-8132-ea230fd28570.jpeg",
        "width": 800,
        "height": 622,
        "caption": "Avatar for Name",
        "placeholderUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/AL22rWRXStLNxv369wCOhXobAQCAc2nLx8AAVUs8QjUmcmZaqKGYiY8SXHCa78IAAAAASUVORK5CYII="
      },
      "jobTitle": "Job Title",
      "mostRecentlyPublishedOn": "2023-09-28T00:00:00.000Z",
      "userId": null,
      "hiddenCollaborators": [],
      "location": "London",
      "role": "contributor"
    },
    {
      "_type": "profile",
      "id": "e067233f-d9bd-426a-95d4-66160c343e95",
      "name": "name",
      "description": null,
      "slug": "slug",
      "website": null,
      "instagram": "instagram",
      "avatar": {
        "id": "350cb2de-3a46-486f-9408-851189620ae2",
        "path": "profile-avatars/e067233f-d9bd-426a-95d4-66160c343e95/350cb2de-3a46-486f-9408-851189620ae2.jpeg",
        "width": 320,
        "height": 320,
        "caption": "Avatar for Name",
        "placeholderUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAPUlEQVR4nGPQdFFRM5GydjP3K85kYGBjiInWn9IZYeThyKBqpdRcn/b/+VEDDyMGUTOJvJyo/2/fzF02GwBmhxGPgUgfjgAAAABJRU5ErkJggg=="
      },
      "jobTitle": "Job Title",
      "mostRecentlyPublishedOn": "2023-05-26T00:00:00.000Z",
      "userId": null,
      "hiddenCollaborators": [],
      "location": "Sydney",
      "role": "contributor"
    },
    {
      "_type": "profile",
      "id": "5989ce62-ee77-4988-8e70-2aaea9061661",
      "name": "name",
      "description": null,
      "slug": "slug",
      "website": "https://google.com",
      "instagram": "instagram",
      "avatar": {
        "id": "d21ee9e3-7d45-430f-83b5-d446ad709a6c",
        "path": "profile-avatars/5989ce62-ee77-4988-8e70-2aaea9061661/d21ee9e3-7d45-430f-83b5-d446ad709a6c.jpeg",
        "width": 400,
        "height": 400,
        "caption": "Avatar for Name",
        "placeholderUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAPUlEQVR4nGNoyQjJSAr19nK69Pg+w5T6gs5kPwUGhgkzJjH8//P66KwGG1n2srIchuIE1zk1sV764ja60gA9ZhSAUq3oTwAAAABJRU5ErkJggg=="
      },
      "jobTitle": "Job Title",
      "mostRecentlyPublishedOn": "2023-11-16T00:00:00.000Z",
      "userId": null,
      "hiddenCollaborators": [],
      "location": null,
      "role": "author"
    },
    {
      "_type": "profile",
      "id": "a48485ef-91c3-4323-bfb4-86d04a099463",
      "name": "name",
      "description": null,
      "slug": "slug",
      "website": "https://google.com",
      "instagram": "instagram",
      "avatar": {
        "id": "9b8d751d-409a-46da-9673-2ab3b0cca942",
        "path": "profile-avatars/a48485ef-91c3-4323-bfb4-86d04a099463/9b8d751d-409a-46da-9673-2ab3b0cca942.jpeg",
        "width": 320,
        "height": 320,
        "caption": "Avatar for Name",
        "placeholderUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAPUlEQVR4nGPwttC3lBGVYGCINNNgKLZXa/ZQT9YVTzRVYtjSmftqcdHR+sDfR+YwTCqM/P/xyKqqqEIfIwCDhRMrXzjunwAAAABJRU5ErkJggg=="
      },
      "jobTitle": "Job Title",
      "mostRecentlyPublishedOn": "2023-08-31T00:00:00.000Z",
      "userId": null,
      "hiddenCollaborators": [],
      "location": "London",
      "role": "contributor"
    },
    {
      "_type": "profile",
      "id": "1eb4b28d-4c48-4e24-8c5b-db55deac2404",
      "name": "name",
      "description": null,
      "slug": "slug",
      "website": null,
      "instagram": null,
      "avatar": {
        "id": "a9409fa8-417c-42b1-b55a-606134878189",
        "path": "profile-avatars/1eb4b28d-4c48-4e24-8c5b-db55deac2404/a9409fa8-417c-42b1-b55a-606134878189.jpeg",
        "width": 398,
        "height": 398,
        "caption": "Avatar for Name",
        "placeholderUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAP0lEQVR4nAE0AMv/AGVlZUFBQcrKyvT09AASEhITExOqqqr///8AAQEBISEhm5ubnZ2dAA0NDUlJSba2tj8/PzbaFIbH5xrXAAAAAElFTkSuQmCC"
      },
      "jobTitle": "Job Title",
      "mostRecentlyPublishedOn": "2023-09-28T00:00:00.000Z",
      "userId": null,
      "hiddenCollaborators": [],
      "location": null,
      "role": "contributor"
    }
  ],
  "meta": {
    "values": {
      "0": [
        [
          "class",
          "Profile"
        ],
        {
          "description": [
            "undefined"
          ],
          "website": [
            "undefined"
          ],
          "avatar": [
            [
              "class",
              "Image"
            ]
          ],
          "mostRecentlyPublishedOn": [
            "Date"
          ],
          "userId": [
            "undefined"
          ]
        }
      ],
      "1": [
        [
          "class",
          "Profile"
        ],
        {
          "description": [
            "undefined"
          ],
          "website": [
            "undefined"
          ],
          "avatar": [
            [
              "class",
              "Image"
            ]
          ],
          "mostRecentlyPublishedOn": [
            "Date"
          ],
          "userId": [
            "undefined"
          ]
        }
      ],
      "2": [
        [
          "class",
          "Profile"
        ],
        {
          "description": [
            "undefined"
          ],
          "avatar": [
            [
              "class",
              "Image"
            ]
          ],
          "mostRecentlyPublishedOn": [
            "Date"
          ],
          "userId": [
            "undefined"
          ],
          "location": [
            "undefined"
          ]
        }
      ],
      "3": [
        [
          "class",
          "Profile"
        ],
        {
          "description": [
            "undefined"
          ],
          "avatar": [
            [
              "class",
              "Image"
            ]
          ],
          "mostRecentlyPublishedOn": [
            "Date"
          ],
          "userId": [
            "undefined"
          ]
        }
      ],
      "4": [
        [
          "class",
          "Profile"
        ],
        {
          "description": [
            "undefined"
          ],
          "website": [
            "undefined"
          ],
          "instagram": [
            "undefined"
          ],
          "avatar": [
            [
              "class",
              "Image"
            ]
          ],
          "mostRecentlyPublishedOn": [
            "Date"
          ],
          "userId": [
            "undefined"
          ],
          "location": [
            "undefined"
          ]
        }
      ]
    }
  }
}`)
