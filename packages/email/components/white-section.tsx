import { Column, Row } from '@react-email/components'

export function WhiteSection({ children }: { children: React.ReactNode }) {
  return (
    <Row className="bg-white pt-1 px-6 pb-6">
      <Column>{children}</Column>
    </Row>
  )
}
