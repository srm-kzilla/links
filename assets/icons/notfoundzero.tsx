export default function NotFoundZero(): JSX.Element {
    return (
        <>
            <svg
                width={160}
                height={160}
                viewBox="0 0 207 207"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    cx={103.5}
                    cy={103.5}
                    r={103.5}
                    fill="url(#prefix__paint0_linear)"
                />
                <defs>
                    <linearGradient
                        id="prefix__paint0_linear"
                        x1={103.5}
                        y1={0}
                        x2={103.5}
                        y2={207}
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop stopColor="#56CCF2" />
                        <stop offset={1} stopColor="#6FCF97" />
                    </linearGradient>
                </defs>
            </svg>
        </>
    );
}