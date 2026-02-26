import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, IconButton, Popover, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch, selectJsonSchemaDefinitions, addSchemaDefinition } from '@formswizard/state';
import { JsonSchema } from '@formswizard/types';

interface AddDefinitionButtonProps {
  onNewDefinitionDemanded?: (name: string) => void;
  createNewDefinition?: (name: string) => { name: string, definition: JsonSchema };
}

export const AddDefinitionButton: React.FC<AddDefinitionButtonProps> = ({
  onNewDefinitionDemanded,
  createNewDefinition
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [definitionName, setDefinitionName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const dispatch = useAppDispatch();
  const definitions = useAppSelector(selectJsonSchemaDefinitions);

  // Focus the input when opening the popover
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClick = () => {
    setDefinitionName('');
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setDefinitionName('');
  };

  const validateName = (name: string): boolean => {
    // Validate pattern: must start with a letter, followed by letters, numbers, or spaces
    const pattern = /^[A-Za-z][A-Za-z0-9\s]*$/;
    return pattern.test(name);
  };

  const isNameUnique = (internalName: string): boolean => {
    if (!definitions) return true;
    return !definitions.hasOwnProperty(internalName);
  };

  const handleSave = useCallback(() => {
    if (!definitionName.trim()) {
      setError('Definition name is required');
      return;
    }

    if (!validateName(definitionName)) {
      setError('Name must start with a letter and contain only letters, numbers, and spaces');
      return;
    }


    let newDefinitionV = createNewDefinition?.(definitionName)
    const defName = newDefinitionV?.name || definitionName.replace(/\s/g, '_');
    if (!isNameUnique(defName)) {
      setError('A definition with this name already exists');
      return;
    }
    const newDefinition = newDefinitionV?.definition || {
      type: 'object',
      properties: {
        name: { type: "string" }
      }
    };

    try {
      dispatch(addSchemaDefinition({ name: defName, definition: newDefinition }));
      
      onNewDefinitionDemanded?.(defName);
      
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add definition');
    }
  }, [definitionName, onNewDefinitionDemanded, dispatch, createNewDefinition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDefinitionName(e.target.value);
    if (error && validateName(e.target.value) && isNameUnique(e.target.value)) {
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (validateName(definitionName) && isNameUnique(definitionName)) {
        handleSave();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  return (
    <>
      <IconButton 
        ref={buttonRef}
        aria-label="add definition" 
        onClick={handleClick}
        color="primary"
      >
        <AddIcon />
      </IconButton>
      
      <Popover
        open={isOpen}
        anchorEl={buttonRef.current}
        onClose={handleClose}
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
            value={definitionName}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error}
            size="small"
            autoFocus
            sx={{ mb: error ? 2 : 0 }}
            label="Definition Name"
            fullWidth 
            placeholder="Enter definition name"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <IconButton size="small" onClick={handleSave} color="primary">
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleClose} color="error">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Popover>
    </>
  );
};
