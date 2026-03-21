import google from 'src/assets/auth-logos/google.svg'

export type LogoProps = { size?: number; className?: string }

export function Google({ size = 30, className }: LogoProps) {
  return (
    <img
      src={google}
      width={size}
      height={size}
      alt="Google"
      className={className}
    />
  )
}
