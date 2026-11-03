import type { CollectionConfig } from 'payload'
import { contributionTitleField } from '../../fields/contribution-title'
import { linksField } from '../../fields/links'
import { slugField } from '../../fields/slug'
import { revalidatePaths } from '../../plugins/cache-revalidation'
import { colorField, dayOnlyDisplayFormat } from '../utils'
import { emitBookUpdatedEvent } from './hooks/emit-book-updated-event'
import {
  syncRelatedSearchResults,
  syncRelatedSearchResultsOnDelete
} from './hooks/sync-related-search-results'
import {
  deleteBookSearchResult,
  syncBookSearchResult
} from './hooks/sync-search-result'
import { syncMagazineFields } from './hooks/sync-magazine-fields'
import { updateSearchText } from './hooks/update-search-text'

function isMagazineIssue(data: Partial<{ type: unknown }> | undefined) {
  return data?.type === 'magazineIssue'
}

// New books created from a magazine's issues list arrive with the magazine set
function showMagazineFields(
  data: Partial<{ id: unknown; type: unknown; magazine: unknown }>
) {
  return isMagazineIssue(data) || (!data.id && !!data.magazine)
}

export const Books: CollectionConfig = {
  slug: 'books',
  custom: {
    revalidatePaths: revalidatePaths((doc) => [
      `/cookbooks/${doc.slug}`,
      '/cookbooks',
      '/'
    ])
  },
  hooks: {
    beforeChange: [syncMagazineFields, updateSearchText],
    afterChange: [
      syncBookSearchResult,
      syncRelatedSearchResults,
      emitBookUpdatedEvent
    ],
    afterDelete: [deleteBookSearchResult, syncRelatedSearchResultsOnDelete]
  },
  admin: {
    group: 'Resources',
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'status',
      'type',
      'authorNames',
      'palette',
      'publisher',
      'releaseDate'
    ],
    preview({ slug }) {
      return `/cookbooks/${slug}`
    },
    components: {
      edit: {
        beforeDocumentControls: [
          {
            path: 'src/payload/collections/books/components/publish-button.tsx#BookPublishButton'
          }
        ]
      }
    }
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        components: {
          Cell: {
            path: 'src/payload/components/fields/custom-title-cell.tsx',
            serverProps: {
              imageAttributeName: 'coverImage'
            }
          }
        }
      }
    },
    {
      name: 'subtitle',
      type: 'text'
    },
    slugField('title'),
    {
      name: 'searchText',
      type: 'text',
      admin: {
        hidden: true,
        description:
          'Computed field containing all searchable text (title, subtitle, publisher, tags, authors, contributors)'
      },
      index: true
    },
    {
      name: 'type',
      type: 'select',
      interfaceName: 'BookType',
      options: [
        { label: 'Cookbook', value: 'cookbook' },
        { label: 'Magazine issue', value: 'magazineIssue' }
      ],
      defaultValue: 'cookbook',
      required: true,
      index: true
    },
    {
      type: 'row',
      admin: {
        condition: showMagazineFields
      },
      fields: [
        {
          name: 'magazine',
          type: 'relationship',
          relationTo: 'magazines',
          hasMany: false,
          index: true,
          validate: (
            value: unknown,
            { data }: { data: Partial<{ type: unknown }> }
          ) => {
            if (isMagazineIssue(data) && !value) {
              return 'Magazine issues must belong to a magazine'
            }
            return true
          }
        },
        {
          name: 'issueNumber',
          type: 'number',
          min: 0
        },
        {
          name: 'issueLabel',
          type: 'text',
          admin: {
            description: 'Optional, e.g. "Spring/Summer 2025"'
          }
        }
      ]
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: {
        condition: (data) => !showMagazineFields(data)
      }
    },
    {
      name: 'authorNames',
      virtual: 'authors.name',
      type: 'text',
      admin: {
        hidden: true,
        components: {
          Cell: {
            path: 'src/payload/components/fields/string-array-cell.tsx'
          }
        }
      }
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'inReview' },
        { label: 'Published', value: 'published' }
      ],
      defaultValue: 'draft'
    },
    {
      name: 'releaseDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: dayOnlyDisplayFormat
        }
      }
    },
    {
      name: 'pages',
      type: 'number'
    },
    {
      name: 'blurb',
      type: 'textarea'
    },
    {
      name: 'designCommentary',
      type: 'textarea',
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'source',
      type: 'select',
      interfaceName: 'BookSource',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Import', value: 'import' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Edelweiss', value: 'edelweiss' }
      ],
      defaultValue: 'admin',
      admin: { readOnly: true, position: 'sidebar' }
    },
    colorField('backgroundColor', {
      admin: {
        position: 'sidebar',
        description: 'Generated from the cover image'
      }
    }),
    {
      name: 'palette',
      type: 'array',
      fields: [colorField('color')],
      admin: {
        position: 'sidebar',
        description: 'Generated from the cover image',
        components: {
          Cell: {
            path: 'src/payload/components/fields/palette-cell.tsx'
          }
        }
      }
    },
    {
      name: 'googleBooksId',
      type: 'text',
      // FIX: return this constraint once unique index issue is resolved
      // unique: true,
      admin: { readOnly: true, position: 'sidebar' }
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      hasMany: false
    },
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      admin: { readOnly: true, position: 'sidebar' }
    },
    {
      name: 'contributions',
      type: 'array',
      interfaceName: 'BookContributions',
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: {
            path: 'src/payload/components/ui/array-row-label.tsx#ArrayRowLabel',
            clientProps: {
              itemPlaceholder: 'New contribution',
              keyPath: ['title']
            }
          }
        }
      },
      fields: [
        {
          name: 'profile',
          type: 'relationship',
          relationTo: 'profiles',
          required: true,
          hasMany: false
        },
        contributionTitleField,
        {
          name: 'job',
          type: 'relationship',
          relationTo: 'jobs',
          required: true
        },
        {
          name: 'tag',
          type: 'select', // "Assistant" or null,
          options: [{ label: 'Assistant', value: 'Assistant' }]
        },
        {
          name: 'hidden',
          type: 'checkbox',
          defaultValue: false
        }
      ]
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'images',
      hasMany: false,
      admin: {
        components: {
          Field: {
            path: 'src/payload/components/fields/cover-image/index.tsx#CoverImageField'
          }
        }
      }
    },
    {
      name: 'previewImages',
      type: 'array',
      admin: {
        initCollapsed: true,
        components: {
          Field: {
            path: 'src/payload/components/fields/preview-images/index.tsx#PreviewImagesField'
          }
        }
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'images',
          hasMany: false,
          required: true
        }
      ]
    },
    linksField('BookLinks')
  ]
}
