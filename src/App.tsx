import { useCallback, useEffect, useState } from 'react'
import { neon } from '@neondatabase/serverless'

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

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL
const PSQL_COMMAND = `psql '${DATABASE_URL}'`

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

const fetchStuff = async () => {
  const sql = neon(DATABASE_URL)
  const data = await sql`
    SELECT version()
  `
  console.log(data)
}

function App() {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const king = 'George';

  useEffect(() => {
    fetchStuff()
  }, [])

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
