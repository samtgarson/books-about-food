import { Column, Row } from '@react-email/components'

export function WhiteSection({ children }: { children: React.ReactNode }) {
  return (
    <Row className="bg-white px-6 pt-1 pb-6">
      <Column>{children}</Column>
    </Row>
  )
}
