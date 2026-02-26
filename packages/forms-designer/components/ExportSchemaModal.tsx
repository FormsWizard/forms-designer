import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CloseIcon from '@mui/icons-material/Close'
import DownloadIcon from '@mui/icons-material/Download'
import {
  useAppSelector,
  selectRootJsonSchema,
  selectUiSchema,
  selectUiSchemas,
} from '@formswizard/state'
import { useDesignerTranslation } from '@formswizard/i18n'
import { useCallback } from 'react'
import { CodeBox } from './CodeBox'

interface ExportSchemaModalProps {
  open: boolean
  onClose: () => void
}

function buildDatePrefix(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function ExportSchemaModal({ open, onClose }: ExportSchemaModalProps) {
  const { t } = useDesignerTranslation()
  const rootJsonSchema = useAppSelector(selectRootJsonSchema)
  const uiSchema = useAppSelector(selectUiSchema)
  const uiSchemas = useAppSelector(selectUiSchemas)

  const jsonSchemaStr = JSON.stringify(rootJsonSchema, null, 2)
  const uiSchemaStr = JSON.stringify(uiSchema, null, 2)

  const otherUiSchemaEntries = Object.entries(uiSchemas || {}).filter(
    ([, value]) => value != null
  )

  const handleExportAll = useCallback(() => {
    const exportData = {
      jsonSchema: rootJsonSchema,
      uiSchema,
      uiSchemas: uiSchemas || {},
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${buildDatePrefix()}-forms-wizard.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [rootJsonSchema, uiSchema, uiSchemas])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="span">
          {t('exportModal.title')}
        </Typography>
        <Tooltip title={t('exportModal.exportAll')}>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleExportAll}
          >
            {t('exportModal.exportAll')}
          </Button>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('exportModal.jsonSchemaLabel')}
          </Typography>
          <CodeBox content={jsonSchemaStr} filename="jsonSchema.json" maxHeight={350} />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t('exportModal.uiSchemaLabel')}
          </Typography>
          <CodeBox content={uiSchemaStr} filename="uiSchema.json" maxHeight={350} />
        </Box>

        {otherUiSchemaEntries.length > 0 && (
          <Accordion disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">
                {t('exportModal.additionalUiSchemata', { count: otherUiSchemaEntries.length })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {otherUiSchemaEntries.map(([name, schema]) => (
                <Box key={name} sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    {name}
                  </Typography>
                  <CodeBox
                    content={JSON.stringify(schema, null, 2)}
                    filename={`uiSchema-${name}.json`}
                    maxHeight={250}
                  />
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" startIcon={<CloseIcon />}>
          {t('exportModal.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
