import React from "react";

const AnimatedTokenCreation = () => {
  return (
    <div className="md:w-1/2 flex justify-center">
      <div className="relative">
        <div className="w-80 h-80 bg-gradient-to-r from-purple-500 to-green-400 rounded-full opacity-10 animate-pulse absolute"></div>

        <svg viewBox="0 0 400 400" className="relative z-10 w-80 h-80">
          {/* Outer circle with gradient */}
          <defs>
            <linearGradient
              id="tokenGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base circle */}
          <circle
            cx="200"
            cy="200"
            r="160"
            fill="#111827"
            stroke="url(#tokenGradient)"
            strokeWidth="4"
          />

          {/* Token abstract representation */}
          <g filter="url(#glow)">
            {/* Central coin shape */}
            <circle
              cx="200"
              cy="200"
              r="100"
              fill="#1E293B"
              stroke="url(#tokenGradient)"
              strokeWidth="2"
            />

            {/* Token symbol */}
            <text
              x="200"
              y="210"
              fontSize="40"
              fontWeight="bold"
              fill="url(#tokenGradient)"
              textAnchor="middle"
            >
              SOL
            </text>

            {/* Orbiting particles */}
            <circle
              className="animate-orbit"
              cx="200"
              cy="70"
              r="8"
              fill="#9945FF"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="200" cy="90" r="6" fill="#14F195">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="90 200 200"
                to="450 200 200"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>

            <circle cx="200" cy="110" r="4" fill="#9945FF">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="180 200 200"
                to="540 200 200"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Code lines */}
            <g>
              <line
                x1="310"
                y1="150"
                x2="350"
                y2="150"
                stroke="#14F195"
                strokeWidth="2"
              >
                <animate
                  attributeName="x2"
                  values="310;350;310"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="320"
                y1="160"
                x2="340"
                y2="160"
                stroke="#9945FF"
                strokeWidth="2"
              >
                <animate
                  attributeName="x2"
                  values="320;340;320"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="315"
                y1="170"
                x2="345"
                y2="170"
                stroke="#14F195"
                strokeWidth="2"
              >
                <animate
                  attributeName="x2"
                  values="315;345;315"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </line>
            </g>

            {/* Animated coin stack */}
            <g transform="translate(100, 250) scale(0.5)">
              <ellipse
                cx="60"
                cy="25"
                rx="50"
                ry="20"
                fill="#1E293B"
                stroke="#9945FF"
                strokeWidth="2"
              />
              <ellipse
                cx="60"
                cy="15"
                rx="50"
                ry="20"
                fill="#1E293B"
                stroke="#14F195"
                strokeWidth="2"
              >
                <animate
                  attributeName="cy"
                  values="15;10;15"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </ellipse>
              <ellipse
                cx="60"
                cy="5"
                rx="50"
                ry="20"
                fill="#1E293B"
                stroke="#9945FF"
                strokeWidth="2"
              >
                <animate
                  attributeName="cy"
                  values="5;0;5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </ellipse>
            </g>
          </g>

          {/* Pulsing effect */}
          <circle
            cx="200"
            cy="200"
            r="170"
            fill="none"
            stroke="url(#tokenGradient)"
            strokeWidth="1"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="150;170;150"
              dur="4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  );
};

export default AnimatedTokenCreation;
