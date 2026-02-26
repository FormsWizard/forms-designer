'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box, IconButton, Popover, Tab, TabProps, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface TabComponentProps {
  children: React.ReactNode;
  isEditing: boolean;
  editedName: string;
  error: string | null;
  readonly: boolean;
  onEditClick: (e: React.MouseEvent) => void;
  onSaveEdit: (e: React.MouseEvent) => void;
  onCancelEdit: (e: React.MouseEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  [key: string]: any; // For spreading other props
}

const CustomTabComponent = React.forwardRef<HTMLDivElement, TabComponentProps>(
  ({ 
    children, 
    isEditing, 
    editedName, 
    error, 
    readonly, 
    onEditClick, 
    onSaveEdit, 
    onCancelEdit, 
    onInputChange, 
    onKeyDown,
    component: _, 
    ...props 
  }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const editButtonRef = useRef<HTMLButtonElement>(null);

    // Focus the input when entering edit mode
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    return (
      <Box ref={ref} display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box {...props} sx={{ display: 'flex', alignItems: 'center', ...props.sx }}>
          {children}
        </Box>
        <Popover
          open={isEditing}
          anchorEl={editButtonRef.current}
          onClose={onCancelEdit}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          sx={{ zIndex: 1300 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              minWidth: '200px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TextField
              inputRef={inputRef}
              value={editedName}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              error={!!error}
              helperText={error}
              size="small"
              autoFocus
              sx={{ mb: error ? 2 : 0 }}
              label="Definition Name"
              fullWidth />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <IconButton size="small" onClick={onSaveEdit} color="primary">
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={onCancelEdit} color="error">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Popover>
        {!readonly && (
          <IconButton
            ref={editButtonRef}
            size="small"
            onClick={onEditClick}
            sx={{ ml: -2 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  }
);

interface EditableTabProps {
  definitionName: string;
  onRename: (oldName: string, newName: string) => void;
  readonly?: boolean;
}

export const EditableTab: React.FC<EditableTabProps & TabProps> = ({
  definitionName,
  label,
  value,
  onRename,
  readonly = false,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(definitionName);
  const [error, setError] = useState<string | null>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedName(definitionName);
    setIsEditing(true);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setError(null);
  };

  const validateName = (name: string): boolean => {
    // Validate pattern: must start with a letter, followed by letters, numbers, or spaces
    const pattern = /^[A-Za-z][A-Za-z0-9\s]*$/;
    return pattern.test(name);
  };

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!validateName(editedName)) {
      setError('Name must start with a letter and contain only letters, numbers, and spaces');
      return;
    }

    // Convert spaces to underscores for internal representation
    const internalName = editedName.replace(/\s/g, '_');

    // Call the rename handler with the old and new names
    onRename(value, internalName);
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
    if (error && validateName(e.target.value)) {
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (validateName(editedName)) {
        handleSaveEdit(e as unknown as React.MouseEvent);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit(e as unknown as React.MouseEvent);
    }
  };

  // Display the label with spaces instead of underscores for better readability
  const displayLabel = useMemo(() => definitionName.replace(/_/g, ' '), [definitionName]);

  return (
    <Tab 
      label={displayLabel} 
      value={value} 
      {...props} 
      ref={tabRef}
      component={CustomTabComponent}
      isEditing={isEditing}
      editedName={editedName}
      error={error}
      readonly={readonly}
      onEditClick={handleEditClick}
      onSaveEdit={handleSaveEdit}
      onCancelEdit={handleCancelEdit}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
    />
  );
}; 
