export default function HomeTick(): JSX.Element {
  return (
    <>
      <svg
        viewBox="0 0 44 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 sm:h-8"
      >
        <path
          d="M3 17L14.698 29L41 3"
          stroke="url(#paint0_linear)"
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="24.5"
            y1={3}
            x2="24.5"
            y2={29}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#31B580" />
            <stop offset={1} stopColor="#4AC4CC" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
