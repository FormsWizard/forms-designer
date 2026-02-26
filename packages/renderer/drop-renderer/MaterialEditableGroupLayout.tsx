import isEmpty from 'lodash-es/isEmpty';
import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import {
  GroupLayout,
  LayoutProps,
  RankedTester,
  rankWith,
  UISchemaElement,
  uiTypeIs,
  withIncreasedRank,
} from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { useIcon } from '@formswizard/tool-context';
import { LayoutWithDropZoneRenderer } from './LayoutWithDropZoneRenderer';
import { useAppDispatch, useAppSelector, selectSelectedPath, selectPath } from '@formswizard/state';
import { MaterialLabelableLayoutRendererProps } from '@jsonforms/material-renderers';

export const groupTester: RankedTester = rankWith(1, uiTypeIs('Group'));

export type ExtendedGroupLayout = GroupLayout & {
  options?: GroupLayout['options'] & {
    iconName?: string;
    scope?: string;
  };
}

const GroupComponent = React.memo(function GroupComponent({
  visible,
  enabled,
  uischema,
  label,
  path,
  ...props
}: MaterialLabelableLayoutRendererProps) {
  const groupLayout = uischema as ExtendedGroupLayout;
  const dispatch = useAppDispatch();
  const selectedPath = useAppSelector(selectSelectedPath);
  const CustomIcon = useIcon(groupLayout.options?.iconName);

  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      // @ts-ignore - using path from uischema similar to LayoutElement
      dispatch(selectPath((uischema as any).path));
    },
    [dispatch, uischema]
  );

  if (!visible) {
    return null;
  }

  // @ts-ignore - checking if this group is selected
  const isSelected = selectedPath === (uischema as any).path;

  return (
    <Card 
      onClick={handleSelect}
      sx={{
        marginBottom: '10px',
        cursor: 'pointer',
        transition: (theme) =>
          theme.transitions.create(['background-color', 'box-shadow', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
        backgroundColor: (theme) =>
          isSelected
            ? theme.palette.action.selected
            : 'inherit',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.action.hover,
          boxShadow: (theme) => theme.shadows[8],
          transform: 'translateY(-2px)',
        },
        '&:hover .MuiCardContent-root': {
          '& > *': {
            pointerEvents: 'auto',
          }
        }
      }}
    >
      {!isEmpty(label) && <CardHeader title={label} avatar={CustomIcon && <CustomIcon />} />}
      <CardContent>
        <LayoutWithDropZoneRenderer
          {...props}
          uischema={uischema as UISchemaElement}
          direction='column'
          visible={visible}
          enabled={enabled}
          elements={groupLayout.elements}
          path={path}
        />
      </CardContent>
    </Card>
  );
});

export const MaterializedGroupLayoutRenderer = ({
  uischema,
  schema,
  path,
  visible,
  enabled,
  renderers,
  cells,
  direction,
  label,
}: LayoutProps) => {
  const groupLayout = uischema as GroupLayout;

  return (
    <GroupComponent
      elements={groupLayout.elements}
      schema={schema}
      path={path}
      direction={direction}
      visible={visible}
      enabled={enabled}
      uischema={uischema}
      renderers={renderers}
      cells={cells}
      label={label}
    />
  );
};

export const MaterialEditableGroupLayoutRenderer = withJsonFormsLayoutProps(MaterializedGroupLayoutRenderer);

export const materialEditableGroupTester: RankedTester = withIncreasedRank(
  2,
  groupTester
);
