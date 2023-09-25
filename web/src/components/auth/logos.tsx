import Image from 'next/image'
import google from 'src/assets/auth-logos/google.svg'

export type LogoProps = { size?: number; className?: string }

export const Google = ({ size = 30, className }: LogoProps) => (
  <Image
    src={google}
    width={size}
    height={size}
    alt="Google"
    className={className}
  />
)
