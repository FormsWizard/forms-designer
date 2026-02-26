import React, { useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from '@mui/material'
import { JsonForms } from '@jsonforms/react'
import { JsonFormsCore } from '@jsonforms/core'
import { materialRenderers } from '@jsonforms/material-renderers'

// JSON Schema for Nominatim data with essential fields
const nominatimSchema = {
  type: 'object',
  properties: {
    place_id: {
      type: 'number',
      title: 'Place ID',
      description: 'Unique identifier for the place'
    },
    osm_id: {
      type: 'number',
      title: 'OSM ID',
      description: 'OpenStreetMap identifier'
    },
    osm_type: {
      type: 'string',
      title: 'OSM Type',
      description: 'Type of OSM object (node, way, relation)'
    },
    display_name: {
      type: 'string',
      title: 'Display Name',
      description: 'Human-readable name of the location'
    },
    lat: {
      type: 'string',
      title: 'Latitude',
      description: 'Latitude coordinate'
    },
    lon: {
      type: 'string',
      title: 'Longitude',
      description: 'Longitude coordinate'
    },
    class: {
      type: 'string',
      title: 'Class',
      description: 'Main category of the place'
    },
    type: {
      type: 'string',
      title: 'Type',
      description: 'Specific type within the class'
    },
    importance: {
      type: 'number',
      title: 'Importance',
      description: 'Importance score (0-1)'
    },
    address: {
      type: 'object',
      title: 'Address Details',
      properties: {
        road: { type: 'string', title: 'Road' },
        neighbourhood: { type: 'string', title: 'Neighbourhood' },
        suburb: { type: 'string', title: 'Suburb' },
        city: { type: 'string', title: 'City' },
        state: { type: 'string', title: 'State' },
        postcode: { type: 'string', title: 'Postcode' },
        country: { type: 'string', title: 'Country' },
        country_code: { type: 'string', title: 'Country Code' }
      }
    }
  },
  required: ['place_id', 'display_name', 'lat', 'lon']
}

// UI Schema for better form layout
const nominatimUiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/place_id' },
        { type: 'Control', scope: '#/properties/osm_id' }
      ]
    },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/lat' },
        { type: 'Control', scope: '#/properties/lon' }
      ]
    },
    { type: 'Control', scope: '#/properties/display_name' },
    {
      type: 'HorizontalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/class' },
        { type: 'Control', scope: '#/properties/type' }
      ]
    },
    { type: 'Control', scope: '#/properties/importance' },
    { type: 'Control', scope: '#/properties/address' }
  ]
}

export interface NominatimDetailsDialogProps {
  open: boolean
  onClose: () => void
  onAccept: (data: any) => void
  onCancel: () => void
  data?: any
  onDataChange: (data: any) => void
  title?: string
}

export const NominatimDetailsDialog: React.FC<NominatimDetailsDialogProps> = ({
  open,
  onClose,
  onAccept,
  onCancel,
  data,
  onDataChange,
  title = 'Location Details'
}) => {

  const handleDataChange = useCallback((state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    onDataChange(state.data)
  }, [])

  const handleAccept = useCallback(() => {
    onAccept(data)
    onClose()
  }, [data, onAccept, onClose])

  const handleCancel = useCallback(() => {
    onCancel()
    onClose()
  }, [onCancel, onClose])

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '60vh' }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and edit the location details before confirming
        </Typography>
      </DialogTitle>

      <Divider />
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <JsonForms
            schema={nominatimSchema}
            uischema={nominatimUiSchema}
            data={data}
            renderers={materialRenderers}
            onChange={handleDataChange}
          />
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleCancel}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleAccept}
          color="primary"
          variant="contained"
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  )
}

