import type { ArrayField, Data } from 'payload'
import { websites } from '../../utils/data/websites'

export function linksField(interfaceName: string): ArrayField {
  return {
    name: 'links',
    type: 'array',
    interfaceName,
    admin: {
      initCollapsed: true,
      components: {
        RowLabel: {
          path: 'src/payload/components/ui/array-row-label.tsx#ArrayRowLabel',
          clientProps: {
            itemPlaceholder: 'New link',
            keyPath: ['label']
          }
        }
      }
    },
    fields: [
      {
        name: 'label',
        type: 'text',
        virtual: true,
        admin: { hidden: true },
        hooks: {
          afterRead: [
            async function ({ siblingData }) {
              if (siblingData?.site === 'Other')
                return siblingData['site (other)']
              return siblingData?.site ?? ''
            }
          ]
        }
      },
      {
        name: 'url',
        type: 'text',
        required: true
      },
      {
        name: 'site',
        type: 'select',
        options: [
          ...websites.map((site) => ({ label: site, value: site })),
          { label: 'Other', value: 'Other' }
        ],
        required: true
      },
      {
        name: 'site (other)',
        type: 'text',
        validate: (value: unknown, { siblingData }: { siblingData: Data }) => {
          if (siblingData?.site === 'Other' && !value) {
            return 'Please specify the site name'
          }
          return true
        },
        admin: {
          condition: (data, siblingData) => siblingData?.site === 'Other'
        }
      }
    ]
  }
}
