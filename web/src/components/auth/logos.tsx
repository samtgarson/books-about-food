import google from 'src/assets/auth-logos/google.svg'
import Image from 'next/image'

export type LogoProps = { size?: number }

export const Google = ({ size = 30 }: LogoProps) => (
  <Image src={google} width={size} height={size} alt="Google" />
)
