
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function FundingDashboard() {
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')
  const [minSpread, setMinSpread] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('fetch('https://funding-arbitrage-backend.onrender.com/funding')
')
      const result = await res.json()
      setData(result)
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const filtered = data
    .filter(d => d.spread >= minSpread)
    .filter(d => d.symbol.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Funding Arbitrage Dashboard</h1>

      <div className="flex gap-4 mb-4">
        <Input placeholder="Поиск пары (e.g., BTC/USDT)" value={search} onChange={e => setSearch(e.target.value)} />
        <Input type="number" step="0.0001" placeholder="Мин. спред (напр. 0.01)" value={minSpread} onChange={e => setMinSpread(parseFloat(e.target.value) || 0)} />
      </div>

      <Card className="bg-gray-900">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Пара</TableHead>
                <TableHead>Gate.io</TableHead>
                <TableHead>MEXC</TableHead>
                <TableHead>Спред</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell className="text-green-400">{item.gate_funding?.toFixed(4)}</TableCell>
                  <TableCell className="text-yellow-300">{item.mexc_funding?.toFixed(4)}</TableCell>
                  <TableCell className="text-cyan-300 font-semibold">{item.spread?.toFixed(4)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
