import React, { useCallback } from 'react'
import { TreeItem, TreeView } from '@mui/lab'
import { Checkbox, FormControlLabel } from '@mui/material'
import { ChevronRight, ExpandMore } from '@mui/icons-material'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { selectElement, selectSelectedElementKey } from './WizardSlice'
import { useSelector } from 'react-redux'

export interface RenderTree {
  id: string
  name: string
  children?: RenderTree[]
}

type Props = {
  data: RenderTree
  checkboxes?: boolean
  omitString?: string
}
export default function RecursiveTreeView({ data, checkboxes, omitString }: Props) {
  const [selected, setSelected] = React.useState<string[]>([])

  function getChildById(node: RenderTree, id: string) {
    let array: string[] = []

    function getAllChild(nodes: RenderTree | null) {
      if (nodes === null) return []
      array.push(nodes.id)
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllChild(node)]
          array = array.filter((v, i) => array.indexOf(v) === i)
        })
      }
      return array
    }

    function getNodeById(nodes: RenderTree, id: string) {
      if (nodes.id === id) {
        return nodes
      } else if (Array.isArray(nodes.children)) {
        let result = null
        nodes.children.forEach((node) => {
          if (!!getNodeById(node, id)) {
            result = getNodeById(node, id)
          }
        })
        return result
      }

      return null
    }

    return getAllChild(getNodeById(node, id))
  }

  function getOnChange(checked: boolean, nodes: RenderTree) {
    const allNode: string[] = getChildById(data, nodes.id)
    let array = checked ? [...selected, ...allNode] : selected.filter((value) => !allNode.includes(value))

    array = array.filter((v, i) => array.indexOf(v) === i)

    setSelected(array)
  }

  const RenderTree = ({ nodes, path, omitString }: { nodes: RenderTree; path: string[]; omitString?: string }) => {
    const newPath = [...path, nodes.id]
    const key = newPath.join('.')
    const dispatch = useAppDispatch()
    const handleSelect = useCallback(() => {
      const strippedKey = key.substring(omitString?.length ?? 0, key.length)
      dispatch(selectElement(strippedKey))
    }, [key, dispatch, omitString])
    return (
      <TreeItem
        key={key}
        nodeId={key}
        sx={{ textAlign: 'left' }}
        onClick={handleSelect}
        label={
          checkboxes ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected.some((item) => item === nodes.id)}
                  onChange={(event) => getOnChange(event.currentTarget.checked, nodes)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={<>{nodes.name}</>}
              key={key}
            />
          ) : (
            <>{nodes.name}</>
          )
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => <RenderTree nodes={node} path={newPath} omitString={omitString} />)
          : null}
      </TreeItem>
    )
  }
  const selectedKey = useSelector(selectSelectedElementKey)

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
      selected={[`${omitString || ''}${selectedKey || ''}`]}
    >
      <RenderTree nodes={data} path={[]} omitString={omitString} />
    </TreeView>
  )
}
