import { Box, IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DownloadIcon from '@mui/icons-material/Download'
import CheckIcon from '@mui/icons-material/Check'
import { useState, useCallback } from 'react'
import { useDesignerTranslation } from '@formswizard/i18n'

interface CodeBoxProps {
  content: string
  filename?: string
  maxHeight?: number | string
}

export function CodeBox({ content, filename = 'schema.json', maxHeight = 400 }: CodeBoxProps) {
  const { t } = useDesignerTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [content])

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [content, filename])

  return (
    <Box sx={{ position: 'relative', my: 1 }}>
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 0.5,
          zIndex: 1,
        }}
      >
        <Tooltip title={copied ? t('codeBox.copied') : t('codeBox.copyToClipboard')}>
          <IconButton size="small" onClick={handleCopy} sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}>
            {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title={t('codeBox.downloadAs', { filename })}>
          <IconButton size="small" onClick={handleDownload} sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        component="pre"
        sx={{
          overflow: 'auto',
          maxHeight,
          p: 2,
          pr: 8,
          m: 0,
          borderRadius: 1,
          bgcolor: 'grey.900',
          color: 'grey.100',
          fontSize: '0.8rem',
          fontFamily: 'monospace',
          whiteSpace: 'pre',
          border: 1,
          borderColor: 'divider',
        }}
      >
        {content}
      </Box>
    </Box>
  )
}
