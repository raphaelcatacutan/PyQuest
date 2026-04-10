
interface CardProps {
  cardImg?: string;
  header?: string;
  body?: string;
  currProg?: number;
  maxProg?: number;
}

export default function Card({ cardImg, header, body, currProg=0, maxProg=0 }: CardProps){
  return (
    <div className="bg-header rounded-lg p-6 w-64 shadow-lg border border-gray-700 transition">
      <div className="h-32 bg-zinc-700 rounded mb-4"></div>
      <h3 className="text-white text-lg font-bold mb-2">{header ? header : "Header"}</h3>
      <p className="text-gray-400 text-sm mb-4">{body ? body : "..."}</p>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden"><div className="bg-purple-600 h-full rounded-full" style={{width: `${(currProg / maxProg) * 100}%`}}></div></div>
    </div>
  )
}