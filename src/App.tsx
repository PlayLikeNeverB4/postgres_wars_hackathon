import { useCallback, useState } from 'react'

import {
  IconCheck,
  IconCopy,
} from "@tabler/icons-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

const PSQL_COMMAND = "psql 'postgresql://neondb_owner:npg_jS9oZer0mcNT@ep-holy-moon-a8hho9rg-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'"

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)
  const copyToClipboard = useCallback((content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
  }, [])

  return {
    copyToClipboard,
    isCopied,
  }
}

function App() {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const king = 'George';

  return (
    <main className="w-screen h-screen dark bg-background text-foreground flex flex-col gap-6 justify-center items-center">
      <h1 className="text-4xl">King of the hill: <span className="text-red-400">{king}</span></h1>
      <div className="w-screen px-50">
        <InputGroup>
          <InputGroupInput value={PSQL_COMMAND} readOnly className="font-mono" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Copy"
              title="Copy"
              size="icon-xs"
              onClick={() => {
                copyToClipboard(PSQL_COMMAND)
              }}
            >
              {isCopied ? <IconCheck /> : <IconCopy />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </main>
  )
}

export default App
