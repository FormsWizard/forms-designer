import dynamic from 'next/dynamic'
import React from 'react'

export const withNoSSR = (Component: React.FunctionComponent) =>
  dynamic(() => Promise.resolve(Component), { ssr: false })
