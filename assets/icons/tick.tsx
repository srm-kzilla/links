export default function Tick(): JSX.Element {
  return (
    <>
      <svg
        width="23"
        height="16"
        viewBox="0 0 23 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20.5 2L7 13.5L2 8.5"
          stroke="url(#paint0_linear)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="11.25"
            y1="2"
            x2="11.25"
            y2="13.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#57A772" />
            <stop offset="1" stopColor="#57A772" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
