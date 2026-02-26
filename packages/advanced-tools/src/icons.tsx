import { ToolIconComponent, ToolIconRegistry } from "@formswizard/types"
import { SvgIcon, SxProps, Theme } from "@mui/material"
import { ComponentType, SVGAttributes } from "react"

const getVariantSvgStyles: (variant: 'outlined' | 'filled') => SVGAttributes<SVGSVGElement> = (variant) => {
  switch (variant) {
    case 'outlined':
      return {
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2',
      }
    case 'filled':
    default:
      return {
        fill: 'currentColor',
        stroke: 'none',
      }
  }
}
const defaultSvgStyles: SVGAttributes<SVGSVGElement> = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
}

type SVGIconComponent = ComponentType<{
  variant?: 'outlined' | 'filled'
}>

// Person Icon - supports both outlined and filled variants
const PersonIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  if (variant === 'filled') {
    return <svg {...defaultSvgStyles} fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
      <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
    </svg>
  }
  
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
  </svg>
}

// Location Icon - supports both outlined and filled variants
const LocationIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  if (variant === 'filled') {
    return <svg {...defaultSvgStyles} fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
    </svg>
  }
  
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
  </svg>
}

// Map Icon - outlined only
const MapIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5" />
    <path d="M9 4v13" />
    <path d="M15 7v5.5" />
    <path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z" />
    <path d="M19 18v.01" />
  </svg>
}

// Address Icon - outlined only
const AddressIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z" />
    <path d="M10 16h6" />
    <path d="M13 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M4 8h3" />
    <path d="M4 12h3" />
    <path d="M4 16h3" />
  </svg>
}

// Stars Icon - supports both outlined and filled variants
const StarsIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  if (variant === 'filled') {
    return <svg {...defaultSvgStyles} fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M17.657 12.007a1.39 1.39 0 0 0 -1.103 .765l-.855 1.723l-1.907 .277c-.52 .072 -.96 .44 -1.124 .944l-.038 .14c-.1 .465 .046 .954 .393 1.29l1.377 1.337l-.326 1.892a1.393 1.393 0 0 0 2.018 1.465l1.708 -.895l1.708 .896a1.388 1.388 0 0 0 1.462 -.105l.112 -.09a1.39 1.39 0 0 0 .442 -1.272l-.325 -1.891l1.38 -1.339c.38 -.371 .516 -.924 .352 -1.427l-.051 -.134a1.39 1.39 0 0 0 -1.073 -.81l-1.907 -.278l-.853 -1.722a1.393 1.393 0 0 0 -1.247 -.773l-.143 .007z" />
      <path d="M6.057 12.007a1.39 1.39 0 0 0 -1.103 .765l-.855 1.723l-1.907 .277c-.52 .072 -.96 .44 -1.124 .944l-.038 .14c-.1 .465 .046 .954 .393 1.29l1.377 1.337l-.326 1.892a1.393 1.393 0 0 0 2.018 1.465l1.708 -.895l1.708 .896a1.388 1.388 0 0 0 1.462 -.105l.112 -.09a1.39 1.39 0 0 0 .442 -1.272l-.324 -1.891l1.38 -1.339c.38 -.371 .516 -.924 .352 -1.427l-.051 -.134a1.39 1.39 0 0 0 -1.073 -.81l-1.908 -.279l-.853 -1.722a1.393 1.393 0 0 0 -1.247 -.772l-.143 .007z" />
      <path d="M11.857 2.007a1.39 1.39 0 0 0 -1.103 .765l-.855 1.723l-1.907 .277c-.52 .072 -.96 .44 -1.124 .944l-.038 .14c-.1 .465 .046 .954 .393 1.29l1.377 1.337l-.326 1.892a1.393 1.393 0 0 0 2.018 1.465l1.708 -.894l1.709 .896a1.388 1.388 0 0 0 1.462 -.105l.112 -.09a1.39 1.39 0 0 0 .442 -1.272l-.325 -1.892l1.38 -1.339c.38 -.371 .516 -.924 .352 -1.427l-.051 -.134a1.39 1.39 0 0 0 -1.073 -.81l-1.908 -.279l-.853 -1.722a1.393 1.393 0 0 0 -1.247 -.772l-.143 .007z" />
    </svg>
  }
  
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M17.8 19.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z" />
    <path d="M6.2 19.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z" />
    <path d="M12 9.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z" />
  </svg>
}

const makeSvgIcon = (SvgComponent: SVGIconComponent): ToolIconComponent => {
  return ({ sx, variant = 'outlined' }: { sx?: SxProps<Theme>, variant?: 'outlined' | 'filled' }) => {
    return <SvgIcon component={SvgComponent} variant={variant} sx={sx} />
  }
}

const PersonIcon: ToolIconComponent = makeSvgIcon(PersonIconSvg)
const LocationIcon: ToolIconComponent = makeSvgIcon(LocationIconSvg)
const MapIcon: ToolIconComponent = makeSvgIcon(MapIconSvg)
const AddressIcon: ToolIconComponent = makeSvgIcon(AddressIconSvg)
const StarsIcon: ToolIconComponent = makeSvgIcon(StarsIconSvg)

export const advancedComponentIcons: ToolIconRegistry = {
  Person: PersonIcon,
  Location: LocationIcon,
  Map: MapIcon,
  Address: AddressIcon,
  Stars: StarsIcon,
}

export const icons = advancedComponentIcons
