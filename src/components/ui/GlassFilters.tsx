"use client";

export default function GlassFilters() {
  return (
    <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
      <defs>
        {/* Deep Refraction Filter for Liquid Glass */}
        <filter id="liquid-refraction" x="-20%" y="-20%" width="140%" height="140%">
           <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
           <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" in="noise" result="coloredNoise" />
           {/* Displacement maps the background to create the bent glass effect */}
           <feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale="10" xChannelSelector="R" yChannelSelector="G" result="displacement" />
           <feComposite operator="in" in="displacement" in2="SourceAlpha" result="composite" />
           <feMerge>
             <feMergeNode in="composite" />
           </feMerge>
        </filter>

        {/* Subtle Edge Glow / Caustics */}
        <filter id="glass-caustics">
           <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
           <feSpecularLighting in="blur" surfaceScale="2" specularConstant="1.2" specularExponent="20" lightingColor="white" result="specOut">
              <fePointLight x="-5000" y="-10000" z="20000" />
           </feSpecularLighting>
           <feComposite operator="in" in="specOut" in2="SourceAlpha" result="specOut2" />
           <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" in="SourceGraphic" in2="specOut2" />
        </filter>
      </defs>
    </svg>
  );
}
