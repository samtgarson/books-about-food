import { FC, SVGProps } from 'react'

export const CircleLogo: FC<SVGProps<SVGSVGElement>> = ({
  fill = 'white',
  ...props
}) => (
  <svg
    className="logo-black"
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M40.3857 49.342L46.3008 43.4269C48.1736 41.5541 50.2133 41.4429 51.4 42.6296C52.1973 43.4269 52.3828 44.5024 51.9192 45.6521C53.3099 44.9845 54.645 45.1699 55.5535 46.0785C56.8515 47.3765 56.7032 49.546 54.8675 51.3817L48.6372 57.5935L40.3857 49.3235V49.342ZM49.3233 46.9871C50.1391 46.1712 50.2875 45.4481 49.6941 44.8547C49.1378 44.2984 48.3961 44.4468 47.5617 45.2812L43.983 48.8599L45.7075 50.5844L49.3047 46.9871H49.3233ZM52.902 50.2135C53.7549 49.3606 53.8847 48.5076 53.2728 47.8957C52.6424 47.2653 51.8265 47.3765 50.955 48.2666L47.1723 52.0492L49.1378 54.0147L52.9205 50.2321L52.902 50.2135Z"
      fill={fill}
    />
    <path
      d="M70.3508 27.647C74.9308 25.7742 78.4168 27.1093 79.7519 30.3728C81.0869 33.6548 79.5664 37.0295 74.9679 38.9209C70.3693 40.8122 66.8833 39.4771 65.5297 36.1951C64.1947 32.9131 65.7337 29.5198 70.3322 27.6285L70.3508 27.647ZM74.0593 36.6958C76.9334 35.509 77.9161 33.5621 77.0632 31.4668C76.2102 29.3715 74.1335 28.6854 71.2594 29.8536C68.4038 31.0217 67.3469 32.9873 68.2184 35.0826C69.0713 37.1593 71.1666 37.8639 74.0593 36.6772V36.6958Z"
      fill={fill}
    />
    <path
      d="M101.743 21.8613C106.694 21.9911 109.327 24.6056 109.253 28.1287C109.179 31.6518 106.397 34.155 101.446 34.0252C96.4769 33.914 93.8253 31.2809 93.8995 27.7578C93.9922 24.2162 96.7736 21.7315 101.743 21.8613ZM101.502 31.6332C104.599 31.7074 106.286 30.3167 106.342 28.0545C106.397 25.7923 104.784 24.3275 101.669 24.2533C98.5907 24.1791 96.8292 25.5513 96.7736 27.8135C96.7179 30.0571 98.3497 31.5405 101.483 31.6147L101.502 31.6332Z"
      fill={fill}
    />
    <path
      d="M126.09 26.3115L128.723 27.4982L126.739 31.8743L134.953 30.3353L139.032 32.1895L130.373 33.8769L134.081 42.7773L130.354 41.0899L127.592 34.4146L125.385 34.8226L123.883 38.1417L121.25 36.955L126.071 26.3301L126.09 26.3115Z"
      fill={fill}
    />
    <path
      d="M148.211 48.9525C147.395 49.8426 147.729 51.4187 149.323 53.1061C150.862 54.7378 152.123 55.4424 152.883 54.7193C153.588 54.0332 153.106 53.1061 151.326 50.9551C148.619 47.6916 147.896 45.4294 149.601 43.8348C151.307 42.2401 153.885 43.2785 156.499 46.0413C159.04 48.7115 159.726 51.6783 158.205 53.2173L156.203 51.1035C156.796 50.3803 156.277 48.934 154.942 47.5433C153.551 46.0784 152.346 45.3367 151.697 45.9486C151.14 46.4864 151.604 47.4135 153.421 49.583C156.277 52.9948 156.852 55.1643 155.09 56.8331C153.199 58.6317 150.529 57.445 147.71 54.4782C145.021 51.6412 144.428 48.6929 146.264 46.8943L148.248 48.9896L148.211 48.9525Z"
      fill={fill}
    />
    <path
      d="M34.5265 91.8224L34.1927 95.1786L21.9731 100.167L22.2698 97.107L24.7731 96.0872L25.4591 89.0595L23.197 87.5761L23.4936 84.5352L34.5265 91.8038V91.8224ZM27.2207 95.1415L31.912 93.2502L27.6657 90.4873L27.2207 95.1415Z"
      fill={fill}
    />
    <path
      d="M35.0083 112.794L37.3817 120.804C38.142 123.345 37.2519 125.199 35.6573 125.662C34.5818 125.978 33.5434 125.625 32.7461 124.68C32.6719 126.219 31.8746 127.313 30.6508 127.665C28.8893 128.184 27.0535 127.035 26.3118 124.531L23.8086 116.113L35.0083 112.794ZM28.2773 123.363C28.6297 124.531 29.3157 125.032 30.1501 124.791C31.0031 124.531 31.2812 123.753 30.9289 122.566L29.4084 117.448L26.7569 118.227L28.2773 123.345V123.363ZM32.8203 121.75C33.154 122.863 33.7103 123.326 34.5076 123.104C35.2494 122.881 35.4719 122.158 35.1381 121.027L33.6918 116.187L31.3554 116.873L32.8017 121.75H32.8203Z"
      fill={fill}
    />
    <path
      d="M48.971 141.405C52.0861 145.243 51.808 148.952 49.0637 151.195C46.3194 153.42 42.6294 152.938 39.5142 149.081C36.3806 145.225 36.6402 141.498 39.403 139.272C42.1473 137.047 45.8373 137.548 48.971 141.405ZM41.387 147.561C43.3526 149.971 45.5035 150.342 47.2465 148.933C49.008 147.505 49.0637 145.317 47.1167 142.925C45.1697 140.533 42.9817 140.088 41.2202 141.516C39.4772 142.925 39.403 145.132 41.387 147.561Z"
      fill={fill}
    />
    <path
      d="M62.9151 154.941L65.4739 156.314L62.47 161.876C61.5429 163.601 62.2475 165.418 64.3058 166.531C66.3269 167.625 68.2368 167.217 69.1639 165.492L72.1678 159.929L74.7267 161.302L71.6301 167.05C70.0725 169.924 66.7534 170.554 63.1747 168.644C59.5589 166.697 58.2609 163.582 59.8185 160.69L62.9151 154.941Z"
      fill={fill}
    />
    <path
      d="M85.7406 164.77L99.0727 166.309L98.7945 168.701L93.5841 168.107L92.5271 177.323L89.653 176.989L90.71 167.773L85.481 167.162L85.7591 164.77H85.7406Z"
      fill={fill}
    />
    <path
      d="M126.646 160.653L137.066 154.979L138.216 157.092L130.335 161.376L131.541 163.601L138.605 159.762L139.699 161.765L132.635 165.603L134.767 169.516L132.227 170.888L126.646 160.634V160.653Z"
      fill={fill}
    />
    <path
      d="M150.825 141.683C153.959 137.845 157.649 137.363 160.393 139.607C163.137 141.85 163.397 145.559 160.263 149.397C157.111 153.254 153.403 153.736 150.677 151.492C147.932 149.249 147.673 145.522 150.825 141.683ZM158.39 147.877C160.356 145.485 160.3 143.278 158.539 141.85C156.777 140.404 154.645 140.793 152.661 143.204C150.714 145.596 150.714 147.821 152.475 149.267C154.218 150.695 156.388 150.306 158.372 147.877H158.39Z"
      fill={fill}
    />
    <path
      d="M163.193 118.209C164.565 113.444 167.773 111.552 171.167 112.535C174.56 113.518 176.266 116.819 174.894 121.584C173.521 126.368 170.314 128.278 166.902 127.295C163.508 126.312 161.803 122.993 163.175 118.209H163.193ZM172.594 120.916C173.447 117.931 172.539 115.947 170.369 115.317C168.181 114.686 166.364 115.873 165.511 118.858C164.658 121.825 165.548 123.865 167.718 124.495C169.887 125.126 171.723 123.92 172.594 120.898V120.916Z"
      fill={fill}
    />
    <path
      d="M166.327 98.9434L165.529 92.194C165.01 87.7067 167.124 84.9809 170.536 84.573C173.966 84.165 176.618 86.3345 177.137 90.8218L177.934 97.5713L166.327 98.9249V98.9434ZM174.763 91.137C174.448 88.4669 173.058 87.1875 170.888 87.4471C168.737 87.7067 167.625 89.2828 167.94 91.9529L168.385 95.8098L175.227 95.0124L174.782 91.1556L174.763 91.137Z"
      fill={fill}
    />
  </svg>
)
