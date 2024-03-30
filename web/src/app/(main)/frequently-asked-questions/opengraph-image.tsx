import { OGTemplate } from 'src/utils/image-response-helpers'

export { size } from 'src/utils/image-response-helpers'

export default async function GET() {
  return OGTemplate.response(
    <OGTemplate.Root>
      <OGTemplate.Half>
        <OGTemplate.Title>
          <span>Frequently Asked Questions</span>
          <span>Books About Food</span>
        </OGTemplate.Title>
      </OGTemplate.Half>
    </OGTemplate.Root>
  )
}
