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

const LabelIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg
    {...defaultSvgStyles}
    {...getVariantSvgStyles(variant)}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M16.52 7H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10.52a1 1 0 0 0 .78-.375L21 12l-3.7-4.625A1 1 0 0 0 16.52 7" > </path>
  </svg>
}

const makeSvgIcon = (SvgComponent: SVGIconComponent): ToolIconComponent => {
  return ({ sx, variant = 'outlined' }: { sx?: SxProps<Theme>, variant?: 'outlined' | 'filled' }) => {
    return <SvgIcon component={SvgComponent} variant={variant} sx={sx} />
  }
}

const LabelIcon: ToolIconComponent = makeSvgIcon(LabelIconSvg)

// Info Icon - supports both outlined and filled variants
const InfoIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  if (variant === 'filled') {
    return <svg {...defaultSvgStyles} fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
    </svg>
  }
  
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 9h.01" />
    <path d="M11 12h1v4h1" />
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
  </svg>
}

// TextFields Icon - outlined only
const TextFieldsIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3" />
    <path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3" />
    <path d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7" />
    <path d="M5 7h-1a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h1" />
    <path d="M17 12h.01" />
    <path d="M13 12h.01" />
  </svg>
}

// Numbers Icon - outlined only
const NumbersIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 10l2 -2v8" />
    <path d="M9 8h3a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h3" />
    <path d="M17 8h2.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1 -1.5 1.5h-2.5" />
  </svg>
}

// Date Icon - supports both outlined and filled variants
const DateIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  if (variant === 'filled') {
    return <svg {...defaultSvgStyles} fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1m3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16z" />
      <path d="M8 14h2v2h-2z" />
    </svg>
  }
  
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
    <path d="M16 3l0 4" />
    <path d="M8 3l0 4" />
    <path d="M4 11l16 0" />
    <path d="M8 15h2v2h-2z" />
  </svg>
}

// Checkbox Icon - supports both outlined and filled variants
const CheckboxIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  if (variant === 'filled') {
    return <svg {...defaultSvgStyles} fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M18.333 2c1.96 0 3.56 1.537 3.662 3.472l.005 .195v12.666c0 1.96 -1.537 3.56 -3.472 3.662l-.195 .005h-12.666a3.667 3.667 0 0 1 -3.662 -3.472l-.005 -.195v-12.666c0 -1.96 1.537 -3.56 3.472 -3.662l.195 -.005h12.666zm-2.626 7.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
    </svg>
  }
  
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
}

const InfoIcon: ToolIconComponent = makeSvgIcon(InfoIconSvg)
const TextFieldsIcon: ToolIconComponent = makeSvgIcon(TextFieldsIconSvg)
const NumbersIcon: ToolIconComponent = makeSvgIcon(NumbersIconSvg)
const DateIcon: ToolIconComponent = makeSvgIcon(DateIconSvg)
const CheckboxIcon: ToolIconComponent = makeSvgIcon(CheckboxIconSvg)

// MultiLine Icon - outlined only
const MultiLineIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 6l16 0" />
    <path d="M4 12l16 0" />
    <path d="M4 18l12 0" />
  </svg>
}

// DateTime Icon - outlined only
const DateTimeIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M10.5 21h-4.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v3" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M4 11h10" />
    <path d="M18 18m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <path d="M18 16.5v1.5l.5 .5" />
  </svg>
}

// ArrowVertical Icon - outlined only
const ArrowVerticalIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M8 7l4 -4l4 4" />
    <path d="M8 17l4 4l4 -4" />
    <path d="M12 3l0 18" />
  </svg>
}

// ArrowHorizontal Icon - outlined only
const ArrowHorizontalIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M7 8l-4 4l4 4" />
    <path d="M17 8l4 4l-4 4" />
    <path d="M3 12l18 0" />
  </svg>
}

// Group Icon - outlined only
const GroupIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M8 8h8v8h-8z" />
    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
  </svg>
}

// RadioButton Icon - supports both outlined and filled variants
const RadioButtonIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  if (variant === 'filled') {
    return <svg {...defaultSvgStyles} fill="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 6.66a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z" />
    </svg>
  }
  
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
  </svg>
}

// List Icon - outlined only
const ListIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 6l11 0" />
    <path d="M9 12l11 0" />
    <path d="M9 18l11 0" />
    <path d="M5 6l0 .01" />
    <path d="M5 12l0 .01" />
    <path d="M5 18l0 .01" />
  </svg>
}

// SelectableList Icon - outlined only
const SelectableListIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  return <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M13 5h8" />
    <path d="M13 9h5" />
    <path d="M13 15h8" />
    <path d="M13 19h5" />
    <path d="M3 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
    <path d="M3 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
  </svg>
}

const MultiLineIcon: ToolIconComponent = makeSvgIcon(MultiLineIconSvg)
const DateTimeIcon: ToolIconComponent = makeSvgIcon(DateTimeIconSvg)
const ArrowVerticalIcon: ToolIconComponent = makeSvgIcon(ArrowVerticalIconSvg)
const ArrowHorizontalIcon: ToolIconComponent = makeSvgIcon(ArrowHorizontalIconSvg)
const GroupIcon: ToolIconComponent = makeSvgIcon(GroupIconSvg)
const RadioButtonIcon: ToolIconComponent = makeSvgIcon(RadioButtonIconSvg)
const ListIcon: ToolIconComponent = makeSvgIcon(ListIconSvg)
const SelectableListIcon: ToolIconComponent = makeSvgIcon(SelectableListIconSvg)

export const basicComponentIcons: ToolIconRegistry = {
  Label: LabelIcon,
  Info: InfoIcon,
  TextFields: TextFieldsIcon,
  Numbers: NumbersIcon,
  Date: DateIcon,
  Checkbox: CheckboxIcon,
  MultiLine: MultiLineIcon,
  DateTime: DateTimeIcon,
  ArrowVertical: ArrowVerticalIcon,
  ArrowHorizontal: ArrowHorizontalIcon,
  Group: GroupIcon,
  RadioButton: RadioButtonIcon,
  List: ListIcon,
  SelectableList: SelectableListIcon,
}

export const icons = basicComponentIcons