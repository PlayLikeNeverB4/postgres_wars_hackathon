import { useCallback, useEffect, useState } from 'react'
import { neon } from '@neondatabase/serverless'
import { compact } from 'lodash-es'

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

import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { utc } from "@date-fns/utc";

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

interface King {
  name: string;
  updated_at: string;
}

function App() {
  const { copyToClipboard, isCopied } = useCopyToClipboard()
  const [king, setKing] = useState<King>()
  const [prevKings, setPrevKings] = useState<King[]>([])

  const fetchUpdates = useCallback(async () => {
    const sql = neon(DATABASE_URL)
    const res = await sql`SELECT name, updated_at::text FROM owners LIMIT 1`
    const newKing = res[0] as King;
    setKing(king => {
      if (newKing?.name === king?.name) {
        return king
      }
      setPrevKings(prevKings => {
        if (king?.name !== prevKings[0]?.name) {
          return compact([king, ...prevKings.slice(0, 4)])
        }
        return prevKings
      })
      return newKing
    })
  }, [])

  useEffect(() => {
    fetchUpdates()
    const interval = setInterval(() => {
      fetchUpdates()
    }, 1000)
    return () => clearInterval(interval)
  }, [fetchUpdates])

  return (
    <main className="w-screen h-screen dark bg-background text-foreground flex flex-col gap-6 justify-center items-center">
      <h1 className="text-4xl flex flex-col items-center gap-3">
        <div>King of the hill ⚔️</div>
        <span className="text-red-400 flex flex-col gap items-center" dangerouslySetInnerHTML={{__html: king?.name ?? ''}} />
        {king?.updated_at !== undefined && (
          <div className="text-sm">
            (for {formatDistanceToNowStrict(parseISO(king.updated_at, { in: utc }))})
          </div>
        )}
      </h1>
      <div className="w-screen px-105">
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
      <div className="text-neutral-500 text-sm gap-2 flex flex-col items-center">
        <h2 className="text-base">Previous kings</h2>
        {prevKings.map(king => <div key={king.updated_at}>{king.name.substring(0, 50)}</div>)}
      </div>
    </main>
  )
}

export default App
