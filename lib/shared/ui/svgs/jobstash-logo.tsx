import { SVGProps } from 'react';

export const JobstashLogo = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      id='Layer_2'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 512 512'
      {...props}
    >
      <defs>
        <style>
          {`.cls-1{fill:none;}.cls-2{fill:url(#linear-gradient);}.cls-3{fill:#fff;}`}
        </style>
        <linearGradient
          id='linear-gradient'
          x1='43.81'
          y1='256'
          x2='468.19'
          y2='256'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0' stopColor='#d68800' />
          <stop offset='.01' stopColor='#d48603' />
          <stop offset='.7' stopColor='#8552b2' />
          <stop offset='1' stopColor='#663df9' />
        </linearGradient>
      </defs>
      <g id='Layer_1-2'>
        <g>
          <circle className='cls-1' cx='256' cy='256' r='256' />
          <g>
            <g>
              <path
                className='cls-3'
                d='m256,308.67l-46.25-26.34v-52.67l46.25-26.34,46.25,26.34v52.67l-46.25,26.34Zm-32.09-34.4l32.09,18.28,32.1-18.28v-36.55l-32.1-18.28-32.09,18.28v36.55Z'
              />
              <polygon
                className='cls-3'
                points='272.12 265.18 272.12 246.82 256 237.64 239.88 246.82 239.88 265.18 256 274.36 272.12 265.18'
              />
            </g>
            <path
              className='cls-2'
              d='m468.19,256.74l-1.72-2.93v-118.15L255.14,15.31,43.81,135.66v118.51h0v122.17l211.33,120.34,211.33-120.34v-118.63l1.72-.98Zm-15.83,111.57l-89.41,50.91v-179.51h-.29l21-11.96v-31.62l-27.76-15.81-14.13,8.05-63.58-37.04c-3.61,2.34-8.56,5.57-13.09,8.54l63.04,36.73v31.15l21,11.96h-.29v187.54l-93.71,53.36-94.36-53.73v-88.31l-14.11-8.03v88.31l-88.76-50.54v-102.68l169.68,96.59v23.58l27.76,15.81,27.76-15.81v-23.7l53.31-30.35v-16.06l-60.47,34.42-20.61-11.73-20.71,11.79L57.92,249.56v-105.87l90.71-51.66,82.02,47.78,12.82-8.69-80.81-47.08,92.49-52.67,89.87,51.18-179.43,104.53-11.85-6.75-27.76,15.81v31.62l20.99,11.95h-.28v46.46l14.11,8.03v-54.49h-.29l20.99-11.95v-31.62l-1.88-1.07,179.06-104.31-.39-.66,94.1,53.58v106l-76.98,43.82v16.06l76.98-43.82v102.56Z'
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
